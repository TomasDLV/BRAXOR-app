"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory } from "@/actions/categoryActions";
import type { ActionState } from "@/types/actions";
import { Plus, X, CheckCircle2, AlertCircle, ChevronDown, Tag } from "lucide-react";

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
      {pending ? "Guardando..." : "Crear Categoría"}
    </button>
  );
}

export default function CategoryForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(createCategory, null);
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
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {open ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
        {open ? "Cerrar" : "Nueva Categoría"}
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-72 opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-white font-black uppercase tracking-wide text-base mb-6 flex items-center gap-2">
            <Tag size={16} className="text-yellow-500" strokeWidth={2.5} />
            Registrar Nueva Categoría
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

          <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                Nombre <span className="text-yellow-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Ej: Accesorios"
                className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
              />
            </div>
            <div className="flex items-end">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
