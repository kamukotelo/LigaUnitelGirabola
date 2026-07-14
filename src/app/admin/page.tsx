import type { Metadata } from 'next';
import AdminClient from '@/components/AdminClient';
import AdminGuard from '@/components/AdminGuard';

export const metadata: Metadata = {
  title: 'Administração FAF',
  description: 'Painel de gestão administrativa da Liga Unitel Girabola — uso interno FAF.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminClient />
    </AdminGuard>
  );
}
