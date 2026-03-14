"use client";

import { useState, useMemo } from "react";
import { Car, Search, X, ChevronDown } from "lucide-react";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
};

function vehicleLabel(v: Vehicle) {
  const years =
    v.yearStart || v.yearEnd
      ? ` (${v.yearStart ?? "?"}–${v.yearEnd ?? "hoy"})`
      : "";
  return `${v.make} ${v.model}${years}`;
}

export default function VehicleMultiSelect({
  vehicles,
  defaultSelected = [],
}: {
  vehicles: Vehicle[];
  defaultSelected?: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  // Group vehicles by make
  const grouped = useMemo(() => {
    const q = filter.toLowerCase();
    const filtered = vehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
    return Object.entries(
      filtered.reduce<Record<string, Vehicle[]>>((acc, v) => {
        (acc[v.make] ??= []).push(v);
        return acc;
      }, {})
    ).sort(([a], [b]) => a.localeCompare(b));
  }, [vehicles, filter]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedVehicles = vehicles.filter((v) => selected.has(v.id));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          <Car size={12} className="text-zinc-500" />
          Vehículos compatibles
          <span className="text-zinc-700 normal-case tracking-normal font-normal">— opcional</span>
        </label>
        {selected.size > 0 && (
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">
            {selected.size} seleccionado{selected.size !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Hidden inputs para el FormData */}
      {Array.from(selected).map((id) => (
        <input key={id} type="hidden" name="vehicleId" value={id} />
      ))}

      {/* Tags de seleccionados */}
      {selectedVehicles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#0d0d0d] border border-zinc-800 rounded-lg">
          {selectedVehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => toggle(v.id)}
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-bold px-2.5 py-1 rounded-md hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors cursor-pointer"
            >
              {vehicleLabel(v)}
              <X size={10} strokeWidth={2.5} />
            </button>
          ))}
        </div>
      )}

      {/* Desplegable del selector */}
      <div className="bg-[#111] border border-zinc-800 rounded-lg overflow-hidden">
        {/* Header del panel */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold uppercase tracking-widest">
            {open ? "Cerrar selector" : `Seleccionar vehículos${vehicles.length > 0 ? ` — ${vehicles.length} disponibles` : ""}`}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="border-t border-zinc-800">
            {/* Search */}
            <div className="relative px-3 py-3 border-b border-zinc-800/60">
              <Search
                size={13}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
              />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrar por marca o modelo..."
                className="w-full bg-[#0d0d0d] border border-zinc-800 text-white text-xs px-4 py-2 pl-8 rounded-md focus:outline-none focus:border-yellow-500/50 placeholder-zinc-700 transition-colors"
              />
            </div>

            {/* Vehicle list */}
            <div className="max-h-64 overflow-y-auto">
              {grouped.length === 0 ? (
                <p className="text-zinc-700 text-xs text-center py-8 uppercase tracking-widest">
                  {filter ? "Sin resultados" : "No hay modelos registrados"}
                </p>
              ) : (
                grouped.map(([make, makeVehicles]) => (
                  <div key={make}>
                    {/* Make header */}
                    <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        {make}
                      </span>
                      <span className="text-zinc-700 text-[10px] font-mono">
                        {makeVehicles.length} modelo{makeVehicles.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Models */}
                    {makeVehicles.map((v) => {
                      const isSelected = selected.has(v.id);
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
                            onChange={() => toggle(v.id)}
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

            {/* Footer con acciones rápidas */}
            {grouped.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/30">
                <button
                  type="button"
                  onClick={() => setSelected(new Set(vehicles.map((v) => v.id)))}
                  className="text-zinc-600 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
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
