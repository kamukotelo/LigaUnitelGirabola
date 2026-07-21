'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBrandLogo } from '@/lib/team-logos';

type BrandSize = 'sm' | 'md' | 'lg' | 'xl';

/** Altura do logo em px por tamanho. Mínimo de 40px conforme secção 2.7 (Redução) do Manual de Normas. */
const IMG_HEIGHT: Record<BrandSize, number> = {
  sm: 52,
  md: 76,
  lg: 112,
  xl: 144,
};

/**
 * Área de proteção mínima (secção 2.4 do Manual de Normas): unidade de
 * referência é a altura do "G" de Girabola. Aproximamos essa unidade a
 * ~18% da altura do lockup e reservamo-la como espaço livre à volta do logo.
 */
const PROTECTION_RATIO = 0.04;

interface BrandProps {
  size?: BrandSize;
  href?: string;
  className?: string;
}

function BrandImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  const isCustom = src.startsWith('data:') || (src.startsWith('http') && !src.includes('.supabase.co'));

  if (isCustom) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
    />
  );
}

/**
 * Marca oficial da competição: logotipo vetorial "LIGA UNITEL GIRABOLA"
 * (lockup de duas linhas: escudo + texto). Usar sempre este componente
 * para representar o nome da liga.
 *
 * Segue a secção 5.0 (Comportamento) do Manual de Normas: em fundos claros
 * usa-se a versão principal a cores; em fundos escuros usa-se a versão
 * monocromática negativa (branca), garantindo sempre o maior contraste.
 * Nenhum efeito de sombra, brilho ou distorção é aplicado ao logótipo
 * (secção 2.8, Utilização Incorrecta).
 */
export default function Brand({ size = 'md', href = '/', className = '' }: BrandProps) {
  const h = IMG_HEIGHT[size];
  // Ambas as versões (a cores e branca) partilham o MESMO enquadramento
  // 635×208, garantindo tamanho idêntico em modo claro e escuro.
  const w = Math.round((h * 635) / 208);
  const protection = Math.round(h * PROTECTION_RATIO);

  const eager = size === 'lg' || size === 'xl';

  const logoClear = useBrandLogo('logo_horizontal');
  const logoDark = useBrandLogo('logo_horizontal_white');

  const logo = (
    <span className="relative inline-flex items-center" style={{ padding: protection }}>
      {/* Fundo claro: versão principal a cores (secção 5.1) */}
      <BrandImage
        src={logoClear}
        alt="Liga Unitel Girabola"
        width={w}
        height={h}
        priority={eager}
        className="object-contain dark:hidden"
        style={{
          height: `${h}px`,
          width: `${w}px`,
          marginTop: `-${Math.round(h * 0.22)}px`,
          marginBottom: `-${Math.round(h * 0.20)}px`,
        }}
      />
      {/* Fundo escuro: versão monocromática negativa (secção 2.3), garantindo o maior contraste */}
      <BrandImage
        src={logoDark}
        alt="Liga Unitel Girabola"
        width={w}
        height={h}
        priority={eager}
        className="hidden object-contain dark:block"
        style={{
          height: `${h}px`,
          width: `${w}px`,
          marginTop: `-${Math.round(h * 0.22)}px`,
          marginBottom: `-${Math.round(h * 0.20)}px`,
        }}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={`flex items-center ${className}`}>
        {logo}
      </Link>
    );
  }

  return <div className={`flex items-center ${className}`}>{logo}</div>;
}
