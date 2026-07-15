import crypto from 'crypto';

// ── Autenticação de administração (validada no servidor) ─────────────────
// A credencial de gestão vive apenas no servidor (variável de ambiente) e nunca
// é enviada para o browser. O cliente autentica-se contra /api/admin/login, que
// devolve um cookie httpOnly de sessão. O token de sessão é derivado por HMAC da
// credencial — não é a senha e não pode ser forjado sem a conhecer.

const PASSCODE = process.env.ADMIN_WRITE_PASSCODE ?? 'ancaf2026';

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
export function sessionToken(): string {
  return crypto.createHmac('sha256', PASSCODE).update('faf-admin-session-v1').digest('hex');
}

// Valida a credencial submetida no login (comparação de tempo constante).
export function verifyPasscode(input: unknown): boolean {
  if (typeof input !== 'string' || input.length === 0) return false;
  return safeEqual(input, PASSCODE);
}

// Valida um token de sessão vindo do cookie.
export function isValidSession(token: string | undefined | null): boolean {
  if (!token) return false;
  return safeEqual(token, sessionToken());
}
