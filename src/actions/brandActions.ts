"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/types/actions";

export async function createBrand(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get("name") as string)?.trim();
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || null;

  if (!name) return { success: false, message: "El nombre es obligatorio." };

  try {
    await prisma.partBrand.create({ data: { name, logoUrl } });
    revalidatePath("/admin/marcas");
    return { success: true, message: `Marca "${name}" creada.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique) return { success: false, message: "Esa marca ya existe." };
    console.error("[createBrand]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function updateBrand(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || null;

  if (!id) return { success: false, message: "ID inválido." };
  if (!name) return { success: false, message: "El nombre es obligatorio." };

  try {
    await prisma.partBrand.update({ where: { id }, data: { name, logoUrl } });
    revalidatePath("/admin/marcas");
    return { success: true, message: `Marca "${name}" actualizada.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique) return { success: false, message: "Ese nombre ya existe." };
    console.error("[updateBrand]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function toggleBrandVisibility(id: string, current: boolean): Promise<void> {
  await prisma.partBrand.update({ where: { id }, data: { showInHome: !current } });
  revalidatePath("/admin/marcas");
  revalidatePath("/");
  revalidatePath("/catalogo");
}

export async function deleteBrand(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID inválido." };

  try {
    await prisma.partBrand.delete({ where: { id } });
    revalidatePath("/admin/marcas");
    return { success: true, message: "Marca eliminada." };
  } catch (err: unknown) {
    const hasFk =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2003";
    if (hasFk)
      return {
        success: false,
        message: "No se puede eliminar: hay productos asignados a esta marca.",
      };
    console.error("[deleteBrand]", err);
    return { success: false, message: "Error inesperado." };
  }
}
