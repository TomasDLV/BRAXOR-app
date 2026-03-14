"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createVehicle } from "@/actions/vehicleActions";
import type { ActionState } from "@/types/actions";
import { Plus, X, CheckCircle2, AlertCircle, ChevronDown, Car } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      ) : (
        <Plus size={16} strokeWidth={3} />
      )}
      {pending ? "Guardando..." : "Crear Modelo"}
    </button>
  );
}

export default function VehicleForm({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(createVehicle, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      const t = setTimeout(() => setOpen(false), 1500);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {children}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
        >
          {open ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
          {open ? "Cerrar" : "Nuevo Modelo"}
          <ChevronDown
            size={14}
            className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-white font-black uppercase tracking-wide text-base mb-6 flex items-center gap-2">
            <Car size={16} className="text-yellow-500" strokeWidth={2.5} />
            Registrar Nuevo Modelo
          </h3>

          {state && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg mb-6 text-sm font-medium border ${
                state.success
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {state.success ? (
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              {state.message}
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Make */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                  Marca del vehículo <span className="text-yellow-500">*</span>
                </label>
                <input
                  name="make"
                  type="text"
                  required
                  placeholder="Ej: Toyota"
                  className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Model */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                  Modelo <span className="text-yellow-500">*</span>
                </label>
                <input
                  name="model"
                  type="text"
                  required
                  placeholder="Ej: Hilux"
                  className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Year Start */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                  Año desde
                </label>
                <input
                  name="yearStart"
                  type="number"
                  min={1980}
                  max={2100}
                  placeholder="Ej: 2018"
                  className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Year End */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                  Año hasta
                </label>
                <input
                  name="yearEnd"
                  type="number"
                  min={1980}
                  max={2100}
                  placeholder="Ej: 2023"
                  className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            <p className="text-zinc-600 text-xs">
              Los años son opcionales. Si el modelo cubre todas las generaciones, podés dejarlos vacíos.
            </p>

            <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
              <SubmitButton />
              <button
                type="button"
                onClick={() => formRef.current?.reset()}
                className="text-zinc-600 hover:text-zinc-300 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
