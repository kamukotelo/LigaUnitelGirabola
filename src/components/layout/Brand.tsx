import Link from 'next/link';
import Image from 'next/image';

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
 * Marca oficial da competição: logotipo completo "LIGA UNITEL GIRABOLA"
 * (escudo + texto já incluídos na imagem oficial).
 * Usar sempre este componente para representar o nome da liga.
 */
export default function Brand({ size = 'md', href = '/', className = '' }: BrandProps) {
  const h = IMG_HEIGHT[size];
  // Proporção vertical do logo ≈ 1.25 : 1 (altura > largura)
  const w = Math.round(h / 1.25);

  const logo = (
    <Image
      src="/logo-girabola.png"
      alt="Liga Unitel Girabola"
      width={w}
      height={h}
      className="object-contain drop-shadow-[0_0_8px_rgba(210,80,0,0.4)] transition-transform duration-300 group-hover:scale-105"
      priority
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
