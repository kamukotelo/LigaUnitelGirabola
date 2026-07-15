import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Políticas de Privacidade · Liga Unitel Girabola',
  description: 'Como o portal oficial da Liga Unitel Girabola recolhe, utiliza e protege os dados pessoais.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Introdução',
    body: [
      'A presente Política de Privacidade descreve como a Liga Unitel Girabola ("nós") trata os dados pessoais dos utilizadores do Portal, em conformidade com a legislação angolana aplicável em matéria de proteção de dados.',
    ],
  },
  {
    title: '2. Dados Recolhidos',
    body: [
      'Recolhemos apenas os dados que o utilizador nos fornece voluntariamente, nomeadamente através do formulário de contacto (nome, endereço de email e mensagem) e, quando aplicável, do formulário de subscrição de alertas (endereço de email).',
    ],
  },
  {
    title: '3. Finalidade do Tratamento',
    body: [
      'Os dados são utilizados exclusivamente para responder a pedidos de contacto, prestar apoio técnico e, mediante consentimento, enviar notificações e novidades sobre a competição. Não vendemos nem cedemos dados pessoais a terceiros para fins comerciais.',
    ],
  },
  {
    title: '4. Conservação',
    body: [
      'Os dados são conservados apenas pelo período necessário ao cumprimento das finalidades para as quais foram recolhidos, ou enquanto durar a relação com o utilizador.',
    ],
  },
  {
    title: '5. Direitos do Titular',
    body: [
      'O utilizador tem o direito de aceder, retificar, atualizar ou solicitar a eliminação dos seus dados pessoais, bem como de retirar o consentimento a qualquer momento, contactando-nos através do canal oficial.',
    ],
  },
  {
    title: '6. Segurança',
    body: [
      'Adotamos medidas técnicas e organizativas razoáveis para proteger os dados pessoais contra o acesso não autorizado, a perda ou a divulgação indevida.',
    ],
  },
  {
    title: '7. Alterações',
    body: [
      'Esta Política pode ser atualizada periodicamente. A versão em vigor é sempre a publicada nesta página.',
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <main className="py-12 min-h-screen bg-background text-foreground relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              DOCUMENTO LEGAL
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display uppercase leading-none text-foreground">
            Políticas de Privacidade
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
