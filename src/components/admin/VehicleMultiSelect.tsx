"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Car, Plus, X, ChevronDown, Search, CheckCircle2 } from "lucide-react";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
};

type VehicleEntry =
  | { kind: "existing"; id: string }
  | { kind: "new"; make: string; model: string; yearStart: number; yearEnd: number };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function vehicleLabel(v: Vehicle) {
  const years =
    v.yearStart || v.yearEnd
      ? ` (${v.yearStart ?? "?"}–${v.yearEnd ?? "hoy"})`
      : "";
  return `${v.make} ${v.model}${years}`;
}

function entryRaw(e: VehicleEntry, vehicles: Vehicle[]) {
  if (e.kind === "existing") {
    const v = vehicles.find((v) => v.id === e.id);
    return v ? `${v.make} ${v.model} ${v.yearStart ?? 0}-${v.yearEnd ?? 9999}` : "";
  }
  return `${e.make} ${e.model} ${e.yearStart}-${e.yearEnd}`;
}

// ─── Autocomplete input ───────────────────────────────────────────────────────

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(
    () =>
      suggestions
        .filter(
          (s) => s.toLowerCase().includes(value.toLowerCase()) && s !== value
        )
        .slice(0, 8),
    [suggestions, value]
  );

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-zinc-800 focus:border-yellow-500/50 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1c1c1c] border border-zinc-700 rounded-lg overflow-hidden shadow-xl">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VehicleMultiSelect({
  vehicles,
  defaultSelected = [],
}: {
  vehicles: Vehicle[];
  defaultSelected?: string[];
}) {
  const [entries, setEntries] = useState<VehicleEntry[]>(
    defaultSelected.map((id) => ({ kind: "existing" as const, id }))
  );

  // Add-form state
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");

  // Selector panel
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  // ── Derived ──

  const selectedIds = useMemo(
    () =>
      new Set(
        entries
          .filter((e) => e.kind === "existing")
          .map((e) => (e as { kind: "existing"; id: string }).id)
      ),
    [entries]
  );

  const allMakes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make))].sort(),
    [vehicles]
  );

  const modelsForMake = useMemo(() => {
    if (!make.trim()) return [...new Set(vehicles.map((v) => v.model))].sort();
    return [
      ...new Set(
        vehicles
          .filter((v) => v.make.toLowerCase() === make.trim().toLowerCase())
          .map((v) => v.model)
      ),
    ].sort();
  }, [vehicles, make]);

  // Match in DB by make+model
  const dbMatch = useMemo(() => {
    if (!make.trim() || !model.trim()) return null;
    return (
      vehicles.find(
        (v) =>
          v.make.toLowerCase() === make.trim().toLowerCase() &&
          v.model.toLowerCase() === model.trim().toLowerCase()
      ) ?? null
    );
  }, [vehicles, make, model]);

  // Whether this entry is already in the list
  const alreadyAdded = useMemo(() => {
    if (!make.trim() || !model.trim()) return false;
    return entries.some((e) => {
      if (e.kind === "existing") {
        const v = vehicles.find((v) => v.id === e.id);
        return (
          v &&
          v.make.toLowerCase() === make.trim().toLowerCase() &&
          v.model.toLowerCase() === model.trim().toLowerCase()
        );
      }
      return (
        e.make.toLowerCase() === make.trim().toLowerCase() &&
        e.model.toLowerCase() === model.trim().toLowerCase()
      );
    });
  }, [entries, make, model, vehicles]);

  const canAdd = useMemo(() => {
    if (!make.trim() || !model.trim() || alreadyAdded) return false;
    if (dbMatch) return true; // existing — years optional
    // new: require valid year range
    const ys = parseInt(yearStart, 10);
    const ye = parseInt(yearEnd, 10);
    return (
      yearStart.length === 4 &&
      yearEnd.length === 4 &&
      !isNaN(ys) &&
      !isNaN(ye) &&
      ye >= ys
    );
  }, [make, model, dbMatch, yearStart, yearEnd, alreadyAdded]);

  // ── Grouped list for selector panel ──

  const grouped = useMemo(() => {
    const q = filterText.toLowerCase();
    const filtered = vehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
    return Object.entries(
      filtered.reduce<Record<string, Vehicle[]>>((acc, v) => {
        (acc[v.make] ??= []).push(v);
        return acc;
      }, {})
    ).sort(([a], [b]) => a.localeCompare(b));
  }, [vehicles, filterText]);

  // ── Actions ──

  function handleAdd() {
    if (!canAdd) return;

    if (dbMatch) {
      const ys = yearStart.length === 4 ? parseInt(yearStart, 10) : null;
      const ye = yearEnd.length === 4 ? parseInt(yearEnd, 10) : null;
      const yearsChanged =
        (ys !== null && ys !== dbMatch.yearStart) ||
        (ye !== null && ye !== dbMatch.yearEnd);

      if (yearsChanged && ys && ye) {
        // Usuario ingresó un rango distinto → upsert en el servidor para actualizar años
        setEntries((prev) => [
          ...prev,
          { kind: "new", make: dbMatch.make, model: dbMatch.model, yearStart: ys, yearEnd: ye },
        ]);
      } else {
        // Sin cambio de años → conectar el registro existente tal cual
        setEntries((prev) => [...prev, { kind: "existing", id: dbMatch.id }]);
      }
    } else {
      setEntries((prev) => [
        ...prev,
        {
          kind: "new",
          make: make.trim(),
          model: model.trim(),
          yearStart: parseInt(yearStart, 10),
          yearEnd: parseInt(yearEnd, 10),
        },
      ]);
    }
    setMake("");
    setModel("");
    setYearStart("");
    setYearEnd("");
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleExisting(id: string) {
    if (selectedIds.has(id)) {
      setEntries((prev) =>
        prev.filter((e) => !(e.kind === "existing" && e.id === id))
      );
    } else {
      setEntries((prev) => [...prev, { kind: "existing", id }]);
    }
  }

  // ── Render tag label ──

  function entryLabel(entry: VehicleEntry) {
    if (entry.kind === "existing") {
      const v = vehicles.find((v) => v.id === entry.id);
      return v ? vehicleLabel(v) : "?";
    }
    return `${entry.make} ${entry.model} (${entry.yearStart}–${entry.yearEnd})`;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          <Car size={12} className="text-zinc-500" />
          Vehículos compatibles
          <span className="text-zinc-700 normal-case tracking-normal font-normal">
            — opcional
          </span>
        </label>
        {entries.length > 0 && (
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">
            {entries.length} asignado{entries.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Hidden inputs */}
      {entries.map((entry, i) => {
        if (entry.kind === "existing") {
          return <input key={i} type="hidden" name="vehicleId" value={entry.id} />;
        }
        const raw = `${entry.make} ${entry.model} ${entry.yearStart}-${entry.yearEnd}`;
        return <input key={i} type="hidden" name="vehicleNew" value={raw} />;
      })}

      {/* Selected tags */}
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#0d0d0d] border border-zinc-800 rounded-lg">
          {entries.map((entry, i) => {
            const isNew = entry.kind === "new";
            return (
              <button
                key={i}
                type="button"
                onClick={() => removeEntry(i)}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  isNew
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                    : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                }`}
              >
                {isNew && (
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-60">
                    NUEVO ·{" "}
                  </span>
                )}
                {entryLabel(entry)}
                <X size={10} strokeWidth={2.5} className="flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Add form ── */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
          Agregar vehículo
        </p>

        {/* Row 1: Marca + Modelo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
              Marca
            </span>
            <AutocompleteInput
              value={make}
              onChange={(v) => { setMake(v); setModel(""); }}
              suggestions={allMakes}
              placeholder="Toyota, Ford…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
              Modelo
            </span>
            <AutocompleteInput
              value={model}
              onChange={setModel}
              suggestions={modelsForMake}
              placeholder="Hilux, Ranger…"
              disabled={!make.trim()}
            />
          </div>
        </div>

        {/* DB match feedback */}
        {dbMatch && make && model && (() => {
          const ys = yearStart.length === 4 ? parseInt(yearStart, 10) : null;
          const ye = yearEnd.length === 4 ? parseInt(yearEnd, 10) : null;
          const yearsChanged =
            (ys !== null && ys !== dbMatch.yearStart) ||
            (ye !== null && ye !== dbMatch.yearEnd);

          return (
            <div className={`flex items-center gap-2 text-[11px] border rounded-lg px-3 py-2 ${
              yearsChanged
                ? "text-yellow-400 bg-yellow-500/8 border-yellow-500/20"
                : "text-emerald-400 bg-emerald-500/8 border-emerald-500/20"
            }`}>
              <CheckCircle2 size={13} strokeWidth={2} className="flex-shrink-0" />
              <span>
                {yearsChanged
                  ? `Encontrado en BD — se actualizará el rango de ${dbMatch.yearStart ?? "?"}–${dbMatch.yearEnd ?? "hoy"} a ${ys}–${ye}`
                  : `Encontrado en BD — ${vehicleLabel(dbMatch)} · Se usará el registro existente`}
              </span>
            </div>
          );
        })()}

        {/* Row 2: Años — solo requeridos si es nuevo */}
        {(!dbMatch || (make && model)) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                Año desde{" "}
                {dbMatch ? (
                  <span className="text-zinc-700 normal-case tracking-normal font-normal">
                    — opcional
                  </span>
                ) : (
                  <span className="text-yellow-500">*</span>
                )}
              </span>
              <input
                type="number"
                value={yearStart}
                onChange={(e) => setYearStart(e.target.value)}
                placeholder={dbMatch?.yearStart?.toString() ?? "2018"}
                min={1990}
                max={2100}
                className="bg-[#0d0d0d] border border-zinc-800 focus:border-yellow-500/50 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                Año hasta{" "}
                {dbMatch ? (
                  <span className="text-zinc-700 normal-case tracking-normal font-normal">
                    — opcional
                  </span>
                ) : (
                  <span className="text-yellow-500">*</span>
                )}
              </span>
              <input
                type="number"
                value={yearEnd}
                onChange={(e) => setYearEnd(e.target.value)}
                placeholder={dbMatch?.yearEnd?.toString() ?? "2023"}
                min={1990}
                max={2100}
                className="bg-[#0d0d0d] border border-zinc-800 focus:border-yellow-500/50 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        )}

        {alreadyAdded && make && model && (
          <p className="text-[11px] text-zinc-600 italic">
            Ya está en la lista.
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700 text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={13} strokeWidth={3} />
          Agregar vehículo
        </button>
      </div>

      {/* ── Selector de existentes (collapsible) ── */}
      <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setSelectorOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-widest">
            {selectorOpen
              ? "Cerrar lista"
              : `Selección rápida — ${vehicles.length} en base de datos`}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${selectorOpen ? "rotate-180" : ""}`}
          />
        </button>

        {selectorOpen && (
          <div className="border-t border-zinc-800">
            <div className="relative px-3 py-3 border-b border-zinc-800/60">
              <Search
                size={13}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
              />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filtrar por marca o modelo..."
                className="w-full bg-[#0d0d0d] border border-zinc-800 text-white text-xs px-4 py-2 pl-8 rounded-md focus:outline-none focus:border-yellow-500/50 placeholder-zinc-700 transition-colors"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {grouped.length === 0 ? (
                <p className="text-zinc-700 text-xs text-center py-8 uppercase tracking-widest">
                  {filterText ? "Sin resultados" : "No hay modelos en la BD"}
                </p>
              ) : (
                grouped.map(([mk, makeVehicles]) => (
                  <div key={mk}>
                    <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/50">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        {mk}
                      </span>
                    </div>
                    {makeVehicles.map((v) => {
                      const isSelected = selectedIds.has(v.id);
                      return (
                        <label
                          key={v.id}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-zinc-800/30 last:border-0 ${
                            isSelected
                              ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                              : "hover:bg-zinc-800/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleExisting(v.id)}
                            className="w-4 h-4 rounded accent-yellow-500 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? "text-yellow-400" : "text-zinc-300"
                              }`}
                            >
                              {v.model}
                            </span>
                            {(v.yearStart || v.yearEnd) && (
                              <span className="text-zinc-600 text-[10px] font-mono flex-shrink-0">
                                {v.yearStart ?? "?"}–{v.yearEnd ?? "hoy"}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            {grouped.length > 0 && (
              <div className="flex items-center justify-end px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/30">
                <button
                  type="button"
                  onClick={() => setEntries([])}
                  className="text-zinc-600 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
