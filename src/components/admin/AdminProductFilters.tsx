"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  total: number;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Borradores / Inactivos" },
  { value: "no-stock", label: "Sin stock" },
  { value: "featured", label: "Destacados" },
  { value: "new", label: "Marcados como Nuevo" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Más recientes" },
  { value: "date-asc", label: "Más antiguos" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "stock-desc", label: "Stock: mayor a menor" },
  { value: "stock-asc", label: "Stock: menor a mayor" },
  { value: "name-asc", label: "Nombre: A → Z" },
  { value: "name-desc", label: "Nombre: Z → A" },
];

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-[#0d0d0d] border text-sm pl-3 pr-8 py-[9px] rounded-lg focus:outline-none transition-colors cursor-pointer ${
          value
            ? "border-yellow-500/50 text-white"
            : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
        }`}
      >
        <option value="" className="text-zinc-500 bg-[#111]">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-white bg-[#111]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
      />
    </div>
  );
}

export default function AdminProductFilters({ categories, brands, total }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state for debounced search
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  // Read current filter values from URL
  const cat = searchParams.get("cat") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "";

  // Count active filters (excluding sort which is always set)
  const activeCount = [
    searchParams.get("q"),
    cat,
    brand,
    status,
  ].filter(Boolean).length;

  // Generic URL updater — always resets page to 1
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      updateParam("q", searchValue);
    }, 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Sync search input if URL param changes externally (e.g. clear all)
  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function clearAll() {
    setSearchValue("");
    router.replace(pathname);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
          />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full bg-[#0d0d0d] border border-zinc-800 text-white text-sm pl-9 pr-8 py-[9px] rounded-lg focus:outline-none focus:border-yellow-500/50 placeholder-zinc-700 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort */}
        <FilterSelect
          value={sort}
          onChange={(v) => updateParam("sort", v)}
          options={SORT_OPTIONS}
          placeholder="Ordenar por..."
        />
      </div>

      {/* Row 2: Category + Brand + Status + Clear */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-zinc-600 flex-shrink-0">
          <SlidersHorizontal size={13} strokeWidth={2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Filtros</span>
        </div>

        <FilterSelect
          value={cat}
          onChange={(v) => updateParam("cat", v)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Categoría"
        />

        <FilterSelect
          value={brand}
          onChange={(v) => updateParam("brand", v)}
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
          placeholder="Marca"
        />

        <FilterSelect
          value={status}
          onChange={(v) => updateParam("status", v)}
          options={STATUS_OPTIONS.slice(1)}
          placeholder="Estado"
        />

        {/* Active filter chips + clear */}
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all cursor-pointer flex-shrink-0"
          >
            <X size={11} strokeWidth={3} />
            Limpiar {activeCount > 0 && `(${activeCount})`}
          </button>
        )}

        {/* Result count */}
        <span className="ml-auto text-zinc-700 text-xs font-mono hidden sm:block">
          {total} resultado{total !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
