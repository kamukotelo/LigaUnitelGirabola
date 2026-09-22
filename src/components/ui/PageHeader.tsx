import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Breadcrumb = { label: string; href?: string };

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  breadcrumbs = [{ label: 'Início', href: '/' }],
  actions,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <nav aria-label="Navegação estrutural" className="mb-3 text-xs text-muted sm:mb-5">
        {breadcrumbs[0]?.href && (
          <Link href={breadcrumbs[0].href} className="inline-flex min-h-11 items-center gap-1 font-bold hover:text-primary sm:hidden">
            <ChevronLeft aria-hidden="true" size={14} /> Voltar
          </Link>
        )}
        <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" size={13} />}
            {item.href ? <Link href={item.href} className="hover:text-primary">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </span>
        ))}
        </div>
      </nav>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
          <h1 className="page-title">
            {title}{highlight ? <> <span className="text-primary">{highlight}</span></> : null}
          </h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
