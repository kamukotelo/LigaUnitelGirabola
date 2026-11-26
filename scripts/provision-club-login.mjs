import { randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const [teamId, clubUsername, rotation] = process.argv.slice(2);
const connection = process.env.DATABASE_URL;
if (!connection || !teamId || !/^[A-Z0-9]{2,12}$/.test(clubUsername ?? '') || (rotation && rotation !== '--rotate')) {
  console.error('Uso: node scripts/provision-club-login.mjs <id-do-clube> <SIGLA> [--rotate]. Requer DATABASE_URL.');
  process.exitCode = 1;
} else {
  const sql = neon(connection);
  const password = randomBytes(24).toString('base64url');
  try {
    const accounts = rotation
      ? await sql`
          with account as (
            update public.ancaf_club_logins
              set password_hash = crypt(${password}, gen_salt('bf', 12)), credential_version = gen_random_uuid(), attempts = 0, window_started_at = now()
            where team_id = ${teamId} and username = ${clubUsername}
            returning username
          ), revoked as (
            delete from public.ancaf_club_portal_sessions session
            using account where session.username = account.username
          )
          select username from account
        `
      : await sql`
          insert into public.ancaf_club_logins (team_id, username, password_hash)
          select id, ${clubUsername}, crypt(${password}, gen_salt('bf', 12))
          from public.ancaf_teams where id = ${teamId}
          on conflict do nothing
          returning username
        `;
    if (!accounts.length) {
      console.error('Clube/utilizador não encontrado ou credencial já criada.');
      process.exitCode = 1;
    } else {
      console.log(JSON.stringify({ username: accounts[0].username, password }));
    }
  } catch {
    console.error('Falha ao provisionar o acesso. Confirme a ligação ao Neon e a aplicação da migração.');
    process.exitCode = 1;
  }
}
