"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/types/actions";

export async function createVehicle(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStartRaw = (formData.get("yearStart") as string)?.trim();
  const yearEndRaw = (formData.get("yearEnd") as string)?.trim();

  if (!make) return { success: false, message: "La marca del vehículo es obligatoria." };
  if (!model) return { success: false, message: "El modelo del vehículo es obligatorio." };

  const yearStart = yearStartRaw ? parseInt(yearStartRaw, 10) : null;
  const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;

  if (yearStart && isNaN(yearStart)) return { success: false, message: "Año de inicio inválido." };
  if (yearEnd && isNaN(yearEnd)) return { success: false, message: "Año de fin inválido." };
  if (yearStart && yearEnd && yearEnd < yearStart)
    return { success: false, message: "El año de fin no puede ser menor al año de inicio." };

  try {
    await prisma.vehicle.create({ data: { make, model, yearStart, yearEnd } });
    revalidatePath("/admin/modelos");
    revalidatePath("/catalogo");
    return { success: true, message: `Modelo "${make} ${model}" creado.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique)
      return { success: false, message: "Ese modelo ya existe para esa marca." };
    console.error("[createVehicle]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function updateVehicle(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const make = (formData.get("make") as string)?.trim();
  const model = (formData.get("model") as string)?.trim();
  const yearStartRaw = (formData.get("yearStart") as string)?.trim();
  const yearEndRaw = (formData.get("yearEnd") as string)?.trim();

  if (!id) return { success: false, message: "ID inválido." };
  if (!make) return { success: false, message: "La marca del vehículo es obligatoria." };
  if (!model) return { success: false, message: "El modelo del vehículo es obligatorio." };

  const yearStart = yearStartRaw ? parseInt(yearStartRaw, 10) : null;
  const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;

  if (yearStart && isNaN(yearStart)) return { success: false, message: "Año de inicio inválido." };
  if (yearEnd && isNaN(yearEnd)) return { success: false, message: "Año de fin inválido." };
  if (yearStart && yearEnd && yearEnd < yearStart)
    return { success: false, message: "El año de fin no puede ser menor al año de inicio." };

  try {
    await prisma.vehicle.update({ where: { id }, data: { make, model, yearStart, yearEnd } });
    revalidatePath("/admin/modelos");
    revalidatePath("/catalogo");
    return { success: true, message: `Modelo "${make} ${model}" actualizado.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique)
      return { success: false, message: "Ese modelo ya existe para esa marca." };
    console.error("[updateVehicle]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function deleteVehicle(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID inválido." };

  try {
    await prisma.vehicle.delete({ where: { id } });
    revalidatePath("/admin/modelos");
    revalidatePath("/catalogo");
    return { success: true, message: "Modelo eliminado." };
  } catch (err: unknown) {
    const hasFk =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2025";
    if (hasFk)
      return { success: false, message: "No se puede eliminar: hay productos asignados a este modelo." };
    console.error("[deleteVehicle]", err);
    return { success: false, message: "Error inesperado." };
  }
}
