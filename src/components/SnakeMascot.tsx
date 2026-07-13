import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeState } from '../types';

interface SnakeMascotProps {
  state: SnakeState;
  className?: string;
  speakText?: string;
}

export const SnakeMascot: React.FC<SnakeMascotProps> = ({
  state,
  className = 'w-48 h-48',
  speakText,
}) => {
  // Floating overlay effects (ZZZ, lightbulb, fire, crown, etc.)
  const getFloatingOverlays = () => {
    switch (state) {
      case 'sleep_zzz':
        return (
          <div className="absolute inset-0 pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 20, y: 30 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8], x: [20, 35, 45], y: [30, -10, -40] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0 }}
              className="absolute top-4 right-6 font-display font-black text-indigo-500 dark:text-indigo-400 text-lg"
            >
              Z
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 15, y: 35 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.7], x: [15, 25, 30], y: [35, 10, -15] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              className="absolute top-6 right-8 font-display font-black text-indigo-500 dark:text-indigo-400 text-sm"
            >
              z
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 22, y: 25 }}
              animate={{ opacity: [0, 1, 0], scale: [0.7, 1.3, 0.9], x: [22, 40, 55], y: [25, -20, -60] }}
              transition={{ repeat: Infinity, duration: 3, delay: 2 }}
              className="absolute top-2 right-4 font-display font-black text-indigo-500 dark:text-indigo-400 text-xl"
            >
              Z
            </motion.div>
          </div>
        );

      case 'think_chin_tap':
        return (
          <div className="absolute inset-0 pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.8], y: [20, -10, -35], rotate: [-10, 15] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0 }}
              className="absolute top-2 right-2 text-sky-500 font-black text-xl font-display"
            >
              ?
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 25 }}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 0.9, 0.7], y: [25, 5, -20], rotate: [15, -10] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 1 }}
              className="absolute top-4 left-2 text-indigo-500 font-black text-lg font-display"
            >
              ?
            </motion.div>
          </div>
        );

      case 'streak_fire':
        return (
          <div className="absolute inset-0 pointer-events-none select-none overflow-visible">
            <div className="absolute bottom-1 inset-x-0 flex justify-center gap-10">
              <motion.span
                animate={{ y: [0, -12, 0], scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl"
              >
                🔥
              </motion.span>
              <motion.span
                animate={{ y: [-2, -15, -2], scale: [0.9, 1.15, 1, 1.2, 0.9], rotate: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
                className="text-3xl"
              >
                🔥
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0], scale: [1.1, 0.9, 1.2, 1, 1.1], rotate: [-10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }}
                className="text-2xl"
              >
                🔥
              </motion.span>
            </div>
          </div>
        );

      case 'level_up':
        return (
          <div className="absolute inset-0 pointer-events-none select-none">
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: [1, 1.1, 1], y: -24 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl filter drop-shadow"
            >
              👑
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-12 left-6 text-yellow-400 text-lg"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }}
              className="absolute -top-8 right-6 text-amber-400 text-lg"
            >
              ✨
            </motion.div>
          </div>
        );

      case 'happy_pop':
      case 'celebrate_jump':
        return (
          <div className="absolute inset-0 pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -10, y: 40 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8], x: [-10, -25, -35], y: [40, 10, -15], rotate: [-15, -30] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0 }}
              className="absolute text-rose-500 text-lg"
            >
              💖
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 10, y: 40 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8], x: [10, 25, 35], y: [40, 10, -15], rotate: [15, 30] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
              className="absolute text-rose-500 text-lg"
            >
              ❤️
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0, y: 20 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.7], x: [0, -10, -15], y: [20, -15, -45], rotate: [10, -10] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.9 }}
              className="absolute text-yellow-400 text-sm"
            >
              ⭐
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  // Mouth design - matches the cute Duolingo open mouth and happy tongue!
  const renderMouth = () => {
    switch (state) {
      case 'sleep_zzz':
        return (
          <circle cx="60" cy="40" r="1.5" fill="#1A3D02" />
        );

      case 'sad_but_supportive':
        return (
          <path d="M 54 41 Q 60 37 66 41" stroke="#1A3D02" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        );

      case 'think_chin_tap':
        return (
          <path d="M 54 39 Q 57 37 60 39 T 66 39" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        );

      case 'happy_pop':
      case 'celebrate_jump':
      case 'level_up':
      case 'sparkle_eyes':
        return (
          <g>
            {/* Cute open laugh mouth */}
            <path d="M 53 38 C 53 38, 60 48, 67 38 Z" fill="#880E4F" stroke="#1A3D02" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        );

      case 'idle_flick_tongue':
        return (
          <g>
            <path d="M 54 39 Q 60 43 66 39" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      default:
        return (
          /* Sweet cat-like double curve smile "w" */
          <path d="M 52 38 Q 56 41 60 38 Q 64 41 68 38" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        );
    }
  };

  // Big, expressive vertical glassy eyeballs strictly matching the new waving snake illustration!
  const renderEyes = () => {
    switch (state) {
      case 'sleep_zzz':
        return (
          <>
            <path d="M 40 31 Q 46 36 52 31" stroke="#1A3D02" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M 68 31 Q 74 36 80 31" stroke="#1A3D02" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        );

      case 'happy_pop':
      case 'celebrate_jump':
      case 'level_up':
        return (
          <>
            <path d="M 40 32 Q 46 26 52 32" stroke="#1A3D02" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 68 32 Q 74 26 80 32" stroke="#1A3D02" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        );

      case 'sparkle_eyes':
        return (
          <>
            <motion.path
              d="M 46 22 L 48 27 L 53 29 L 48 31 L 46 36 L 44 31 L 39 29 L 44 27 Z"
              fill="#FFD43B"
              stroke="#1A3D02"
              strokeWidth="1.8"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              style={{ originX: '46px', originY: '29px' }}
            />
            <motion.path
              d="M 74 22 L 76 27 L 81 29 L 76 31 L 74 36 L 72 31 L 67 29 L 72 27 Z"
              fill="#FFD43B"
              stroke="#1A3D02"
              strokeWidth="1.8"
              animate={{ scale: [1, 1.15, 1], rotate: [360, 180, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              style={{ originX: '74px', originY: '29px' }}
            />
          </>
        );

      case 'sad_but_supportive':
        return (
          <g>
            {/* Worried pupils looking down-ish */}
            <ellipse cx="46" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="74" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="46.5" cy="31.5" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="45" cy="29" r="1.3" fill="#FFF" />
            <ellipse cx="73.5" cy="31.5" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="72" cy="29" r="1.3" fill="#FFF" />
            
            {/* Soft blue dripping teardrop on left cheek */}
            <motion.path
              d="M 37 42 C 37 42, 34 50, 37 50 C 40 50, 37 42, 37 42 Z"
              fill="#38BDF8"
              stroke="#0369A1"
              strokeWidth="0.8"
              animate={{ y: [0, 3, 6, 0], opacity: [1, 1, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            {/* Worried tilted eyebrows */}
            <path d="M 39 18 Q 46 21 51 17" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 69 17 Q 74 21 81 18" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'think_chin_tap':
        return (
          <g>
            <ellipse cx="46" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="74" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            
            {/* Pupils looking high right */}
            <ellipse cx="48" cy="27" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="47" cy="25" r="1.3" fill="#FFF" />
            <ellipse cx="75.5" cy="27" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="74.5" cy="25" r="1.3" fill="#FFF" />

            {/* Puzzled expressive eyebrows */}
            <path d="M 38 18 Q 45 15 49 20" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 71 20 Q 75 15 82 18" stroke="#1A3D02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'read_code':
        return (
          <g>
            <ellipse cx="46" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="74" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            
            {/* Pupils looking down */}
            <ellipse cx="46" cy="32" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="45" cy="30" r="1.3" fill="#FFF" />
            <ellipse cx="74" cy="32" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="73" cy="30" r="1.3" fill="#FFF" />

            {/* Smart Hipster glasses */}
            <circle cx="46" cy="29" r="8.5" fill="none" stroke="#1A3D02" strokeWidth="2.8" />
            <circle cx="74" cy="29" r="8.5" fill="none" stroke="#1A3D02" strokeWidth="2.8" />
            <line x1="54.5" y1="29" x2="65.5" y2="29" stroke="#1A3D02" strokeWidth="2.8" />
            <path d="M 37.5 29 L 33 28" stroke="#1A3D02" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 82.5 29 L 87 28" stroke="#1A3D02" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        );

      case 'debug_detective':
        return (
          <g>
            {/* Squinting left eye */}
            <ellipse cx="46" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <path d="M 40 28 Q 46 32 52 28" stroke="#1A3D02" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <circle cx="46" cy="30" r="3.5" fill="#1A3D02" />

            {/* Right eye with a glossy golden monocle */}
            <ellipse cx="74" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="73.5" cy="29.5" rx="3.5" ry="5" fill="#1A3D02" />
            <circle cx="72" cy="27" r="1.3" fill="#FFF" />
            
            {/* Gold monocle rim */}
            <circle cx="74" cy="29" r="9.5" fill="none" stroke="#F59E0B" strokeWidth="2.8" />
            {/* Monocle chain */}
            <path d="M 83.5 29 C 88 32, 91 40, 86 46" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
          </g>
        );

      default:
        return (
          <g>
            {/* Beautiful wide Duolingo-style glassy eyes */}
            <ellipse cx="46" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            <ellipse cx="74" cy="29" rx="6.5" ry="8.5" fill="#FFF" stroke="#1A3D02" strokeWidth="2.5" />
            
            {/* Expressive dark pupils */}
            <ellipse cx="46.5" cy="29.5" rx="3.8" ry="5.5" fill="#1A3D02" />
            <circle cx="45" cy="27" r="1.5" fill="#FFF" />
            <circle cx="48" cy="31" r="0.7" fill="#FFF" />

            <ellipse cx="73.5" cy="29.5" rx="3.8" ry="5.5" fill="#1A3D02" />
            <circle cx="72" cy="27" r="1.5" fill="#FFF" />
            <circle cx="75" cy="31" r="0.7" fill="#FFF" />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Dynamic speech bubble speaking Roman Hindi */}
      <AnimatePresence>
        {speakText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.82, y: 15 }}
            className="absolute -top-16 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-2xl shadow-md border-2 border-slate-200 dark:border-slate-800 max-w-xs text-center font-bold text-xs z-50 pointer-events-none font-display leading-tight"
          >
            {speakText}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-slate-200 dark:border-slate-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle generator overlay */}
      {getFloatingOverlays()}

      {/* Main 2D Vector Snake Mascot (strictly matches the Duolingo owl/snake image!) */}
      <motion.svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          state === 'celebrate_jump' || state === 'level_up'
            ? { y: [0, -22, 4, -2, 0], scaleY: [1, 0.76, 1.18, 0.92, 1.04, 1], scaleX: [1, 1.2, 0.88, 1.06, 0.97, 1] }
            : state === 'sleep_zzz'
            ? { scaleY: [1, 0.96, 1], scaleX: [1, 1.02, 1], y: [0, 1, 0] }
            : { y: [0, -3, 0] } // Continuous idle breathing
        }
        transition={
          state === 'celebrate_jump' || state === 'level_up'
            ? { duration: 0.8, ease: 'easeOut' }
            : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
        }
        className="w-full h-full select-none"
      >
        {/* Soft platform shadow */}
        <ellipse cx="60" cy="105" rx="42" ry="6.5" fill="rgba(15,23,42,0.08)" />

        {/* 1. Tail poking up on the left side (viewer's left) */}
        <motion.g
          animate={
            state === 'happy_pop' || state === 'celebrate_jump' || state === 'level_up'
              ? { rotate: [0, 15, -15, 10, -5, 0] }
              : { rotate: [0, 2, -2, 0] }
          }
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ originX: '40px', originY: '88px' }}
        >
          {/* Green tail body */}
          <path
            d="M 40 85 C 33 80, 28 68, 30 58 C 34 58, 38 68, 42 82"
            fill="#78D82A"
            stroke="#1A3D02"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dark green tail spot/stripe */}
          <ellipse cx="33" cy="70" rx="2" ry="4.5" fill="#3F8E08" transform="rotate(-15 33 70)" />
        </motion.g>

        {/* 2. Bottom Coiled Ring Base (chubby, thick loops with clean green-border outlines) */}
        <path
          d="M 28 88 C 18 88, 14 102, 40 104 C 65 106, 92 106, 102 100 C 108 96, 105 88, 88 87 C 76 86, 38 87, 28 88 Z"
          fill="#78D82A"
          stroke="#1A3D02"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Shading/back coil details of the loop */}
        <ellipse cx="60" cy="99" rx="18" ry="4.5" fill="#59B113" stroke="#1A3D02" strokeWidth="2" />

        {/* Dark green stylish spots on bottom coil */}
        <path d="M 24 93 Q 28 90 34 94 Q 28 98 24 93 Z" fill="#3F8E08" />
        <path d="M 88 95 Q 94 92 98 96 Q 94 99 88 95 Z" fill="#3F8E08" />

        {/* 3. Upright Chest/Body (graceful vertical neck column) */}
        <path
          d="M 48 50 L 48 88 Q 60 92 72 88 L 72 50 Z"
          fill="#78D82A"
          stroke="#1A3D02"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />

        {/* Segmented Yellow-Cream Belly Overlay (Horizontal stripes exactly like Duolingo!) */}
        <g>
          {/* Belly background fill bounds */}
          <path
            d="M 50 50 L 50 87 Q 60 90 70 87 L 70 50 Q 60 52 50 50 Z"
            fill="#EAF89B"
            stroke="#1A3D02"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Segment horizontal division curves */}
          <path d="M 50 58 Q 60 61 70 58" stroke="#1A3D02" strokeWidth="2.5" fill="none" />
          <path d="M 50 67 Q 60 70 70 67" stroke="#1A3D02" strokeWidth="2.5" fill="none" />
          <path d="M 50 76 Q 60 79 70 76" stroke="#1A3D02" strokeWidth="2.5" fill="none" />
        </g>

        {/* Cute dark green spot on snake's side chest */}
        <ellipse cx="71" cy="56" rx="2" ry="4" fill="#3F8E08" transform="rotate(15 71 56)" />

        {/* 4. Left Arm/Hand: Raised waving flipper gesture (Viewer's left) */}
        <motion.g
          animate={
            state === 'celebrate_jump' || state === 'level_up' || state === 'happy_pop'
              ? { rotate: [0, -18, 18, -18, 18, 0] }
              : { rotate: [0, -6, 6, -6, 0] } // continuous friendly waving motion
          }
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          style={{ originX: '46px', originY: '60px' }}
        >
          {/* Smooth flipper waving arm outline */}
          <path
            d="M 46 62 C 38 60, 28 46, 33 38 C 38 32, 46 42, 48 50 Z"
            fill="#78D82A"
            stroke="#1A3D02"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* 5. Right Arm/Hand: Bent resting on hip/belly (Viewer's right) */}
        <motion.g
          animate={{ y: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          {/* Rounded arm resting on tummy side */}
          <path
            d="M 72 58 C 78 58, 84 64, 80 72 C 76 76, 72 70, 72 64 Z"
            fill="#78D82A"
            stroke="#1A3D02"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Pencil Accessory for 'read_code' state - cute pencil held by hand */}
        {state === 'read_code' && (
          <motion.g
            animate={{ rotate: [-10, 10, -10], y: [-1, 1, -1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            style={{ originX: '33px', originY: '38px' }}
          >
            <rect x="24" y="24" width="4" height="15" rx="1.2" fill="#FFD43B" stroke="#1A3D02" strokeWidth="1.8" transform="rotate(-20 24 24)" />
            <rect x="25" y="21" width="4" height="3" rx="0.5" fill="#FDA4AF" stroke="#1A3D02" strokeWidth="1.5" transform="rotate(-20 24 24)" />
            <polygon points="19,34 23,36 18,38" fill="#1A3D02" />
          </motion.g>
        )}

        {/* Magnifying glass for 'debug_detective' state - held by waving hand */}
        {state === 'debug_detective' && (
          <motion.g
            animate={{ rotate: [-4, 6, -4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ originX: '33px', originY: '38px' }}
          >
            <circle cx="24" cy="22" r="6.5" fill="rgba(14,165,233,0.18)" stroke="#1A3D02" strokeWidth="2" />
            <line x1="28" y1="26" x2="35" y2="33" stroke="#1A3D02" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 20 20 A 4 4 0 0 1 25 20" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </motion.g>
        )}

        {/* 6. Rounded Head Group (with double crest/tuft at crown exactly like illustration!) */}
        <motion.g
          animate={
            state === 'think_chin_tap'
              ? { rotate: [-5, -3, -5], y: [-0.8, 0.4, -0.8] }
              : state === 'streak_fire'
              ? { y: [-1.2, 1.2, -1.2], scaleY: [1, 1.02, 1] }
              : { rotate: 0, y: 0 }
          }
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{ originX: '60px', originY: '46px' }}
        >
          {/* Seamless Master Head Path outlining the 3 cute crown crest tufts! */}
          <path
            d="M 31 46 C 29 32, 41 24, 47 24 C 49 18, 52 14, 55 14 C 57 14, 58.5 11, 61 11 C 63.5 11, 65 14, 67 14 C 70 14, 73 18, 75 24 C 81 24, 93 32, 91 46 C 89 58, 33 58, 31 46 Z"
            fill="#78D82A"
            stroke="#1A3D02"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Sherlock Detective Cap for 'debug_detective' */}
          {state === 'debug_detective' && (
            <g>
              <path d="M 39 25 C 39 12, 71 12, 71 25 Z" fill="#8B5A2B" stroke="#1A3D02" strokeWidth="2.8" />
              <path d="M 36 25 Q 55 21 74 25 C 74 25, 70 28, 36 25 Z" fill="#70441E" stroke="#1A3D02" strokeWidth="2" />
              <circle cx="55" cy="11" r="3" fill="#8B5A2B" stroke="#1A3D02" strokeWidth="2" />
            </g>
          )}

          {/* Golden Crown overlay for 'level_up' state */}
          {state === 'level_up' && (
            <motion.path
              d="M 46 16 L 50 10 L 55 14 L 60 10 L 65 14 L 70 10 L 74 16 Z"
              fill="#FFD43B"
              stroke="#1A3D02"
              strokeWidth="2"
              strokeLinejoin="round"
              animate={{ y: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          )}

          {/* Double snout bridges / green muzzle highlight */}
          <path
            d="M 42 50 C 42 45, 78 45, 78 50 C 78 54, 42 54, 42 50 Z"
            fill="#EAF89B"
            opacity="0.25"
          />

          {/* Bulging Glassy Eyeballs (Huge Duolingo-style glossy highlights!) */}
          {renderEyes()}

          {/* Soft blushing pink cheeks (pulsates on state matches) */}
          <motion.circle
            cx="36"
            cy="42"
            r="4.2"
            fill="#FB7185"
            fillOpacity="0.75"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="84"
            cy="42"
            r="4.2"
            fill="#FB7185"
            fillOpacity="0.75"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />

          {/* SNUG NOSTRILS */}
          <circle cx="56" cy="38" r="1.3" fill="#59B113" />
          <circle cx="64" cy="38" r="1.3" fill="#59B113" />

          {/* Interactive Mouth */}
          {renderMouth()}

          {/* Floating miniature book notebook when read_code state is active */}
          {state === 'read_code' && (
            <motion.g
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="pointer-events-none"
            >
              <rect x="42" y="50" width="36" height="17" rx="2.5" fill="#F1F5F9" stroke="#1A3D02" strokeWidth="2.2" />
              <circle cx="47" cy="50" r="1.2" fill="#94A3B8" />
              <circle cx="53" cy="50" r="1.2" fill="#94A3B8" />
              <circle cx="59" cy="50" r="1.2" fill="#94A3B8" />
              <circle cx="65" cy="50" r="1.2" fill="#94A3B8" />
              <circle cx="71" cy="50" r="1.2" fill="#94A3B8" />
              <line x1="48" y1="55" x2="72" y2="55" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="48" y1="60" x2="66" y2="60" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" />
            </motion.g>
          )}
        </motion.g>
      </motion.svg>
    </div>
  );
};
