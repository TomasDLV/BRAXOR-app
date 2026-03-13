"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { deleteProduct, type ActionState } from "@/actions/productActions";
import { Trash2 } from "lucide-react";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 text-zinc-600 hover:text-red-400 disabled:opacity-40 transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
      onClick={(e) => {
        if (!confirm("¿Eliminar este producto?")) e.preventDefault();
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

export default function DeleteProductButton({ id }: { id: string }) {
  const [, formAction] = useActionState<ActionState, FormData>(deleteProduct, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}
