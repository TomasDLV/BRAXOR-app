"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBrand } from "@/actions/brandActions";
import type { ActionState } from "@/types/actions";
import { Plus, X, CheckCircle2, AlertCircle, ChevronDown, Shield } from "lucide-react";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

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
      {pending ? "Guardando..." : "Crear Marca"}
    </button>
  );
}

export default function BrandForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(createBrand, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setLogoUrl("");
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
        {open ? "Cerrar" : "Nueva Marca"}
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-white font-black uppercase tracking-wide text-base mb-6 flex items-center gap-2">
            <Shield size={16} className="text-yellow-500" strokeWidth={2.5} />
            Registrar Nueva Marca
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
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                Nombre <span className="text-yellow-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="Ej: ARB"
                className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
              />
            </div>

            {/* Logo upload */}
            <ProductImageUploader onUploadComplete={setLogoUrl} />
            <input type="hidden" name="logoUrl" value={logoUrl} />

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
