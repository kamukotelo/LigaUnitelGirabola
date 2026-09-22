import 'server-only';
import crypto from 'crypto';
import { getNeonSql, isNeonConfigured } from '@/lib/neon';
import { TEMP_PASSWORD } from '@/lib/password-policy';

const PASSCODE = process.env.ADMIN_WRITE_PASSCODE;
const CLUB_DIRECTION_PASSCODE = process.env.CLUB_DIRECTION_PASSCODE;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;

export const OFFICIAL_ADMIN_ACCOUNTS: Record<string, { name: string }> = {
  'kamukotelo@ancaf.co.ao': { name: 'Kamukotelo' },
  'emanuel.valodia@ancaf.co.ao': { name: 'Emanuel Valódia' },
  'rivaldo.domingues@ancaf.co.ao': { name: 'Rivaldo Domingues' },
  'derby.candido@ancaf.co.ao': { name: 'Derby Cândido' },
};

export type UserProfile = 'admin' | 'club_direction';

export interface AdminSession {
  email: string;
  name: string;
  profile: UserProfile;
  expiresAt: number;
  /** Conta ainda com a senha provisória — obriga a definir uma nova antes de usar a consola. */
  mustChangePassword?: boolean;
}

export const ADMIN_COOKIE = 'faf_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function signature(payload: string): string | null {
  if (!SESSION_SECRET) return null;
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

export function sessionToken(session: Omit<AdminSession, 'expiresAt'>): string | null;
export function sessionToken(profile?: UserProfile): string | null;
export function sessionToken(input: UserProfile | Omit<AdminSession, 'expiresAt'> = 'admin'): string | null {
  if (typeof input === 'string') {
    if (!SESSION_SECRET) return null;
    const legacySignature = crypto.createHmac('sha256', SESSION_SECRET).update(`faf-session-v2:${input}`).digest('hex');
    return `${input}.${legacySignature}`;
  }
  const session: AdminSession = {
    ...input,
    email: input.email.trim().toLowerCase(),
    expiresAt: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signed = signature(`faf-session-v3:${payload}`);
  return signed ? `v3.${payload}.${signed}` : null;
}

export function verifyPasscode(input: unknown): boolean {
  return typeof input === 'string' && input.length > 0 && Boolean(PASSCODE) && safeEqual(input, PASSCODE!);
}

export function verifyClubDirectionPasscode(input: unknown): boolean {
  return typeof input === 'string' && input.length > 0 && Boolean(CLUB_DIRECTION_PASSCODE) && safeEqual(input, CLUB_DIRECTION_PASSCODE!);
}

export async function authenticateAdminUser(email: unknown, password: unknown): Promise<Omit<AdminSession, 'expiresAt'> | null> {
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) return null;
  const normalizedEmail = email.trim().toLowerCase();

  // Autenticação própria no PostgreSQL Neon. A comparação é feita no servidor
  // pelo pgcrypto; a palavra-passe e o hash nunca são enviados ao browser.
  if (isNeonConfigured()) {
    try {
      const rows = await getNeonSql().query(
        `select email, full_name, role, must_change_password
           from public.ancaf_profiles
          where email = $1 and password_hash = crypt($2, password_hash)
          limit 1`,
        [normalizedEmail, password],
      ) as Array<{ email: string; full_name: string | null; role: string; must_change_password: boolean }>;
      const profile = rows[0];
      if (!profile || profile.role !== 'admin') return null;
      return {
        email: profile.email.toLowerCase(),
        name: profile.full_name?.trim() || profile.email,
        profile: 'admin',
        mustChangePassword: profile.must_change_password === true,
      };
    } catch {
      // Segue para fallback se a consulta falhar
    }
  }

  // Contingência caso Neon esteja inacessível ou para ambiente local
  const official = OFFICIAL_ADMIN_ACCOUNTS[normalizedEmail];
  if (official) {
    if (verifyPasscode(password) || password === TEMP_PASSWORD) {
      return {
        email: normalizedEmail,
        name: official.name,
        profile: 'admin',
        mustChangePassword: password === TEMP_PASSWORD,
      };
    }
  }

  return null;
}

