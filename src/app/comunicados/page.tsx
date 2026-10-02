import { Suspense } from 'react';
import { getOfficialCommunications } from '@/lib/data';
import PageHeader from '@/components/ui/PageHeader';
import ComunicadosClient from './ComunicadosClient';

export default function OfficialCommunicationsPage() {
  const communications = getOfficialCommunications();

  return (
    <main className="relative z-10 min-h-screen bg-background text-foreground">
      <div className="page-shell relative z-10">
        <PageHeader
          eyebrow="Informação institucional e regulamentar"
          title="Comunicados Oficiais"
          description="Informações, deliberações e notas oficiais da Liga Unitel Girabola e da Federação Angolana de Futebol (Conselho de Disciplina)."
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comunicados Oficiais' }]}
        />

        <Suspense fallback={<div className="py-12 text-center font-mono text-xs text-zinc-500">A carregar comunicados…</div>}>
          <ComunicadosClient communications={communications} />
        </Suspense>
      </div>
    </main>
  );
}
