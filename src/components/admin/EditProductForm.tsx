"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/actions/productActions";
import type { ActionState } from "@/types/actions";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

interface ProductData {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  brandId: string;
  isFeatured: boolean;
  isNew: boolean;
  imageUrl: string;
}

interface Props {
  product: ProductData;
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
        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      ) : (
        <Save size={16} strokeWidth={2.5} />
      )}
      {pending ? "Guardando..." : "Guardar Cambios"}
    </button>
  );
}

export default function EditProductForm({ product, categories, brands }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionState, FormData>(updateProduct, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push("/admin/productos"), 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
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
        <input type="hidden" name="id" value={product.id} />

        {/* Name + SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Nombre del Producto"
            name="name"
            defaultValue={product.name}
            required
            error={state?.errors?.name}
          />
          <Field
            label="SKU"
            name="sku"
            defaultValue={product.sku}
            required
            error={state?.errors?.sku}
            hint="Se guarda en mayúsculas"
          />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field
            label="Precio (ARS)"
            name="price"
            type="number"
            defaultValue={String(product.price)}
            required
            error={state?.errors?.price}
          />
          <Field
            label="Stock"
            name="stock"
            type="number"
            defaultValue={String(product.stock)}
          />
        </div>

        {/* Category + Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Categoría"
            name="categoryId"
            defaultValue={product.categoryId}
            required
            error={state?.errors?.categoryId}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <SelectField
            label="Marca"
            name="brandId"
            defaultValue={product.brandId}
            required
            error={state?.errors?.brandId}
            options={brands.map((b) => ({ value: b.id, label: b.name }))}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
            Descripción{" "}
            <span className="text-zinc-700 normal-case tracking-normal font-normal">(opcional)</span>
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description}
            placeholder="Descripción técnica del producto..."
            className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors resize-none"
          />
        </div>

        {/* Image */}
        <ProductImageUploader
          onUploadComplete={setImageUrl}
          existingUrl={imageUrl}
        />
        <input type="hidden" name="imageUrl" value={imageUrl} />

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-1">
          <ToggleField name="isNew" label="Marcar como NUEVO" defaultChecked={product.isNew} />
          <ToggleField name="isFeatured" label="Marcar como DESTACADO" defaultChecked={product.isFeatured} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
          <SubmitButton />
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="text-zinc-600 hover:text-zinc-300 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Field Primitives ──────────────────────────────────────────────────────────

function Field({
  label, name, type = "text", defaultValue, required, error, hint,
}: {
  label: string; name: string; type?: string; defaultValue?: string;
  required?: boolean; error?: string; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
        {label}
        {required && <span className="text-yellow-500">*</span>}
        {hint && <span className="text-zinc-700 normal-case tracking-normal font-normal text-[10px]">— {hint}</span>}
      </label>
      <input
        id={name} name={name} type={type} defaultValue={defaultValue} required={required}
        className={`bg-[#111] border text-white text-sm px-4 py-3 rounded-lg focus:outline-none placeholder-zinc-700 transition-colors ${
          error ? "border-red-500/60 focus:border-red-500" : "border-zinc-700 focus:border-yellow-500/70"
        }`}
      />
      {error && <p className="text-red-400 text-[11px] font-medium">{error}</p>}
    </div>
  );
}

function SelectField({
  label, name, options, defaultValue, required, error,
}: {
  label: string; name: string; options: { value: string; label: string }[];
  defaultValue?: string; required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-zinc-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
        {label}
        {required && <span className="text-yellow-500">*</span>}
      </label>
      <select
        id={name} name={name} required={required} defaultValue={defaultValue ?? ""}
        className={`bg-[#111] border text-white text-sm px-4 py-3 rounded-lg focus:outline-none transition-colors appearance-none cursor-pointer ${
          error ? "border-red-500/60 focus:border-red-500" : "border-zinc-700 focus:border-yellow-500/70"
        }`}
      >
        <option value="" disabled className="text-zinc-600">— Seleccionar —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#1a1a1a]">{o.label}</option>
        ))}
      </select>
      {error && <p className="text-red-400 text-[11px] font-medium">{error}</p>}
    </div>
  );
}

function ToggleField({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
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
