"use client";

import { useOptimistic, useTransition } from "react";

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
