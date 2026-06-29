'use client';

import React from 'react';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();

  // Render high-quality vector SVG crests for each team based on their official branding
  const renderSvg = () => {
    switch (cleanId) {
      case 'saosalvador':
        // São Salvador do Kongo: Blue/yellow crest with a red shield/cross in the middle
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#00529B" stroke="#F9C304" strokeWidth="4" />
            <circle cx="50" cy="50" r="35" fill="#FFFFFF" />
            <path d="M42 30 H58 V70 H42 Z" fill="#D21515" />
            <path d="M30 42 H70 V58 H30 Z" fill="#D21515" />
            <circle cx="50" cy="50" r="10" fill="#F9C304" />
          </svg>
        );

      case 'petro':
        // Petro de Luanda: Yellow circle with blue trim and oil derrick / anchor inside
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#F9C304" stroke="#00529B" strokeWidth="5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#D21515" strokeWidth="2" />
            {/* Oil derrick / Anchor symbol */}
            <path d="M50 20 L65 75 H35 Z" fill="none" stroke="#00529B" strokeWidth="6" strokeLinejoin="round" />
            <path d="M42 45 H58 M38 60 H62" stroke="#00529B" strokeWidth="4" />
            <circle cx="50" cy="20" r="6" fill="#D21515" />
          </svg>
        );

      case 'lobito':
        // Académica do Lobito: Black and white circular stripes logo
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#000000" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="#FFFFFF" />
            <path d="M25 25 L75 75 M15 50 L85 50 M25 75 L75 25" stroke="#000000" strokeWidth="6" />
            <circle cx="50" cy="50" r="22" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
            <text x="50" y="56" fill="#FFFFFF" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ACA</text>
          </svg>
        );

      case 'wiliete':
        // Wiliete de Benguela: Green and yellow crest
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M50 10 C75 10, 85 25, 85 55 C85 80, 50 92, 50 92 C50 92, 15 80, 15 55 C15 25, 25 10, 50 10 Z" fill="#008751" stroke="#F9C304" strokeWidth="4" />
            <path d="M50 20 C68 20, 75 32, 75 55 C75 72, 50 82, 50 82 C50 82, 25 72, 25 55 C25 32, 32 20, 50 20 Z" fill="#F9C304" />
            {/* Center leaf/bird detail */}
            <path d="M50 30 C40 45, 45 65, 50 72 C55 65, 60 45, 50 30 Z" fill="#008751" />
          </svg>
        );

      case 'libolo':
        // Recreativo do Libolo: Blue shield with orange trim and stripes
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M15 15 H85 V50 C85 75, 50 90, 50 90 C50 90, 15 75, 15 50 Z" fill="#00529B" stroke="#FF6600" strokeWidth="4" />
            <path d="M25 25 L75 25 V48 C75 68, 50 80, 50 80 C50 80, 25 68, 25 48 Z" fill="#FF6600" opacity="0.3" />
            <path d="M50 15 V90" stroke="#FF6600" strokeWidth="6" />
            <circle cx="50" cy="45" r="14" fill="#FF6600" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        );

      case 'dago':
        // 1.º de Agosto: Red and black stripes with a central gold star
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M15 15 H85 V50 C85 75, 50 90, 50 90 C50 90, 15 75, 15 50 Z" fill="#D21515" stroke="#000000" strokeWidth="4" />
            <path d="M15 15 L85 85 L85 50 C85 75, 50 90, 50 90 L15 15" fill="#000000" />
            {/* Gold Star */}
            <polygon points="50,22 55,37 71,37 58,47 63,62 50,52 37,62 42,47 29,37 45,37" fill="#F9C304" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
        );

      case 'cabinda':
        // FC Cabinda: Green and white shield logo
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M50 10 C75 10, 85 25, 85 55 C85 80, 50 92, 50 92 C50 92, 15 80, 15 55 C15 25, 25 10, 50 10 Z" fill="#008751" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M50 10 L85 55 L50 92 Z" fill="#FFFFFF" />
            <text x="50" y="55" fill="#008751" fontSize="22" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">FCC</text>
          </svg>
        );

      case 'desphuila':
        // Desportivo da Huíla: Red/white shield with a ball
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M15 15 H85 V50 C85 75, 50 90, 50 90 C50 90, 15 75, 15 50 Z" fill="#FFFFFF" stroke="#D21515" strokeWidth="4" />
            <path d="M15 15 H85 V30 H15 Z" fill="#D21515" />
            <circle cx="50" cy="60" r="18" fill="#FFFFFF" stroke="#D21515" strokeWidth="3" />
            <path d="M50 42 V78 M32 60 H68" stroke="#D21515" strokeWidth="2" />
          </svg>
        );

      case 'caala':
        // CR Caála: Blue circular crest with white borders/stripes
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#00529B" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 3" />
            <path d="M30 50 H70" stroke="#FFFFFF" strokeWidth="4" />
            <text x="50" y="44" fill="#FFFFFF" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">C.R.</text>
            <text x="50" y="66" fill="#FFFFFF" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">CAÁLA</text>
          </svg>
        );

      case 'bravos':
        // Bravos do Maquis: Green diamond/triangle crest with white border
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <polygon points="50,10 90,50 50,90 10,50" fill="#008751" stroke="#FFFFFF" strokeWidth="4" />
            <polygon points="50,20 80,50 50,80 20,50" fill="#FFFFFF" />
            <text x="50" y="58" fill="#008751" fontSize="24" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">M</text>
          </svg>
        );

      case 'fcluanda':
        // FC Luanda: Blue shield with red/white circle
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M15 15 H85 V50 C85 75, 50 90, 50 90 C50 90, 15 75, 15 50 Z" fill="#00529B" stroke="#D21515" strokeWidth="4" />
            <circle cx="50" cy="45" r="20" fill="#FFFFFF" stroke="#D21515" strokeWidth="3" />
            <circle cx="50" cy="45" r="12" fill="#D21515" />
          </svg>
        );

      case 'kabuscorp':
        // Kabuscorp SC: Red and white logo with star
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#D21515" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="50" cy="50" r="36" fill="#FFFFFF" />
            <path d="M50 14 L50 86" stroke="#D21515" strokeWidth="8" />
            <path d="M14 50 L86 50" stroke="#D21515" strokeWidth="8" />
            <circle cx="50" cy="50" r="16" fill="#D21515" />
            <polygon points="50,42 53,47 59,47 54,51 56,57 50,53 44,57 46,51 41,47 47,47" fill="#FFFFFF" />
          </svg>
        );

      case 'interclube':
        // GD Interclube: Blue circle police sports logo
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#00529B" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="50" cy="50" r="37" fill="#FFFFFF" />
            {/* Police Star */}
            <polygon points="50,18 58,35 76,35 62,45 67,62 50,52 33,62 38,45 24,35 42,35" fill="#00529B" />
            <circle cx="50" cy="42" r="8" fill="#F9C304" />
          </svg>
        );

      case 'lundasul':
        // Desportivo da Lunda Sul: Green/blue/yellow shield
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M50 10 C75 10, 85 25, 85 55 C85 80, 50 92, 50 92 C50 92, 15 80, 15 55 C15 25, 25 10, 50 10 Z" fill="#008751" stroke="#00529B" strokeWidth="4" />
            <path d="M50 10 L85 55 L50 92 Z" fill="#00529B" />
            <polygon points="50,30 65,45 50,60 35,45" fill="#F9C304" />
          </svg>
        );

      case 'primeiromaio':
        // Estrela 1.º de Maio: Red star logo on white/red background
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#D21515" stroke="#FFFFFF" strokeWidth="4" />
            <circle cx="50" cy="50" r="35" fill="#FFFFFF" />
            <polygon points="50,20 58,38 78,38 62,50 68,70 50,58 32,70 38,50 22,38 42,38" fill="#D21515" />
          </svg>
        );

      case 'sagrada':
        // Sagrada Esperança: Green and black diamond/crest logo
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <polygon points="50,10 90,50 50,90 10,50" fill="#008751" stroke="#000000" strokeWidth="4" />
            <polygon points="50,18 82,50 50,82 18,50" fill="#000000" />
            <polygon points="50,28 72,50 50,72 28,50" fill="#008751" />
            <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
          </svg>
        );

      default:
        // Default placeholder crest
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M50 10 C75 10, 85 25, 85 55 C85 80, 50 92, 50 92 C50 92, 15 80, 15 55 C15 25, 25 10, 50 10 Z" fill="#71717A" stroke="#3F3F46" strokeWidth="4" />
            <text x="50" y="58" fill="#FFFFFF" fontSize="22" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              {cleanId.substring(0, 2).toUpperCase()}
            </text>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center flex-shrink-0 bg-transparent rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {renderSvg()}
    </div>
  );
}
