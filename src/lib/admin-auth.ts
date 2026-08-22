import crypto from 'crypto';

// ── Autenticação de administração (validada no servidor) ─────────────────
// A credencial de gestão vive apenas no servidor (variável de ambiente) e nunca
// é enviada para o browser. O cliente autentica-se contra /api/admin/login, que
// devolve um cookie httpOnly de sessão. O token de sessão é derivado por HMAC da
// credencial — não é a senha e não pode ser forjado sem a conhecer.

const PASSCODE = process.env.ADMIN_WRITE_PASSCODE ?? 'ancaf2026';
const CLUB_DIRECTION_PASSCODE = process.env.CLUB_DIRECTION_PASSCODE ?? PASSCODE;

export type UserProfile = 'admin' | 'club_direction';

export const ADMIN_COOKIE = 'faf_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual exige buffers do mesmo tamanho.
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Token de sessão determinístico derivado da credencial de gestão (server-side).
export function sessionToken(profile: UserProfile = 'admin'): string {
  const signature = crypto.createHmac('sha256', PASSCODE).update(`faf-session-v2:${profile}`).digest('hex');
  return `${profile}.${signature}`;
}

// Valida a credencial submetida no login (comparação de tempo constante).
export function verifyPasscode(input: unknown): boolean {
  if (typeof input !== 'string' || input.length === 0) return false;
  return safeEqual(input, PASSCODE);
}

export function verifyClubDirectionPasscode(input: unknown): boolean {
  if (typeof input !== 'string' || input.length === 0) return false;
  return safeEqual(input, CLUB_DIRECTION_PASSCODE);
}

// Valida um token de sessão vindo do cookie.
export function isValidSession(token: string | undefined | null): boolean {
  return getSessionProfile(token) !== null;
}

export function getSessionProfile(token: string | undefined | null): UserProfile | null {
  if (!token) return null;
  for (const profile of ['admin', 'club_direction'] as const) {
    if (safeEqual(token, sessionToken(profile))) return profile;
  }
  return null;
}

export function canAccessFifaConnect(token: string | undefined | null): boolean {
  return getSessionProfile(token) === 'club_direction';
}
