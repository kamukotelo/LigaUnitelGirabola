import 'server-only';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const PASSCODE = process.env.ADMIN_WRITE_PASSCODE;
const CLUB_DIRECTION_PASSCODE = process.env.CLUB_DIRECTION_PASSCODE;
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? PASSCODE;

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  const authClient = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await authClient.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error || !data.user?.email) return null;

  const { data: profile } = await getSupabaseAdmin()
    .from('ancaf_profiles')
    .select('full_name, role, must_change_password')
    .eq('id', data.user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') return null;

  return {
    email: data.user.email.toLowerCase(),
    name: profile.full_name?.trim() || data.user.email,
    profile: 'admin',
    mustChangePassword: profile.must_change_password === true,
  };
}

/**
 * Troca a palavra-passe de um administrador. Re-autentica com a senha atual
 * (defesa em profundidade), atualiza no Supabase Auth via service_role e
 * limpa a marca `must_change_password` no perfil.
 */
export async function changeAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: 'server_misconfigured' | 'invalid_credentials' | 'update_failed' }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { ok: false, error: 'server_misconfigured' };

  const normalizedEmail = email.trim().toLowerCase();
  const authClient = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await authClient.auth.signInWithPassword({ email: normalizedEmail, password: currentPassword });
  if (error || !data.user?.id) return { ok: false, error: 'invalid_credentials' };

  const admin = getSupabaseAdmin();
  const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, { password: newPassword });
  if (updateError) return { ok: false, error: 'update_failed' };

  await admin
    .from('ancaf_profiles')
    .update({ must_change_password: false, password_changed_at: new Date().toISOString() })
    .eq('id', data.user.id);

  return { ok: true };
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
