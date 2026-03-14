"use client";

import { useFormStatus } from "react-dom";
import { toggleCategoryVisibility } from "@/actions/categoryActions";
import { Eye, EyeOff } from "lucide-react";

function ToggleButton({ showInHome }: { showInHome: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      title={showInHome ? "Visible en inicio — click para ocultar" : "Oculta en inicio — click para mostrar"}
      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40 cursor-pointer ${
        showInHome
          ? "text-emerald-500 hover:text-zinc-500"
          : "text-zinc-600 hover:text-emerald-500"
      }`}
    >
      {pending ? (
        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      ) : showInHome ? (
        <Eye size={13} strokeWidth={2} />
      ) : (
        <EyeOff size={13} strokeWidth={2} />
      )}
      {showInHome ? "Visible" : "Oculta"}
    </button>
  );
}

export default function ToggleCategoryButton({
  id,
  showInHome,
}: {
  id: string;
  showInHome: boolean;
}) {
  return (
    <form action={toggleCategoryVisibility}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="showInHome" value={String(showInHome)} />
      <ToggleButton showInHome={showInHome} />
    </form>
  );
}
