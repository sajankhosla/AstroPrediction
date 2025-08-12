import React from 'react';

// Simple zodiac wheel (360°) with 12 signs and planet markers
// Expects planetaryPositions: { PLANET: { longitude, house } }
const signLabels = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const planetLabels = {
  SUN: '☉', MOON: '☾', MERCURY: '☿', VENUS: '♀', MARS: '♂', JUPITER: '♃', SATURN: '♄'
};

function degToRad(deg) { return (deg * Math.PI) / 180; }

function longitudeToAngle(longitude) {
  // 0° Aries at the right (3 o'clock) and increasing counter-clockwise
  // SVG angle 0 at right, but svg y increases downwards; we invert y by using sin with negative
  return degToRad(-longitude);
}

const AstroChart = ({ planetaryPositions = {}, size = 520 }) => {
  const padding = 20;
  const dim = size;
  const cx = dim / 2;
  const cy = dim / 2;
  const outerR = (dim / 2) - padding;
  const innerR = outerR * 0.78;
  const tickR = outerR * 0.9;

  const planets = Object.entries(planetaryPositions);

  return (
    <div className="w-full flex justify-center">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        {/* Outer circle */}
        <circle cx={cx} cy={cy} r={outerR} fill="#111827" stroke="#4B5563" strokeWidth="2" />
        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="#1F2937" stroke="#374151" strokeWidth="1" />

        {/* 12 signs sectors and labels */}
        {Array.from({ length: 12 }).map((_, i) => {
          const start = longitudeToAngle(i * 30);
          const end = longitudeToAngle((i + 1) * 30);
          const mid = longitudeToAngle(i * 30 + 15);
          const x1 = cx + outerR * Math.cos(start);
          const y1 = cy + outerR * Math.sin(start);
          const x2 = cx + innerR * Math.cos(start);
          const y2 = cy + innerR * Math.sin(start);

          // radial division line
          return (
            <g key={`sector-${i}`}>
              <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#374151" strokeWidth="1" />
              <text
                x={cx + (innerR + (outerR - innerR) / 2) * Math.cos(mid)}
                y={cy + (innerR + (outerR - innerR) / 2) * Math.sin(mid)}
                fill="#D1D5DB"
                fontSize="11"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {signLabels[i]}
              </text>
            </g>
          );
        })}

        {/* 30° tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = longitudeToAngle(i * 30);
          const x1 = cx + outerR * Math.cos(a);
          const y1 = cy + outerR * Math.sin(a);
          const x2 = cx + tickR * Math.cos(a);
          const y2 = cy + tickR * Math.sin(a);
          return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6B7280" strokeWidth="2" />;
        })}

        {/* Planet markers */}
        {planets.map(([planet, pos], idx) => {
          const a = longitudeToAngle(pos.longitude);
          const r = (innerR + tickR) / 2;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          const label = planetLabels[planet] || planet.substring(0, 2);
          return (
            <g key={`planet-${planet}`}>
              <circle cx={px} cy={py} r={10} fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="1" />
              <text x={px} y={py} fill="#111827" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                {label}
              </text>
              <text x={px} y={py + 18} fill="#D1D5DB" fontSize="10" textAnchor="middle">
                {Math.round(pos.longitude)}° H{pos.house}
              </text>
            </g>
          );
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={4} fill="#9CA3AF" />
      </svg>
    </div>
  );
};

export default AstroChart;
