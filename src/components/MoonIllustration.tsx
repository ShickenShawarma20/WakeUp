import React from 'react';
import { motion } from 'framer-motion';

export const MoonIllustration: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(224, 64, 251, 0.15) 0%, transparent 70%)',
        filter: 'blur(20px)',
      }} />

      {/* Moon crescent */}
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0E6FF" />
            <stop offset="50%" stopColor="#E8D4FF" />
            <stop offset="100%" stopColor="#C8A6E8" />
          </linearGradient>
          <radialGradient id="moonShadow" cx="70%" cy="30%" r="50%">
            <stop offset="0%" stopColor="rgba(180,140,220,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <mask id="crescentMask">
            <rect width="200" height="200" fill="white" />
            <circle cx="120" cy="70" r="55" fill="black" />
          </mask>
        </defs>

        {/* Moon body */}
        <circle cx="100" cy="95" r="65" fill="url(#moonGrad)" mask="url(#crescentMask)" />
        <circle cx="100" cy="95" r="65" fill="url(#moonShadow)" mask="url(#crescentMask)" />

        {/* Moon surface details */}
        <circle cx="80" cy="110" r="6" fill="rgba(180,150,210,0.25)" mask="url(#crescentMask)" />
        <circle cx="70" cy="85" r="4" fill="rgba(180,150,210,0.2)" mask="url(#crescentMask)" />
        <circle cx="90" cy="130" r="3" fill="rgba(180,150,210,0.2)" mask="url(#crescentMask)" />
      </svg>

      {/* Stars */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '15px', right: '30px' }}
      >
        <StarSVG size={8} />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ position: 'absolute', top: '40px', right: '15px' }}
      >
        <StarSVG size={6} />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', top: '55px', right: '50px' }}
      >
        <StarSVG size={5} />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{ position: 'absolute', top: '25px', left: '40px' }}
      >
        <StarSVG size={4} />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{ position: 'absolute', top: '70px', left: '25px' }}
      >
        <StarSVG size={3} />
      </motion.div>

      {/* Small sparkle dots */}
      {[
        { top: '30px', right: '60px', size: 2, delay: 0 },
        { top: '10px', right: '45px', size: 2.5, delay: 0.7 },
        { top: '80px', left: '50px', size: 2, delay: 1.2 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
          style={{
            position: 'absolute',
            top: dot.top,
            right: dot.right,
            left: (dot as any).left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            borderRadius: '50%',
            backgroundColor: '#F0E6FF',
          }}
        />
      ))}
    </div>
  );
};

const StarSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 3} height={size * 3} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
      stroke="#F0E6FF"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
