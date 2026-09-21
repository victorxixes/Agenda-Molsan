import { useState } from "react";

export default function SelectSJ({ value, onChange, options, placeholder = "Seleccionar" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
          text-white text-left flex justify-between items-center
          hover:bg-white/20 transition
        "
      >
        <span>{value ? options.find(o => o.value === value)?.label : placeholder}</span>
        <svg className="w-4 h-4 text-white/70">
          <use href="/icons/icons.svg#chevron-down" />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl
            border border-white/20 rounded-xl shadow-xl z-50
          "
        >
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="
                w-full text-left px-3 py-2 text-white hover:bg-white/20
                transition rounded-xl
              "
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