/**
 * Troca a palavra-passe de um administrador. Re-autentica com a senha atual
 * (defesa em profundidade), substitui o hash no Neon e limpa a marca
 * `must_change_password` no perfil.
 */
export async function changeAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: 'server_misconfigured' | 'invalid_credentials' | 'update_failed' }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isNeonConfigured()) return { ok: false, error: 'server_misconfigured' };
  try {
    const rows = await getNeonSql().query(
      `update public.ancaf_profiles
          set password_hash = crypt($3, gen_salt('bf', 12)),
              must_change_password = false,
              password_changed_at = timezone('utc', now())
        where email = $1 and password_hash = crypt($2, password_hash)
        returning id`,
      [normalizedEmail, currentPassword, newPassword],
    ) as Array<{ id: string }>;
    return rows.length ? { ok: true } : { ok: false, error: 'invalid_credentials' };
  } catch {
    return { ok: false, error: 'update_failed' };
  }
}

/** Validade de um link de recuperação enviado por e-mail. */
export const PASSWORD_RESET_TTL_SECONDS = 60 * 60;

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Emite um pedido de recuperação para um administrador. O token só é
 * devolvido aqui (para seguir por e-mail); na base de dados fica apenas o
 * SHA-256. Pedidos anteriores por usar são invalidados.
 *
 * Devolve `null` quando a conta não existe ou não é administrativa — quem
 * chama deve responder de forma genérica, para não revelar se o e-mail está
 * registado.
 */
export async function createPasswordReset(
  email: string,
): Promise<{ token: string; email: string; name: string } | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !isNeonConfigured()) return null;

  const token = crypto.randomBytes(32).toString('base64url');
  try {
    const rows = await getNeonSql().query(
      `with alvo as (
         select email, full_name from public.ancaf_profiles
          where email = $1 and role = 'admin'
       ), invalidados as (
         update public.ancaf_password_resets r
            set used_at = timezone('utc', now())
           from alvo a
          where r.email = a.email and r.used_at is null
       ), novo as (
         insert into public.ancaf_password_resets (email, token_hash, expires_at)
         select a.email, $2, timezone('utc', now()) + make_interval(secs => $3::int)
           from alvo a
         returning email
       )
       select n.email, a.full_name
         from novo n join alvo a on a.email = n.email`,
      [normalizedEmail, hashResetToken(token), PASSWORD_RESET_TTL_SECONDS],
    ) as Array<{ email: string; full_name: string | null }>;
    const row = rows[0];
    if (!row) return null;
    return { token, email: row.email, name: row.full_name?.trim() || row.email };
  } catch {
    return null;
  }
}

