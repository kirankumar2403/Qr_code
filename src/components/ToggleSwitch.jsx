import React from 'react';

export default function ToggleSwitch({ checked, onChange, label, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-3 select-none ${className}`}>
      {label && <span className="text-sm text-slate-300">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 ${
          checked ? 'bg-gradient-to-r from-primary-500 to-fuchsia-500' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}
