import 'server-only';

/**
 * Envio do link de recuperação de palavra-passe. Usa a mesma conta Resend
 * das notificações editoriais (ver `src/lib/match-update-automation.ts`),
 * por chamada HTTP direta — o projeto não depende do SDK.
 */

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

export function isAdminMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && (process.env.ADMIN_NOTIFICATION_FROM || process.env.NEWS_NOTIFICATION_FROM));
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  link: string,
  validMinutes: number,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ADMIN_NOTIFICATION_FROM || process.env.NEWS_NOTIFICATION_FROM;
  if (!apiKey || !from) {
    return { ok: false, reason: 'RESEND_API_KEY ou ADMIN_NOTIFICATION_FROM não configurado.' };
  }

  const safeName = escapeHtml(name);
  const safeLink = escapeHtml(link);
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;color:#18181b">
      <h2 style="font-size:18px;margin:0 0 16px">Recuperação de palavra-passe</h2>
      <p style="margin:0 0 12px">Olá, ${safeName}.</p>
      <p style="margin:0 0 12px">
        Foi pedida a reposição da palavra-passe da sua conta na consola da Liga Unitel Girabola.
        Para definir uma nova, abra o link abaixo.
      </p>
      <p style="margin:0 0 20px">
        <a href="${safeLink}" style="display:inline-block;background:#c8102e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">
          Definir nova palavra-passe
        </a>
      </p>
      <p style="margin:0 0 12px;font-size:13px;color:#52525b">
        O link é válido durante ${validMinutes} minutos e só pode ser usado uma vez.
      </p>
      <p style="margin:0;font-size:13px;color:#52525b">
        Se não foi você a pedir, ignore esta mensagem — a palavra-passe atual continua válida.
      </p>
    </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Recuperação de palavra-passe — Consola ANCAF',
        html,
      }),
    });
    if (!response.ok) {
      const message = await response.text();
      return { ok: false, reason: `Serviço de e-mail respondeu ${response.status}: ${message.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: `Falha de ligação ao serviço de e-mail: ${String(error).slice(0, 200)}` };
  }
}
