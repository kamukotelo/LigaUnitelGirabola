import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
      <nav aria-label="Navegação estrutural" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" size={13} />}
            {item.href ? <Link href={item.href} className="hover:text-primary">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </span>
        ))}
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
