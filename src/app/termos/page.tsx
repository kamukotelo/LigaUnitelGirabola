import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso · Liga Unitel Girabola',
  description: 'Termos e condições de utilização do portal oficial da Liga Unitel Girabola.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Aceitação dos Termos',
    body: [
      'Ao aceder e utilizar o portal da Liga Unitel Girabola ("o Portal"), o utilizador aceita ficar vinculado aos presentes Termos de Uso. Caso não concorde com qualquer disposição, deverá abster-se de utilizar o Portal.',
    ],
  },
  {
    title: '2. Objeto do Portal',
    body: [
      'O Portal disponibiliza informação desportiva sobre o Campeonato Nacional de Futebol de Angola, incluindo classificações, calendários, resultados, estatísticas, notícias e conteúdos multimédia. A informação é fornecida a título informativo.',
    ],
  },
  {
    title: '3. Utilização Permitida',
    body: [
      'O utilizador compromete-se a utilizar o Portal de forma lícita e a não praticar atos que possam comprometer a segurança, a integridade ou o normal funcionamento da plataforma, nomeadamente o acesso não autorizado a áreas reservadas.',
    ],
  },
  {
    title: '4. Propriedade Intelectual',
    body: [
      'As marcas, logótipos, emblemas dos clubes e demais conteúdos apresentados são propriedade dos respetivos titulares. É proibida a reprodução, distribuição ou modificação sem autorização prévia.',
    ],
  },
  {
    title: '5. Limitação de Responsabilidade',
    body: [
      'A Liga Unitel Girabola envida esforços para garantir a exatidão da informação, mas não se responsabiliza por eventuais erros, omissões ou indisponibilidades temporárias do serviço.',
    ],
  },
  {
    title: '6. Alterações',
    body: [
      'Os presentes Termos podem ser atualizados a qualquer momento. A versão em vigor é sempre a publicada nesta página.',
    ],
  },
  {
    title: '7. Contacto',
    body: [
      'Para questões relativas a estes Termos, utilize o canal de contacto oficial disponível na página de Contacto do Portal.',
    ],
  },
];

export default function TermosPage() {
  return (
    <main className="py-12 min-h-screen bg-background text-foreground relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              DOCUMENTO LEGAL
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display uppercase leading-none text-foreground">
            Termos de Uso
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-mono text-xs tracking-widest mt-3 uppercase">
            Última atualização: Julho de 2026
          </p>
        </header>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-display uppercase tracking-wide text-foreground mb-2">
                {section.title}
              </h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
