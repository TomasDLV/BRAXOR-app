"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateCategory, type ActionState } from "@/actions/categoryActions";
import { Save, CheckCircle2, AlertCircle, Tag } from "lucide-react";

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

export default function EditCategoryForm({
  category,
}: {
  category: { id: string; name: string };
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionState, FormData>(updateCategory, null);

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push("/admin/categorias"), 1500);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 md:p-8">
      <h3 className="text-white font-black uppercase tracking-wide text-base mb-6 flex items-center gap-2">
        <Tag size={16} className="text-yellow-500" strokeWidth={2.5} />
        Renombrar Categoría
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

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={category.id} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
            Nombre <span className="text-yellow-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={category.name}
            className="bg-[#111] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
          <SubmitButton />
          <button
            type="button"
            onClick={() => router.push("/admin/categorias")}
            className="text-zinc-600 hover:text-zinc-300 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
