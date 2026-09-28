import React from 'react';

interface BoardLogoProps {
  customLogoUrl?: string;
  size?: number;
  className?: string;
}

export const BoardLogo: React.FC<BoardLogoProps> = ({
  customLogoUrl,
  size = 66,
  className = '',
}) => {
  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="Institution Logo"
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`object-contain rounded-full shadow-xs ${className}`}
      />
    );
  }

  // Official Seal for Arian Institution Center & Arian ICT Corner, Kushtia
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative select-none shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="arian-sky" cx="50%" cy="38%" r="48%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="65%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          <linearGradient id="arian-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          <linearGradient id="arian-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86198f" />
            <stop offset="50%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#701a75" />
          </linearGradient>
        </defs>

        {/* Outer Golden Border */}
        <circle cx="50" cy="50" r="48" fill="url(#arian-gold)" stroke="#854d0e" strokeWidth="0.8" />

        {/* Security Magenta / Purple Band */}
        <circle cx="50" cy="50" r="43.5" fill="url(#arian-ring)" stroke="#fef08a" strokeWidth="0.6" />

        {/* Decorative Golden Star Beads */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <circle
            key={`bead-${deg}`}
            cx={50 + Math.cos((deg * Math.PI) / 180) * 40.5}
            cy={50 + Math.sin((deg * Math.PI) / 180) * 40.5}
            r="1"
            fill="#fef08a"
          />
        ))}

        {/* Inner White Ring with Gold Border */}
        <circle cx="50" cy="50" r="37" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />

        {/* Inner Sky Circle */}
        <circle cx="50" cy="50" r="35" fill="url(#arian-sky)" />

        {/* Golden Rising Sun */}
        <g transform="translate(50, 40)">
          <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325].map((deg) => (
            <line
              key={`sunray-${deg}`}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 16}
              y2={Math.sin((deg * Math.PI) / 180) * 16}
              stroke="#fef08a"
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Open Book of Knowledge */}
        <g transform="translate(50, 52)">
          <path
            d="M 0 0 C -6 -3 -15 -2 -19 2 L -19 9 C -15 5 -6 4 0 7 Z"
            fill="#ffffff"
            stroke="#1e3a8a"
            strokeWidth="0.5"
          />
          <path
            d="M 0 0 C 6 -3 15 -2 19 2 L 19 9 C 15 5 6 4 0 7 Z"
            fill="#ffffff"
            stroke="#1e3a8a"
            strokeWidth="0.5"
          />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#1e3a8a" strokeWidth="0.6" />
        </g>

        {/* ICT Computer / Laptop Screen Motif */}
        <g transform="translate(50, 68)">
          {/* Laptop Screen */}
          <rect x="-10" y="-8" width="20" height="12" rx="1" fill="#0f172a" stroke="#ca8a04" strokeWidth="0.6" />
          <rect x="-8.5" y="-6.5" width="17" height="9" fill="#38bdf8" />
          {/* Keyboard base */}
          <polygon points="-14,5 14,5 12,8 -12,8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.5" />
        </g>

        {/* Laurel Olive Wreath */}
        <path
          d="M 22 75 C 26 84 40 86 50 86 C 60 86 74 84 78 75"
          fill="none"
          stroke="#15803d"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
