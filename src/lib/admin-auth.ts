import 'server-only';
import crypto from 'crypto';
import { getNeonSql, isNeonConfigured } from '@/lib/neon';

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
      return null;
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
