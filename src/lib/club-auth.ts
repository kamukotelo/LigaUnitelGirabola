import 'server-only';
import { createHash, createHmac, randomBytes, randomInt } from 'node:crypto';
import { getNeonSql } from '@/lib/neon';

export const CLUB_COOKIE = 'ancaf_club_session';
export const CLUB_SESSION_SECONDS = 8 * 60 * 60;
export const CLUB_OTP_MINUTES = 10;

const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function hashCode(email: string, code: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET em falta.');
  return createHmac('sha256', secret).update(JSON.stringify(['club-otp', email, code])).digest('hex');
}

export async function issueClubCode(email: string): Promise<string | null> {
  const code = String(randomInt(1_000_000)).padStart(6, '0');
  const sql = getNeonSql();
  const issued = await sql`
    insert into public.ancaf_club_otp as otp (email, code_hash, expires_at)
      select email, ${hashCode(email, code)}, now() + ${CLUB_OTP_MINUTES}::integer * interval '1 minute'
      from public.ancaf_club_accounts where email = ${email} and active
    on conflict (email) do update set code_hash = excluded.code_hash,
      expires_at = excluded.expires_at, issued_at = now(), attempts = 0, used_at = null
    where otp.issued_at <= now() - interval '1 minute'
    returning email
  `;
  return issued.length ? code : null;
}

export async function verifyClubCode(email: string, code: string): Promise<string | null> {
  const digest = hashCode(email, code);
  const token = randomBytes(32).toString('base64url');
  const sql = getNeonSql();
  // A mesma atualização conta a tentativa, consome o código correto e permite
  // criar a sessão apenas quando o consumo ocorreu nesta operação.
  const sessions = await sql`
    with attempt as (
      update public.ancaf_club_otp otp
        set attempts = otp.attempts + 1,
            used_at = case when otp.code_hash = ${digest} then now() else null end
      from public.ancaf_club_accounts account
      where otp.email = ${email} and account.email = otp.email and account.active
        and otp.used_at is null and otp.expires_at > now() and otp.attempts < 5
      returning otp.email, account.team_id, otp.used_at
    )
    insert into public.ancaf_club_sessions (token_hash, email, team_id, expires_at)
      select ${hashToken(token)}, email, team_id, now() + ${CLUB_SESSION_SECONDS}::integer * interval '1 second'
      from attempt where used_at is not null
    returning email
  `;
  return sessions.length ? token : null;
}

export async function getClubSession(token: string | undefined) {
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) return null;
  const sql = getNeonSql();
  const [session] = await sql`
    select account.full_name, session.team_id
    from public.ancaf_club_sessions session
    join public.ancaf_club_accounts account
      on account.email = session.email and account.team_id = session.team_id
    where session.token_hash = ${hashToken(token)} and session.expires_at > now() and account.active
  ` as { full_name: string; team_id: string }[];
  return session ?? null;
}

export async function revokeClubSession(token: string | undefined) {
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) return;
  await getNeonSql()`delete from public.ancaf_club_sessions where token_hash = ${hashToken(token)}`;
}

export const CLUB_PORTAL_COOKIE = 'ancaf_club_portal';

export async function signInClub(username: string, password: string) {
  const token = randomBytes(32).toString('base64url');
  const sql = getNeonSql();
  const rows = await sql`
    with attempt as (
      update public.ancaf_club_logins
         set attempts = case when window_started_at <= now() - interval '15 minutes' then 1 else attempts + 1 end,
             window_started_at = case when window_started_at <= now() - interval '15 minutes' then now() else window_started_at end
       where username = ${username} and active
         and (attempts < 8 or window_started_at <= now() - interval '15 minutes')
      returning username, password_hash, credential_version
    )
    insert into public.ancaf_club_portal_sessions (token_hash, username, credential_version, expires_at)
      select ${hashToken(token)}, username, credential_version, now() + ${CLUB_SESSION_SECONDS}::integer * interval '1 second'
      from attempt where password_hash = crypt(${password}, password_hash)
    returning username
  `;
  return rows.length ? token : null;
}

export async function getClubPortalSession(token: string | undefined) {
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) return null;
  const [session] = await getNeonSql()`
    select account.username, account.team_id
    from public.ancaf_club_portal_sessions session
    join public.ancaf_club_logins account using (username, credential_version)
    where session.token_hash = ${hashToken(token)} and session.expires_at > now() and account.active
  ` as { username: string; team_id: string }[];
  return session ?? null;
}

export async function revokeClubPortalSession(token: string | undefined) {
  if (!token || !SESSION_TOKEN_PATTERN.test(token)) return;
  await getNeonSql()`delete from public.ancaf_club_portal_sessions where token_hash = ${hashToken(token)}`;
}
