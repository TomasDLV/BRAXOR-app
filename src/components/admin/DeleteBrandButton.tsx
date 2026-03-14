"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteBrand } from "@/actions/brandActions";
import type { ActionState } from "@/types/actions";
import { Trash2 } from "lucide-react";
import { useModalAction } from "@/hooks/useModalAction";
import ConfirmModal from "@/components/ui/ConfirmModal";

function DeleteButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      title={disabled ? "Tiene productos asignados" : "Eliminar marca"}
      className="flex items-center gap-1.5 text-zinc-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
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
  name,
  disabled,
}: {
  id: string;
  name?: string;
  disabled?: boolean;
}) {
  const [, formAction] = useActionState<ActionState, FormData>(deleteBrand, null);
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
              title: "Eliminar marca",
              description: name
                ? `¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`
                : "¿Estás seguro de que querés eliminar esta marca? Esta acción no se puede deshacer.",
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
        <DeleteButton disabled={disabled} />
      </form>

      <ConfirmModal {...modalProps} />
    </>
  );
}
