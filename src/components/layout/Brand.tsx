import Link from 'next/link';

type BrandSize = 'sm' | 'md' | 'lg';

/** Altura do logo em px por tamanho */
const IMG_HEIGHT: Record<BrandSize, number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

interface BrandProps {
  size?: BrandSize;
  href?: string;
  className?: string;
}

/**
 * Marca oficial da competição: logotipo vetorial "LIGA UNITEL GIRABOLA"
 * (lockup de duas linhas: escudo + texto). Usar sempre este componente
 * para representar o nome da liga.
 */
export default function Brand({ size = 'md', href = '/', className = '' }: BrandProps) {
  const h = IMG_HEIGHT[size];
  // Proporção do logotipo de duas linhas ≈ 396 : 219
  const w = Math.round((h * 396) / 219);

  const logo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-girabola-horizontal.png"
      alt="Liga Unitel Girabola"
      width={w}
      height={h}
      className="object-contain drop-shadow-[0_0_8px_rgba(210,80,0,0.4)] transition-transform duration-300 group-hover:scale-105"
    />
  );

  if (href) {
    return (
      <Link href={href} className={`group flex items-center ${className}`}>
        {logo}
      </Link>
    );
  }

  return <div className={`flex items-center ${className}`}>{logo}</div>;
}
