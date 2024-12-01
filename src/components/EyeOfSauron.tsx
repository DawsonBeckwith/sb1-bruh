import React from 'react';

export default function EyeOfSauron() {
  return (
    <div className="relative w-28 h-28 group">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="1">
              <animate
                attributeName="stopColor"
                values="#4ade80;#22c55e;#15803d;#4ade80"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
          </radialGradient>

          <filter id="fireEffect">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.05"
              numOctaves="5"
              seed="2"
            >
              <animate
                attributeName="baseFrequency"
                values="0.01 0.05;0.02 0.07;0.01 0.05"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                from="2"
                to="100"
                dur="3s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="8" />
          </filter>

          <filter id="glowEffect">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#4ade80" floodOpacity="0.8" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="flamePattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M0,0 L2,4 L4,0" fill="none" stroke="url(#eyeGlow)" strokeWidth="0.5">
              <animate
                attributeName="d"
                values="M0,0 L2,4 L4,0;M0,1 L2,3 L4,1;M0,0 L2,4 L4,0"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </pattern>
        </defs>

        {/* Dynamic Energy Field */}
        <g filter="url(#fireEffect)" className="animate-pulse">
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) * Math.PI / 180;
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            return (
              <path
                key={i}
                d={`M50,50 Q${x},${y} ${50 + 45 * Math.cos(angle + 0.2)},${50 + 45 * Math.sin(angle + 0.2)}`}
                stroke="url(#eyeGlow)"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              >
                <animate
                  attributeName="d"
                  values={`M50,50 Q${x},${y} ${50 + 45 * Math.cos(angle + 0.2)},${50 + 45 * Math.sin(angle + 0.2)};
                          M50,50 Q${x + 5},${y - 5} ${50 + 45 * Math.cos(angle - 0.2)},${50 + 45 * Math.sin(angle - 0.2)};
                          M50,50 Q${x},${y} ${50 + 45 * Math.cos(angle + 0.2)},${50 + 45 * Math.sin(angle + 0.2)}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            );
          })}
        </g>

        {/* Flame Ring */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#flamePattern)"
          strokeWidth="4"
          filter="url(#fireEffect)"
          opacity="0.6"
          className="group-hover:opacity-80"
        >
          <animate
            attributeName="r"
            values="42;40;42"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Main Eye Circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="url(#eyeGlow)"
          filter="url(#glowEffect)"
          className="group-hover:scale-105 transition-all duration-500"
        >
          <animate
            attributeName="r"
            values="35;33;35"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Living Pupil */}
        <ellipse
          cx="50"
          cy="50"
          rx="4"
          ry="20"
          fill="#000"
          className="group-hover:scale-125 transition-all duration-500"
        >
          <animate
            attributeName="ry"
            values="20;18;20"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="4;3.5;4"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Energy Ripples */}
        {[1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={35 + i * 8}
            fill="none"
            stroke="url(#eyeGlow)"
            strokeWidth="0.5"
            opacity={0.4 - i * 0.1}
          >
            <animate
              attributeName="r"
              from={35 + i * 8}
              to={35 + i * 8 + 10}
              dur={`${i + 1}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={`${0.4 - i * 0.1};0`}
              dur={`${i + 1}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}