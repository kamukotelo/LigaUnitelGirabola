import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminClient from '@/components/AdminClient';
import AdminGuard from '@/components/AdminGuard';
import ChangePasswordGate from '@/components/ChangePasswordGate';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Administração ANCAF',
  description: 'Painel de gestão administrativa da Liga Unitel Girabola — uso interno ANCAF.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = getAdminSession(token);

  // O conteúdo e o bundle da consola só são enviados depois de a sessão ser
  // validada no servidor; não dependemos de esconder uma rota pública.
  if (!session) return <AdminGuard />;

  // Conta ainda com a senha provisória — não serve a consola até ser trocada.
  if (session.mustChangePassword) return <ChangePasswordGate email={session.email} />;

  return <AdminClient userProfile={session.profile} />;
}
