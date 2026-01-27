import React from 'react';

export default function GradientButton({ children, type = 'button', className = '', onClick, loading = false, disabled = false }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 via-cyan-400 to-fuchsia-500 p-[2px] shadow-lg transition-all duration-300 ease-out focus:outline-none focus-visible:shadow-glow ${
        isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="block w-full rounded-[10px] bg-slate-900 px-4 py-3 font-medium text-white">
        <span className="relative inline-flex items-center justify-center gap-2">
          {loading && (
            <svg className="h-4 w-4 animate-spin text-primary-300" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-90" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
          <span className={`${loading ? 'opacity-90' : ''}`}>{children}</span>
          {!loading && (
            <svg className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          )}
        </span>
      </span>
      <span className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-primary-500/30 blur-2xl transition-transform duration-300 group-hover:translate-y-6" />
    </button>
  );
}
