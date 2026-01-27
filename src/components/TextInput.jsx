import React from 'react';

export default function TextInput({ label, type = 'text', name, placeholder, value, onChange, autoComplete, icon, error, errorMessage }) {
  const inputId = name ? `${name}-input` : undefined;
  const errorId = name ? `${name}-error` : undefined;
  return (
    <label className="block text-left" htmlFor={inputId}>
      {label && <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-xl border ${error ? 'border-red-500/70 focus:ring-red-500/30 focus:border-red-400/80' : 'border-white/10 focus:ring-primary-500/30 focus:border-primary-400/60'} bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-inner focus:outline-none focus:ring-4 backdrop-blur-md transition-all duration-300 ${icon ? 'pl-10' : ''}`}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <span className="pointer-events-none absolute -inset-px rounded-xl border border-white/10 opacity-0 transition-opacity duration-300 focus-within:opacity-100" />
      </div>
      {error && (
        <span id={errorId} className="mt-2 block text-xs text-red-400">{errorMessage}</span>
      )}
    </label>
  );
}
