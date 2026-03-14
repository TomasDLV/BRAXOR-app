"use client";

import { useOptimistic, useTransition } from "react";

/**
 * Hook genérico para toggles de visibilidad.
 * Usa useOptimistic para que el cambio se refleje de forma instantánea
 * en la UI sin esperar la respuesta del servidor.
 */
export function useToggleVisibility(
  id: string,
  initialValue: boolean,
  action: (id: string, current: boolean) => Promise<void>
) {
  const [optimisticValue, setOptimistic] = useOptimistic(initialValue);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      setOptimistic((v) => !v);
      await action(id, optimisticValue);
    });
  }

  return { value: optimisticValue, toggle, isPending };
}
