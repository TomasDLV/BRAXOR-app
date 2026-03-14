"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/types/actions";

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get("name") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  if (!name) return { success: false, message: "El nombre es obligatorio." };

  try {
    await prisma.category.create({ data: { name, imageUrl } });
    revalidatePath("/admin/categorias");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, message: `Categoría "${name}" creada.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique) return { success: false, message: "Esa categoría ya existe." };
    console.error("[createCategory]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function updateCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  if (!id) return { success: false, message: "ID inválido." };
  if (!name) return { success: false, message: "El nombre es obligatorio." };

  try {
    await prisma.category.update({ where: { id }, data: { name, imageUrl } });
    revalidatePath("/admin/categorias");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, message: `Categoría renombrada a "${name}".` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique) return { success: false, message: "Ese nombre ya existe." };
    console.error("[updateCategory]", err);
    return { success: false, message: "Error inesperado." };
  }
}

export async function toggleCategoryVisibility(id: string, current: boolean): Promise<void> {
  await prisma.category.update({ where: { id }, data: { showInHome: !current } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/catalogo");
}

export async function deleteCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID inválido." };

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categorias");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, message: "Categoría eliminada." };
  } catch (err: unknown) {
    const hasFk =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2003";
    if (hasFk)
      return {
        success: false,
        message: "No se puede eliminar: hay productos asignados a esta categoría.",
      };
    console.error("[deleteCategory]", err);
    return { success: false, message: "Error inesperado." };
  }
}

