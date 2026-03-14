"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteBrand, type ActionState } from "@/actions/brandActions";
import { Trash2 } from "lucide-react";

function DeleteButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      title={disabled ? "Tiene productos asignados" : "Eliminar marca"}
      className="flex items-center gap-1.5 text-zinc-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
      onClick={(e) => {
        if (!confirm("¿Eliminar esta marca?")) e.preventDefault();
      }}
    >
      {pending ? (
        <span className="w-3.5 h-3.5 border border-zinc-600 border-t-red-400 rounded-full animate-spin" />
      ) : (
        <Trash2 size={13} strokeWidth={2} />
      )}
      {pending ? "..." : "Eliminar"}
    </button>
  );
}

export default function DeleteBrandButton({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const [, formAction] = useActionState<ActionState, FormData>(deleteBrand, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton disabled={disabled} />
    </form>
  );
}
