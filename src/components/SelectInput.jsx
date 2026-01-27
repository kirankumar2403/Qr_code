export default function SelectInput({ label, name, value, onChange, options, error, errorMessage }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/10
          px-4 py-3
          text-slate-100
          shadow-inner
          placeholder:text-slate-400
          focus:outline-none
          focus:ring-4
          focus:ring-primary-500/30
          focus:border-primary-400/60
          backdrop-blur-md
          transition-all
          duration-300
          ${error ? "border-red-400" : ""}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}
