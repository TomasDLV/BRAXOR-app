"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createProduct, type ActionState } from "@/actions/productActions";
import { Plus, X, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

interface Props {
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          Guardando...
        </>
      ) : (
        <>
          <Plus size={16} strokeWidth={3} />
          Crear Producto
        </>
      )}
    </button>
  );
}

export default function CreateProductForm({ categories, brands }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(createProduct, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setImageUrl("");
      // Auto-close form after success
      const t = setTimeout(() => setOpen(false), 1800);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {open ? <X size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
        {open ? "Cerrar" : "Nuevo Producto"}
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-white font-black uppercase tracking-wide text-base mb-6 flex items-center gap-2">
            <Plus size={16} className="text-yellow-500" strokeWidth={3} />
            Registrar Nuevo Producto
          </h3>

          {/* Feedback banner */}
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
            {/* Row 1: Name + SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Nombre del Producto"
                name="name"
                placeholder="Ej: Neumático BFG KO2"
                required
                error={state?.errors?.name}
              />
              <Field
                label="SKU"
                name="sku"
                placeholder="Ej: BFG-KO2-265-70R17"
                required
                error={state?.errors?.sku}
                hint="Se guarda en mayúsculas"
              />
            </div>

            {/* Row 2: Price + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Precio (ARS)"
                name="price"
                type="number"
                placeholder="Ej: 185000"
                required
                error={state?.errors?.price}
              />
              <Field
                label="Stock"
                name="stock"
                type="number"
                placeholder="Ej: 10"
                defaultValue="0"
              />
            </div>

            {/* Row 3: Category + Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Categoría"
                name="categoryId"
                required
                error={state?.errors?.categoryId}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              <SelectField
                label="Marca"
                name="brandId"
                required
                error={state?.errors?.brandId}
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                Descripción{" "}
                <span className="text-zinc-700 normal-case tracking-normal font-normal">
                  (opcional)
                </span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Descripción técnica del producto..."
                className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors resize-none"
              />
            </div>

            {/* Image Upload */}
            <ProductImageUploader onUploadComplete={setImageUrl} />
            <input type="hidden" name="imageUrl" value={imageUrl} />

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-1">
              <ToggleField name="isNew" label="Marcar como NUEVO" defaultChecked />
              <ToggleField name="isFeatured" label="Marcar como DESTACADO" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
              <SubmitButton />
              <button
                type="button"
                onClick={() => { formRef.current?.reset(); }}
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

// ─── Field Primitives ─────────────────────────────────────────────────────────

function Field({
  label, name, type = "text", placeholder, required, error, hint, defaultValue,
}: {
  label: string; name: string; type?: string; placeholder?: string;
  required?: boolean; error?: string; hint?: string; defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
        {label}
        {required && <span className="text-yellow-500">*</span>}
        {hint && <span className="text-zinc-700 normal-case tracking-normal font-normal text-[10px]">— {hint}</span>}
      </label>
      <input
        id={name} name={name} type={type} placeholder={placeholder}
        defaultValue={defaultValue} required={required}
        className={`bg-[#111] border text-white text-sm px-4 py-3 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors ${
          error ? "border-red-500/60 focus:border-red-500" : "border-zinc-700 focus:border-yellow-500/70"
        }`}
      />
      {error && <p className="text-red-400 text-[11px] font-medium">{error}</p>}
    </div>
  );
}

function SelectField({
  label, name, options, required, error,
}: {
  label: string; name: string; options: { value: string; label: string }[];
  required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
        {label}
        {required && <span className="text-yellow-500">*</span>}
      </label>
      <select
        id={name} name={name} required={required}
        defaultValue=""
        className={`bg-[#111] border text-white text-sm px-4 py-3 rounded-lg focus:outline-none transition-colors appearance-none cursor-pointer ${
          error ? "border-red-500/60 focus:border-red-500" : "border-zinc-700 focus:border-yellow-500/70"
        }`}
      >
        <option value="" disabled className="text-zinc-600">
          — Seleccionar —
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#1a1a1a]">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-[11px] font-medium">{error}</p>}
    </div>
  );
}

function ToggleField({
  name, label, defaultChecked,
}: {
  name: string; label: string; defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox" name={name} defaultChecked={defaultChecked}
        className="w-4 h-4 rounded accent-yellow-500 cursor-pointer"
      />
      <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold group-hover:text-zinc-300 transition-colors">
        {label}
      </span>
    </label>
  );
}
