import React from 'react';

interface KJCLogoProps {
  className?: string;
  variant?: 'full' | 'emblem' | 'horizontal' | 'masthead';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  showSubtitle?: boolean;
}

export const KJCLogo: React.FC<KJCLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  textColor = 'text-[#1E3A8A]',
  showSubtitle = true,
}) => {
  // Dimensions for emblem
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const EmblemSVG = (
    <svg
      viewBox="0 0 160 160"
      className={`${emblemSizes[size]} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Kristu Jayanti College Official Seal"
    >
      {/* Outer Circle with Decorative Beaded Border */}
      <circle cx="80" cy="80" r="76" stroke="#1E3A8A" strokeWidth="2.5" />
      <circle cx="80" cy="80" r="72" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="80" cy="80" r="54" stroke="#1E3A8A" strokeWidth="1.5" />

      {/* Circular Text Path for English & Kannada Inscription */}
      <path
        id="kjcUpperPath"
        d="M 28 80 A 52 52 0 1 1 132 80"
        fill="none"
      />
      <path
        id="kjcLowerPath"
        d="M 132 80 A 52 52 0 0 1 28 80"
        fill="none"
      />
      <text fill="#1E3A8A" fontSize="9" fontWeight="700" letterSpacing="1.2">
        <textPath href="#kjcUpperPath" startOffset="50%" textAnchor="middle">
          KRISTU JAYANTI COLLEGE
        </textPath>
      </text>
      <text fill="#1E3A8A" fontSize="7.5" fontWeight="600" letterSpacing="0.8">
        <textPath href="#kjcLowerPath" startOffset="50%" textAnchor="middle">
          LIGHT &amp; PROSPERITY
        </textPath>
      </text>

      {/* Decorative Star Accents */}
      <circle cx="28" cy="80" r="2" fill="#1E3A8A" />
      <circle cx="132" cy="80" r="2" fill="#1E3A8A" />

      {/* Radiating Sunburst Rays */}
      <g stroke="#1E3A8A" strokeWidth="1" opacity="0.85">
        <line x1="80" y1="52" x2="80" y2="40" />
        <line x1="68" y1="54" x2="62" y2="43" />
        <line x1="92" y1="54" x2="98" y2="43" />
        <line x1="58" y1="60" x2="49" y2="52" />
        <line x1="102" y1="60" x2="111" y2="52" />
        <line x1="50" y1="70" x2="40" y2="66" />
        <line x1="110" y1="70" x2="120" y2="66" />
      </g>

      {/* Academic Mortarboard Cap */}
      <path
        d="M 80 50 L 98 58 L 80 66 L 62 58 Z"
        fill="#1E3A8A"
      />
      <rect x="74" y="66" width="12" height="4" rx="1" fill="#1E3A8A" />
      <path
        d="M 98 58 L 98 70 L 96 72"
        stroke="#1E3A8A"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="96" cy="73" r="1.5" fill="#1E3A8A" />

      {/* Open Book of Knowledge */}
      <path
        d="M 60 76 Q 80 72 80 82 Q 80 72 100 76 L 100 94 Q 80 90 80 100 Q 80 90 60 94 Z"
        fill="#FFFFFF"
        stroke="#1E3A8A"
        strokeWidth="2"
      />
      <line x1="80" y1="82" x2="80" y2="100" stroke="#1E3A8A" strokeWidth="2" />
      {/* Book Text Lines */}
      <line x1="65" y1="82" x2="76" y2="80" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="65" y1="86" x2="76" y2="84" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="65" y1="90" x2="76" y2="88" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="84" y1="80" x2="95" y2="82" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="84" y1="84" x2="95" y2="86" stroke="#1E3A8A" strokeWidth="1" />
      <line x1="84" y1="88" x2="95" y2="90" stroke="#1E3A8A" strokeWidth="1" />

      {/* Glowing Lamp of Wisdom & Base */}
      <path
        d="M 72 104 Q 80 98 88 104 Q 84 109 80 109 Q 76 109 72 104 Z"
        fill="#1E3A8A"
      />
      <path
        d="M 79 97 Q 80 94 81 97 Q 82 99 80 101 Q 78 99 79 97 Z"
        fill="#D97706"
      />
      <rect x="74" y="109" width="12" height="3" rx="1" fill="#1E3A8A" />

      {/* Decorative Laurel Branches / Swags */}
      <path
        d="M 52 106 Q 66 122 80 123 Q 94 122 108 106"
        stroke="#1E3A8A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{EmblemSVG}</div>;
  }

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {EmblemSVG}

      <div className="flex flex-col justify-center">
        {/* Main Wordmark */}
        <div
          style={{ fontFamily: 'var(--font-serif)' }}
          className={`text-xl sm:text-2xl font-bold tracking-tight text-[#164282] leading-none`}
        >
          Kristu Jayanti College
        </div>

        {/* Sub-label Bar with "AUTONOMOUS" in filled block and "Bangalore" in serif */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="bg-[#164282] text-white text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.25em] px-2 py-0.5 uppercase leading-none">
            AUTONOMOUS
          </span>
          <span
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-xs sm:text-sm font-semibold italic text-stone-900 leading-none"
          >
            Bengaluru
          </span>
        </div>

        {/* Accreditation and Management Attribution */}
        {showSubtitle && (
          <div className="text-[9px] sm:text-[10px] text-stone-600 font-mono tracking-tight mt-1 leading-tight border-t border-stone-200 pt-0.5">
            Accredited <strong className="text-[#164282]">‘A++’</strong> Grade by NAAC · Managed by CMI Fathers
          </div>
        )}
      </div>
    </div>
  );
};