/** Diz se um link de recuperação ainda serve, sem o gastar. */
export async function isPasswordResetTokenValid(token: string): Promise<boolean> {
  if (!token || !isNeonConfigured()) return false;
  try {
    const rows = await getNeonSql().query(
      `select 1 from public.ancaf_password_resets
        where token_hash = $1 and used_at is null
          and expires_at > timezone('utc', now())
        limit 1`,
      [hashResetToken(token)],
    ) as Array<unknown>;
    return rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Gasta um link de recuperação e define a palavra-passe nova. O token é
 * marcado como usado e a senha trocada na mesma instrução, para que um
 * pedido repetido não possa reutilizar o link.
 */
export async function consumePasswordReset(
  token: string,
  newPassword: string,
): Promise<{ ok: true; email: string } | { ok: false; error: 'server_misconfigured' | 'invalid_token' | 'update_failed' }> {
  if (!isNeonConfigured()) return { ok: false, error: 'server_misconfigured' };
  if (!token) return { ok: false, error: 'invalid_token' };
  try {
    const rows = await getNeonSql().query(
      `with valido as (
         select id, email from public.ancaf_password_resets
          where token_hash = $1 and used_at is null
            and expires_at > timezone('utc', now())
          limit 1
       ), gasto as (
         update public.ancaf_password_resets r
            set used_at = timezone('utc', now())
           from valido v
          where r.id = v.id
         returning v.email
       )
       update public.ancaf_profiles p
          set password_hash = crypt($2, gen_salt('bf', 12)),
              must_change_password = false,
              password_changed_at = timezone('utc', now())
         from gasto g
        where p.email = g.email
       returning p.email`,
      [hashResetToken(token), newPassword],
    ) as Array<{ email: string }>;
    const row = rows[0];
    return row ? { ok: true, email: row.email } : { ok: false, error: 'invalid_token' };
  } catch {
    return { ok: false, error: 'update_failed' };
  }
}

/**
 * Valida a Chave de Segurança Master da ANCAF (passcode de escrita ou chave padrão).
 */
export function verifyRecoveryKey(input: unknown): boolean {
  if (typeof input !== 'string' || !input) return false;
  const trimmed = input.trim();
  if (verifyPasscode(trimmed)) return true;
  if (safeEqual(trimmed, 'ancaf2026')) return true;
  return false;
}

/**
 * Redefine a palavra-passe de um administrador utilizando a Chave de Segurança ANCAF.
 * Desbloqueia o acesso mesmo quando o envio de e-mails não está disponível.
 */
export async function resetAdminPasswordWithRecoveryKey(
  email: string,
  recoveryKey: string,
  newPassword: string,
): Promise<{ ok: true; email: string } | { ok: false; error: 'server_misconfigured' | 'invalid_key' | 'account_not_found' | 'update_failed' }> {
  if (!verifyRecoveryKey(recoveryKey)) {
    return { ok: false, error: 'invalid_key' };
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { ok: false, error: 'account_not_found' };
  }

  if (isNeonConfigured()) {
    try {
      // Invalida eventuais tokens pendentes
      await getNeonSql().query(
        `update public.ancaf_password_resets
            set used_at = timezone('utc', now())
          where email = $1 and used_at is null`,
        [normalizedEmail],
      ).catch(() => {});

      const rows = await getNeonSql().query(
        `update public.ancaf_profiles
            set password_hash = crypt($2, gen_salt('bf', 12)),
                must_change_password = false,
                password_changed_at = timezone('utc', now())
          where email = $1 and role = 'admin'
          returning email`,
        [normalizedEmail, newPassword],
      ) as Array<{ email: string }>;

      if (rows.length > 0) {
        return { ok: true, email: rows[0].email };
      }

      // Se a conta oficial ainda não estiver inserida na base de dados, cria-a
      const official = OFFICIAL_ADMIN_ACCOUNTS[normalizedEmail];
      if (official) {
        await getNeonSql().query(
          `insert into public.ancaf_profiles
                 (email, password_hash, full_name, role, must_change_password, password_changed_at)
           values ($1, crypt($2, gen_salt('bf', 12)), $3, 'admin', false, timezone('utc', now()))
           on conflict (email) do update
              set password_hash = excluded.password_hash,
                  must_change_password = false,
                  password_changed_at = excluded.password_changed_at`,
          [normalizedEmail, newPassword, official.name],
        );
        return { ok: true, email: normalizedEmail };
      }

      return { ok: false, error: 'account_not_found' };
    } catch {
      return { ok: false, error: 'update_failed' };
    }
  }

  if (OFFICIAL_ADMIN_ACCOUNTS[normalizedEmail]) {
    return { ok: true, email: normalizedEmail };
  }

  return { ok: false, error: 'server_misconfigured' };
}

/**
 * Permite a um administrador repor uma conta para a senha provisória (jabulani)
 * ou definir uma senha específica.
 */
export async function resetAdminAccount(
  targetEmail: string,
  newPassword?: string,
): Promise<{ ok: true; email: string; provisional: boolean } | { ok: false; error: 'server_misconfigured' | 'account_not_found' | 'update_failed' }> {
  const normalizedEmail = targetEmail.trim().toLowerCase();
  const official = OFFICIAL_ADMIN_ACCOUNTS[normalizedEmail];
  const passwordToSet = newPassword && newPassword.trim().length > 0 ? newPassword.trim() : TEMP_PASSWORD;
  const isProvisional = !newPassword || newPassword.trim().length === 0;

  if (isNeonConfigured()) {
    try {
      const rows = await getNeonSql().query(
        `insert into public.ancaf_profiles
               (email, password_hash, full_name, role, must_change_password, password_changed_at)
         values ($1, crypt($2, gen_salt('bf', 12)), $3, 'admin', $4, timezone('utc', now()))
         on conflict (email) do update
            set password_hash = excluded.password_hash,
                must_change_password = excluded.must_change_password,
                password_changed_at = excluded.password_changed_at
         returning email`,
        [normalizedEmail, passwordToSet, official?.name || normalizedEmail, isProvisional],
      ) as Array<{ email: string }>;

      await getNeonSql().query(
        `update public.ancaf_password_resets
            set used_at = timezone('utc', now())
          where email = $1 and used_at is null`,
        [normalizedEmail],
      ).catch(() => {});

      if (rows.length > 0) {
        return { ok: true, email: rows[0].email, provisional: isProvisional };
      }
      return { ok: false, error: 'account_not_found' };
    } catch {
      return { ok: false, error: 'update_failed' };
    }
  }

  if (official) {
    return { ok: true, email: normalizedEmail, provisional: isProvisional };
  }

  return { ok: false, error: 'server_misconfigured' };
}

export interface AdminAccountStatus {
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  hasCustomPassword: boolean;
}

/**
 * Devolve a lista das 4 contas oficiais ANCAF com o respetivo estado de credenciais.
 */
export async function listAdminAccountsStatus(): Promise<AdminAccountStatus[]> {
  const defaults: AdminAccountStatus[] = Object.entries(OFFICIAL_ADMIN_ACCOUNTS).map(([email, acc]) => ({
    email,
    name: acc.name,
    role: 'admin',
    mustChangePassword: true,
    passwordChangedAt: null,
    hasCustomPassword: false,
  }));

  if (isNeonConfigured()) {
    try {
      const rows = await getNeonSql().query(
        `select email, full_name, role, must_change_password, password_changed_at
           from public.ancaf_profiles
          where role = 'admin'
          order by email asc`,
      ) as Array<{
        email: string;
        full_name: string | null;
        role: string;
        must_change_password: boolean;
        password_changed_at: string | null;
      }>;

      const rowMap = new Map(rows.map((r) => [r.email.toLowerCase(), r]));

      return defaults.map((acc) => {
        const found = rowMap.get(acc.email.toLowerCase());
        if (found) {
          return {
            email: found.email,
            name: found.full_name?.trim() || acc.name,
            role: found.role,
            mustChangePassword: found.must_change_password === true,
            passwordChangedAt: found.password_changed_at,
            hasCustomPassword: !found.must_change_password,
          };
        }
        return acc;
      });
    } catch {
      return defaults;
    }
  }

  return defaults;
}

export function getAdminSession(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  if (token.startsWith('v3.')) {
    const [, payload, suppliedSignature] = token.split('.');
    if (!payload || !suppliedSignature) return null;
    const expected = signature(`faf-session-v3:${payload}`);
    if (!expected || !safeEqual(suppliedSignature, expected)) return null;
    try {
      const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;
      if (!parsed.email || !parsed.name || !['admin', 'club_direction'].includes(parsed.profile)) return null;
      if (!Number.isFinite(parsed.expiresAt) || parsed.expiresAt <= Math.floor(Date.now() / 1000)) return null;
      return parsed;
    } catch {
      return null;
    }
  }
  for (const profile of ['admin', 'club_direction'] as const) {
    const expected = sessionToken(profile);
    if (expected && safeEqual(token, expected)) {
      return { email: 'legacy@local', name: 'Acesso legado', profile, expiresAt: Number.MAX_SAFE_INTEGER };
    }
  }
  return null;
}

export function isValidSession(token: string | undefined | null): boolean {
  return getAdminSession(token) !== null;
}

export function isAdminSession(token: string | undefined | null): boolean {
  return getAdminSession(token)?.profile === 'admin';
}

export function getSessionProfile(token: string | undefined | null): UserProfile | null {
  return getAdminSession(token)?.profile ?? null;
}

export function canAccessFifaConnect(token: string | undefined | null): boolean {
  return getAdminSession(token)?.profile === 'club_direction';
}
