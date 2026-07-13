import React from 'react';
import { motion } from 'motion/react';

interface CuteSnakeLogoProps {
  className?: string;
  size?: number;
}

export const CuteSnakeLogo: React.FC<CuteSnakeLogoProps> = ({
  className = '',
  size = 36,
}) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.12, rotate: [0, -6, 6, 0] }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Shadow underneath */}
        <ellipse cx="60" cy="110" rx="40" ry="8" fill="rgba(26,61,2,0.15)" />

        {/* Coiled Tail section (wrapped around) */}
        <path
          d="M 25 90 Q 60 105 95 90 Q 105 85 95 75 Q 60 85 25 75 Q 15 85 25 90 Z"
          fill="#58CC02"
          stroke="#1A3D02"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Cute Snake Body (Upper torso rising from coil) */}
        <path
          d="M 45 78 C 45 60, 75 60, 75 78 Z"
          fill="#78D82A"
          stroke="#1A3D02"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Yellow belly section */}
        <path
          d="M 50 72 Q 60 76 70 72 L 68 78 Q 60 81 52 78 Z"
          fill="#EAF89B"
          stroke="#1A3D02"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Head with cute tufts */}
        <path
          d="M 31 52 C 29 36, 41 27, 47 27 C 49 20, 52 16, 55 16 C 57 16, 58.5 13, 61 13 C 63.5 13, 65 16, 67 16 C 70 16, 73 20, 75 27 C 81 27, 93 36, 91 52 C 89 65, 33 65, 31 52 Z"
          fill="#78D82A"
          stroke="#1A3D02"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Wide glassy Duolingo-style eyes */}
        {/* Left eye */}
        <ellipse cx="46" cy="35" rx="7" ry="9" fill="#FFF" stroke="#1A3D02" strokeWidth="3" />
        <ellipse cx="46.5" cy="35.5" rx="4" ry="6" fill="#1A3D02" />
        <circle cx="45" cy="33" r="1.8" fill="#FFF" />
        <circle cx="48" cy="37" r="0.8" fill="#FFF" />

        {/* Right eye */}
        <ellipse cx="74" cy="35" rx="7" ry="9" fill="#FFF" stroke="#1A3D02" strokeWidth="3" />
        <ellipse cx="74.5" cy="35.5" rx="4" ry="6" fill="#1A3D02" />
        <circle cx="73" cy="33" r="1.8" fill="#FFF" />
        <circle cx="76" cy="37" r="0.8" fill="#FFF" />

        {/* Sweet double curve smile 'w' */}
        <path
          d="M 52 45 Q 56 48 60 45 Q 64 48 68 45"
          stroke="#1A3D02"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tiny blush on cheeks */}
        <circle cx="37" cy="45" r="4" fill="#FDA4AF" opacity="0.8" />
        <circle cx="83" cy="45" r="4" fill="#FDA4AF" opacity="0.8" />

        {/* Little golden crown on head (floating slightly) */}
        <path
          d="M 52 10 L 55 14 L 60 11 L 65 14 L 68 10 L 66 17 L 54 17 Z"
          fill="#FFD43B"
          stroke="#1A3D02"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
};
