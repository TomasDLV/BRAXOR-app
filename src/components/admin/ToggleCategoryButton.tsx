"use client";

import { useToggleVisibility } from "@/hooks/useToggleVisibility";
import { toggleCategoryVisibility } from "@/actions/categoryActions";
import { Eye, EyeOff } from "lucide-react";

export default function ToggleCategoryButton({
  id,
  showInHome,
}: {
  id: string;
  showInHome: boolean;
}) {
  const { value, toggle, isPending } = useToggleVisibility(id, showInHome, toggleCategoryVisibility);

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      title={value ? "Visible en inicio — click para ocultar" : "Oculta en inicio — click para mostrar"}
      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40 cursor-pointer ${
        value ? "text-emerald-500 hover:text-zinc-500" : "text-zinc-600 hover:text-emerald-500"
      }`}
    >
      {isPending ? (
        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      ) : value ? (
        <Eye size={13} strokeWidth={2} />
      ) : (
        <EyeOff size={13} strokeWidth={2} />
      )}
      {value ? "Visible" : "Oculta"}
    </button>
  );
}
