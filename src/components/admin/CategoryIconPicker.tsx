"use client";

import { CATEGORY_ICONS, CategoryIcon } from "@/lib/category-icons";

export { CategoryIcon, CATEGORY_ICONS };

export default function CategoryIconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
        Ícono del filtro{" "}
        <span className="text-zinc-700 normal-case tracking-normal font-normal">(opcional)</span>
      </span>

      {/* Preview del seleccionado */}
      {value && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <CategoryIcon name={value} size={16} className="text-yellow-500" />
          </div>
          <span className="text-zinc-400 text-xs">
            {CATEGORY_ICONS.find((i) => i.name === value)?.label}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-zinc-700 hover:text-red-400 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer ml-1"
          >
            Quitar
          </button>
        </div>
      )}

      {/* Grid de opciones */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
        {CATEGORY_ICONS.map(({ name, label, Icon }) => {
          const selected = value === name;
          return (
            <button
              key={name}
              type="button"
              title={label}
              onClick={() => onChange(selected ? "" : name)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all cursor-pointer ${
                selected
                  ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                  : "bg-[#111] border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              <span className="text-[8px] uppercase tracking-wide font-bold leading-none truncate w-full text-center">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
