import React from 'react';

interface SecurityWatermarkProps {
  themeColor: 'magenta' | 'maroon' | 'navy' | 'emerald' | 'gold';
  opacity: number;
  showRosettes: boolean;
  showSeal: boolean;
}

export const SecurityWatermark: React.FC<SecurityWatermarkProps> = ({
  themeColor,
  opacity,
  showRosettes,
  showSeal,
}) => {
  // Generate spirograph / hypotrochoid loops
  const rosettePetals = React.useMemo(() => {
    const petals: string[] = [];
    const numPetals = 48;
    const cx = 560;
    const cy = 415;
    const rx = 240;
    const ry = 110;

    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 360) / numPetals;
      petals.push(`rotate(${angle} ${cx} ${cy})`);
    }
    return { cx, cy, rx, ry, petals };
  }, []);

  const secondaryPetals = React.useMemo(() => {
    const petals: string[] = [];
    const numPetals = 36;
    const cx = 560;
    const cy = 415;
    const rx = 160;
    const ry = 70;

    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 360) / numPetals;
      petals.push(`rotate(${angle} ${cx} ${cy})`);
    }
    return { cx, cy, rx, ry, petals };
  }, []);

  const colorHex = {
    magenta: '#c026d3',
    maroon: '#e11d48',
    navy: '#2563eb',
    emerald: '#059669',
    gold: '#d97706',
  }[themeColor];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1120 790"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Security Micro-Line Waves */}
          <pattern
            id="security-waves"
            width="60"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,6 Q15,0 30,6 T60,6"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="0.25"
              opacity="0.3"
            />
            <path
              d="M0,12 Q15,6 30,12 T60,12"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.25"
              opacity="0.25"
            />
          </pattern>

          {/* Radial soft glow for security center */}
          <radialGradient id="center-radial" cx="50%" cy="52%" r="45%">
            <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f0fdf4" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#f0f9ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft pastel security paper background sheen */}
        <rect
          x="44"
          y="44"
          width="1032"
          height="702"
          fill="url(#center-radial)"
        />

        {/* Security wave pattern across entire certificate */}
        <rect
          x="44"
          y="44"
          width="1032"
          height="702"
          fill="url(#security-waves)"
        />

        {/* Center Guilloche Spirograph / Rosette */}
        {showRosettes && (
          <g>
            {/* Outer Giant Rosette */}
            {rosettePetals.petals.map((rot, idx) => (
              <ellipse
                key={`outer-${idx}`}
                cx={rosettePetals.cx}
                cy={rosettePetals.cy}
                rx={rosettePetals.rx}
                ry={rosettePetals.ry}
                transform={rot}
                fill="none"
                stroke={colorHex}
                strokeWidth="0.35"
                opacity={idx % 2 === 0 ? '0.7' : '0.4'}
              />
            ))}

            {/* Inner Intricate Rosette */}
            {secondaryPetals.petals.map((rot, idx) => (
              <ellipse
                key={`inner-${idx}`}
                cx={secondaryPetals.cx}
                cy={secondaryPetals.cy}
                rx={secondaryPetals.rx}
                ry={secondaryPetals.ry}
                transform={rot}
                fill="none"
                stroke="#0284c7"
                strokeWidth="0.3"
                opacity="0.45"
              />
            ))}

            {/* Concentric concentric guilloche rings */}
            {[50, 80, 110, 140, 170, 200, 230].map((radius) => (
              <circle
                key={`ring-${radius}`}
                cx={rosettePetals.cx}
                cy={rosettePetals.cy}
                r={radius}
                fill="none"
                stroke={colorHex}
                strokeWidth="0.3"
                strokeDasharray="2,3"
                opacity="0.35"
              />
            ))}
          </g>
        )}

        {/* Faint Center Bangladesh Board Seal Watermark */}
        {showSeal && (
          <g
            transform="translate(560, 415) scale(1.6)"
            opacity="0.12"
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="1.2"
          >
            <circle cx="0" cy="0" r="75" />
            <circle cx="0" cy="0" r="68" strokeDasharray="3,2" />
            <circle cx="0" cy="0" r="54" />
            {/* Sun rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={`sun-${deg}`}
                x1="0"
                y1="0"
                x2={Math.cos((deg * Math.PI) / 180) * 45}
                y2={Math.sin((deg * Math.PI) / 180) * 45}
                strokeWidth="0.75"
              />
            ))}
            {/* Book symbol */}
            <path
              d="M -25 15 Q 0 10 25 15 L 22 30 Q 0 25 -22 30 Z"
              fill="#1e3a8a"
              opacity="0.3"
            />
            {/* Boat symbol */}
            <path
              d="M -30 35 Q 0 45 30 35 L 20 42 Q 0 47 -20 42 Z"
              fill="#1e3a8a"
              opacity="0.4"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
