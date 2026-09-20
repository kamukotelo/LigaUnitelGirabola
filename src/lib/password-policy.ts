/**
 * Regras da palavra-passe da consola, partilhadas pelo servidor e pelo
 * cliente. Não importa nada do servidor — pode ser usado em componentes
 * de cliente sem arrastar segredos para o bundle.
 */

/** Comprimento mínimo de uma palavra-passe definitiva. */
export const MIN_PASSWORD_LENGTH = 10;

/**
 * Senha provisória atribuída pelo `scripts/create-ancaf-admins.mjs`. Está
 * documentada em `docs/CONTAS-ADMIN.md` e serve só para o 1.º acesso —
 * nunca pode ser aceite como palavra-passe definitiva.
 */
export const TEMP_PASSWORD = 'jabulani2026';

/** Valida uma palavra-passe nova. Devolve a mensagem de erro ou `null`. */
export function validateNewPassword(newPassword: string, currentPassword?: string): string | null {
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return `A nova palavra-passe tem de ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (newPassword === TEMP_PASSWORD) {
    return 'Escolha uma palavra-passe diferente da provisória.';
  }
  if (currentPassword && newPassword === currentPassword) {
    return 'A nova palavra-passe tem de ser diferente da atual.';
  }
  return null;
}
