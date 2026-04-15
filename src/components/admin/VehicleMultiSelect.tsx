"use client";

import { useState, useMemo, useRef } from "react";
import { Car, Plus, X, ChevronDown, Search } from "lucide-react";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
};

type VehicleEntry =
  | { kind: "existing"; id: string }
  | { kind: "new"; raw: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function vehicleLabel(v: Vehicle) {
  const years =
    v.yearStart || v.yearEnd
      ? ` (${v.yearStart ?? "?"}–${v.yearEnd ?? "hoy"})`
      : "";
  return `${v.make} ${v.model}${years}`;
}

interface ParsedVehicle {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

function parseVehicleText(text: string): ParsedVehicle | null {
  const m = text.trim().match(/^(\S+)\s+(.+?)\s+(\d{4})-(\d{4})$/i);
  if (!m) return null;
  const [, make, model, ys, ye] = m;
  const yearStart = parseInt(ys, 10);
  const yearEnd = parseInt(ye, 10);
  if (yearEnd < yearStart || yearStart < 1900 || yearEnd > 2100) return null;
  return { make, model: model.trim(), yearStart, yearEnd };
}

function rawLabel(raw: string) {
  const p = parseVehicleText(raw);
  if (!p) return raw;
  return `${p.make} ${p.model} (${p.yearStart}–${p.yearEnd})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [inputText, setInputText] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // IDs already selected (for dedup in the selector list)
  const selectedIds = useMemo(
    () => new Set(entries.filter((e) => e.kind === "existing").map((e) => (e as { kind: "existing"; id: string }).id)),
    [entries]
  );

  // Parse live input
  const parsed = useMemo(() => parseVehicleText(inputText), [inputText]);

  // Check if already selected as new
  const alreadyNewRaw = useMemo(
    () => new Set(entries.filter((e) => e.kind === "new").map((e) => (e as { kind: "new"; raw: string }).raw)),
    [entries]
  );

  // Autocomplete suggestions from existing vehicles
  const suggestions = useMemo(() => {
    if (!inputText.trim()) return [];
    const q = inputText.toLowerCase();
    return vehicles
      .filter(
        (v) =>
          !selectedIds.has(v.id) &&
          (v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            vehicleLabel(v).toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [inputText, vehicles, selectedIds]);

  // Grouped vehicle list for the checkbox selector
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

  // ── Mutations ──

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function addExisting(id: string) {
    if (selectedIds.has(id)) return;
    setEntries((prev) => [...prev, { kind: "existing", id }]);
    setInputText("");
  }

  function addNew() {
    if (!parsed) return;
    const raw = inputText.trim();
    if (alreadyNewRaw.has(raw)) return;
    // Check if it already exists in DB
    const existing = vehicles.find(
      (v) =>
        v.make.toLowerCase() === parsed.make.toLowerCase() &&
        v.model.toLowerCase() === parsed.model.toLowerCase()
    );
    if (existing) {
      addExisting(existing.id);
    } else {
      setEntries((prev) => [...prev, { kind: "new", raw }]);
      setInputText("");
    }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && !parsed) {
        addExisting(suggestions[0].id);
      } else if (parsed) {
        addNew();
      }
    }
  };

  // Render a selected tag
  function EntryTag({ entry, index }: { entry: VehicleEntry; index: number }) {
    const label =
      entry.kind === "existing"
        ? vehicleLabel(vehicles.find((v) => v.id === entry.id)!)
        : rawLabel((entry as { kind: "new"; raw: string }).raw);
    const isNew = entry.kind === "new";

    return (
      <button
        type="button"
        onClick={() => removeEntry(index)}
        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer group/tag ${
          isNew
            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
        }`}
      >
        {isNew && (
          <span className="text-[9px] font-black uppercase tracking-wider opacity-70 mr-0.5">
            NUEVO
          </span>
        )}
        {label}
        <X size={10} strokeWidth={2.5} className="flex-shrink-0" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
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
      {entries.map((entry, i) =>
        entry.kind === "existing" ? (
          <input key={i} type="hidden" name="vehicleId" value={entry.id} />
        ) : (
          <input key={i} type="hidden" name="vehicleNew" value={(entry as { kind: "new"; raw: string }).raw} />
        )
      )}

      {/* ── Creatable input ── */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ej: Toyota Hilux 2016-2021  ·  Ford Ranger 2019-2023'
              className="w-full bg-[#0d0d0d] border border-zinc-800 focus:border-yellow-500/50 text-white text-xs px-4 py-2.5 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors"
            />
            {/* Parse preview */}
            {parsed && (
              <div className="absolute -bottom-5 left-0 flex items-center gap-1.5 text-[10px] text-emerald-500/80 font-medium pointer-events-none">
                <span>{parsed.make}</span>
                <span className="text-zinc-700">·</span>
                <span>{parsed.model}</span>
                <span className="text-zinc-700">·</span>
                <span className="font-mono">{parsed.yearStart}–{parsed.yearEnd}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addNew}
            disabled={!parsed}
            title="Crear y asignar nuevo vehículo"
            className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && inputText.trim() && (
          <div className="absolute z-20 left-0 right-12 top-full mt-1 bg-[#1a1a1a] border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
            {suggestions.map((v) => (
              <button
                key={v.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addExisting(v.id); }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
              >
                <span className="text-white text-xs font-semibold">
                  {v.make} {v.model}
                </span>
                {(v.yearStart || v.yearEnd) && (
                  <span className="text-zinc-600 text-[10px] font-mono">
                    {v.yearStart ?? "?"}–{v.yearEnd ?? "hoy"}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags de seleccionados */}
      {entries.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#0d0d0d] border border-zinc-800 rounded-lg mt-2">
          {entries.map((entry, i) => (
            <EntryTag key={i} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* ── Selector de existentes (collapsible) ── */}
      <div className="bg-[#111] border border-zinc-800 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setSelectorOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-widest">
            {selectorOpen
              ? "Cerrar lista"
              : `Seleccionar de existentes${vehicles.length > 0 ? ` — ${vehicles.length} en base de datos` : ""}`}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${selectorOpen ? "rotate-180" : ""}`}
          />
        </button>

        {selectorOpen && (
          <div className="border-t border-zinc-800">
            {/* Search */}
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

            {/* Vehicle list */}
            <div className="max-h-64 overflow-y-auto">
              {grouped.length === 0 ? (
                <p className="text-zinc-700 text-xs text-center py-8 uppercase tracking-widest">
                  {filterText ? "Sin resultados" : "No hay modelos en la BD"}
                </p>
              ) : (
                grouped.map(([make, makeVehicles]) => (
                  <div key={make}>
                    <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        {make}
                      </span>
                      <span className="text-zinc-700 text-[10px] font-mono">
                        {makeVehicles.length} modelo{makeVehicles.length !== 1 ? "s" : ""}
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
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/30">
                <button
                  type="button"
                  onClick={() =>
                    setEntries(vehicles.map((v) => ({ kind: "existing" as const, id: v.id })))
                  }
                  className="text-zinc-600 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setEntries([])}
                  className="text-zinc-600 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
