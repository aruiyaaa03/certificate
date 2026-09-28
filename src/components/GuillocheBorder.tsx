import React from 'react';

interface GuillocheBorderProps {
  themeColor: 'magenta' | 'maroon' | 'navy' | 'emerald' | 'gold';
}

const COLOR_MAP = {
  magenta: {
    primary: '#9d174d', // rose-800
    secondary: '#be185d', // pink-700
    light: '#fbcfe8', // pink-200
    accent: '#831843',
    cornerGold: '#b45309',
    outerLine: '#831843',
  },
  maroon: {
    primary: '#881337',
    secondary: '#9f1239',
    light: '#fecdd3',
    accent: '#4c0519',
    cornerGold: '#b45309',
    outerLine: '#4c0519',
  },
  navy: {
    primary: '#1e3a8a',
    secondary: '#1d4ed8',
    light: '#bfdbfe',
    accent: '#172554',
    cornerGold: '#b45309',
    outerLine: '#172554',
  },
  emerald: {
    primary: '#065f46',
    secondary: '#047857',
    light: '#a7f3d0',
    accent: '#022c22',
    cornerGold: '#b45309',
    outerLine: '#022c22',
  },
  gold: {
    primary: '#854d0e',
    secondary: '#a16207',
    light: '#fef08a',
    accent: '#422006',
    cornerGold: '#92400e',
    outerLine: '#422006',
  },
};

export const GuillocheBorder: React.FC<GuillocheBorderProps> = ({ themeColor }) => {
  const colors = COLOR_MAP[themeColor] || COLOR_MAP.magenta;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1120 790"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Guilloche Lace Pattern Unit */}
          <pattern
            id={`guilloche-pat-${themeColor}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke={colors.secondary}
              strokeWidth="0.75"
              opacity="0.85"
            />
            <circle
              cx="0"
              cy="10"
              r="7"
              fill="none"
              stroke={colors.primary}
              strokeWidth="0.6"
              opacity="0.75"
            />
            <circle
              cx="20"
              cy="10"
              r="7"
              fill="none"
              stroke={colors.primary}
              strokeWidth="0.6"
              opacity="0.75"
            />
            <circle
              cx="10"
              cy="0"
              r="7"
              fill="none"
              stroke={colors.accent}
              strokeWidth="0.6"
              opacity="0.75"
            />
            <circle
              cx="10"
              cy="20"
              r="7"
              fill="none"
              stroke={colors.accent}
              strokeWidth="0.6"
              opacity="0.75"
            />
          </pattern>

          {/* Microprint security border line */}
          <pattern
            id={`security-strip-${themeColor}`}
            width="40"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0,3 L 10,0 L 20,3 L 30,0 L 40,3"
              fill="none"
              stroke={colors.primary}
              strokeWidth="0.5"
              opacity="0.65"
            />
          </pattern>
        </defs>

        {/* 1. Outermost Solid Frame */}
        <rect
          x="14"
          y="14"
          width="1092"
          height="762"
          fill="none"
          stroke={colors.outerLine}
          strokeWidth="2.5"
        />

        {/* 2. Secondary Thin Line */}
        <rect
          x="19"
          y="19"
          width="1082"
          height="752"
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.8"
        />

        {/* 3. The Intricate Guilloche Ribbon Border (18px wide) */}
        {/* Top ribbon */}
        <rect
          x="23"
          y="23"
          width="1074"
          height="18"
          fill={`url(#guilloche-pat-${themeColor})`}
          stroke={colors.primary}
          strokeWidth="0.5"
        />
        {/* Bottom ribbon */}
        <rect
          x="23"
          y="749"
          width="1074"
          height="18"
          fill={`url(#guilloche-pat-${themeColor})`}
          stroke={colors.primary}
          strokeWidth="0.5"
        />
        {/* Left ribbon */}
        <rect
          x="23"
          y="41"
          width="18"
          height="708"
          fill={`url(#guilloche-pat-${themeColor})`}
          stroke={colors.primary}
          strokeWidth="0.5"
        />
        {/* Right ribbon */}
        <rect
          x="1079"
          y="41"
          width="18"
          height="708"
          fill={`url(#guilloche-pat-${themeColor})`}
          stroke={colors.primary}
          strokeWidth="0.5"
        />

        {/* 4. Inner Double Accent Frame */}
        <rect
          x="44"
          y="44"
          width="1032"
          height="702"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.2"
        />
        <rect
          x="47"
          y="47"
          width="1026"
          height="696"
          fill="none"
          stroke={colors.outerLine}
          strokeWidth="0.6"
          strokeDasharray="4,3"
        />

        {/* 5. Four Ornate Traditional Corner Security Rosettes */}
        {[
          { cx: 32, cy: 32 }, // Top-Left
          { cx: 1088, cy: 32 }, // Top-Right
          { cx: 32, cy: 758 }, // Bottom-Left
          { cx: 1088, cy: 758 }, // Bottom-Right
        ].map((corner, idx) => (
          <g key={`corner-rosette-${idx}`}>
            {/* Outer corner rosette */}
            <circle
              cx={corner.cx}
              cy={corner.cy}
              r="17"
              fill="#ffffff"
              stroke={colors.primary}
              strokeWidth="1.2"
            />
            {/* Star-pattern petals */}
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <ellipse
                key={`petal-${idx}-${angle}`}
                cx={corner.cx}
                cy={corner.cy}
                rx="14"
                ry="4.5"
                transform={`rotate(${angle} ${corner.cx} ${corner.cy})`}
                fill="none"
                stroke={colors.secondary}
                strokeWidth="0.5"
                opacity="0.85"
              />
            ))}
            <circle
              cx={corner.cx}
              cy={corner.cy}
              r="6"
              fill={colors.primary}
              stroke="#ffffff"
              strokeWidth="1"
            />
            <circle cx={corner.cx} cy={corner.cy} r="2" fill="#ffffff" />
          </g>
        ))}

        {/* Corner Ornate L-Flourishes at inside border */}
        {[
          { x: 52, y: 52, rx: 1, ry: 1 },
          { x: 1068, y: 52, rx: -1, ry: 1 },
          { x: 52, y: 738, rx: 1, ry: -1 },
          { x: 1068, y: 738, rx: -1, ry: -1 },
        ].map((c, i) => (
          <path
            key={`inner-corner-${i}`}
            d={`M ${c.x} ${c.y + 14 * c.ry} L ${c.x} ${c.y} L ${c.x + 14 * c.rx} ${c.y}`}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
};
