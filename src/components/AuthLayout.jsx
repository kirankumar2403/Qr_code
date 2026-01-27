import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children, footer }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10; // -5 to 5
    const rotateX = (0.5 - py) * 10; // -5 to 5
    setTilt({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Aurora + grain */}
      <div className="aurora" />
      <div className="grain" />

      {/* Gradient beams and orbits */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-400 to-fuchsia-500 bg-[length:200%_100%] animate-shimmer" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-40 w-40 -translate-x-1/2 rounded-full bg-primary-500/20 blur-2xl" />
      <div className="pointer-events-none absolute right-10 bottom-24 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-2xl" />

      {/* subtle grid */}
      <div className="grid-mask pointer-events-none" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="relative h-10 w-10 animate-pulse-glow rounded-xl bg-gradient-to-br from-primary-500 to-fuchsia-500 p-[2px]">
                <div className="absolute -top-2 -right-2 h-4 w-4 animate-orbit rounded-full bg-cyan-400/70" />
                <div className="h-full w-full rounded-[10px] bg-slate-900 shadow-inner-strong" />
              </div>
              <span className="text-lg font-semibold tracking-tight">TaxPal</span>
            </Link>
          </div>

          <motion.div
            className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl"
            style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
              )}
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
              {children}
            </motion.div>
          </motion.div>

          {footer && (
            <motion.div className="mt-6 text-center text-sm text-slate-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {footer}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
