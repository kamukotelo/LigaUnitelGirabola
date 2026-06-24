import Link from 'next/link';
import Image from 'next/image';

type BrandSize = 'sm' | 'md' | 'lg';

const SIZES: Record<BrandSize, { box: string; img: number; liga: string; gira: string }> = {
  sm: { box: 'w-9 h-9', img: 36, liga: 'text-[10px]', gira: 'text-sm' },
  md: { box: 'w-12 h-12', img: 48, liga: 'text-[11px]', gira: 'text-lg' },
  lg: { box: 'w-16 h-16', img: 64, liga: 'text-sm', gira: 'text-2xl' },
};

interface BrandProps {
  size?: BrandSize;
  href?: string;
  className?: string;
}

/**
 * Marca oficial da competição: escudo + nome completo "LIGA UNITEL GIRABOLA".
 * Usar sempre este componente para representar o nome da liga.
 */
export default function Brand({ size = 'md', href = '/', className = '' }: BrandProps) {
  const s = SIZES[size];

  const content = (
    <>
      <div
        className={`shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-black/30 p-1 transition-all duration-300 group-hover:border-accent flex items-center justify-center ${s.box}`}
      >
        <Image
          src="/logo-girabola.png"
          alt="Liga Unitel Girabola"
          width={s.img}
          height={s.img}
          className="h-full w-full origin-top scale-[1.32] object-cover object-top"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold uppercase tracking-[0.18em] ${s.liga}`}>
          <span className="text-white">LIGA </span>
          <span className="text-[#9333EA]">UNITEL</span>
        </span>
        <span
          className={`font-display font-extrabold uppercase tracking-wider text-white ${s.gira}`}
        >
          GIRA<span className="text-accent">BOLA</span>
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`group flex items-center gap-3 ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-3 ${className}`}>{content}</div>;
}
