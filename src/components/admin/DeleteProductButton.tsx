"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteProduct } from "@/actions/productActions";
import type { ActionState } from "@/types/actions";
import { Trash2 } from "lucide-react";
import { useModalAction } from "@/hooks/useModalAction";
import ConfirmModal from "@/components/ui/ConfirmModal";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 text-zinc-600 hover:text-red-400 disabled:opacity-40 transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
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

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name?: string;
}) {
  const [, formAction] = useActionState<ActionState, FormData>(deleteProduct, null);
  const { modalProps, openModal } = useModalAction();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmed = useRef(false);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          if (confirmed.current) {
            confirmed.current = false;
            return;
          }
          e.preventDefault();
          openModal(
            {
              title: "Eliminar producto",
              description: name
                ? `¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`
                : "¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.",
              confirmLabel: "Eliminar",
              variant: "danger",
            },
            () => {
              confirmed.current = true;
              formRef.current?.requestSubmit();
            },
          );
        }}
      >
        <input type="hidden" name="id" value={id} />
        <DeleteButton />
      </form>

      <ConfirmModal {...modalProps} />
    </>
  );
}
