"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

import type { ActionState } from "@/types/actions";

// ─── TOGGLES ──────────────────────────────────────────────────────────────────

export async function toggleProductActive(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const current = formData.get("isActive") === "true";
  if (!id) return;
  await prisma.product.update({ where: { id }, data: { isActive: !current } });
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}

export async function toggleProductPrice(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const current = formData.get("showPrice") === "true";
  if (!id) return;
  const product = await prisma.product.findUnique({ where: { id }, select: { price: true } });
  if (!product?.price) return; // no price → can't enable showPrice
  await prisma.product.update({ where: { id }, data: { showPrice: !current } });
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    imageUrl: formData.get("imageUrl") as string | null,
  };

  // — Validation —
  const errors: Record<string, string> = {};
  if (!raw.name?.trim()) errors.name = "El nombre es obligatorio.";
  if (!raw.sku?.trim()) errors.sku = "El SKU es obligatorio.";
  if (raw.price && (isNaN(Number(raw.price)) || Number(raw.price) <= 0))
    errors.price = "Ingresá un precio válido.";
  if (!raw.categoryId) errors.categoryId = "Seleccioná una categoría.";
  if (!raw.brandId) errors.brandId = "Seleccioná una marca.";

  if (Object.keys(errors).length > 0)
    return { success: false, message: "Corregí los errores del formulario.", errors };

  const vehicleIds = formData.getAll("vehicleId") as string[];
  const parsedPrice = raw.price?.trim() ? Number(raw.price) : null;

  try {
    await prisma.product.create({
      data: {
        name: raw.name.trim(),
        sku: raw.sku.trim().toUpperCase(),
        description: raw.description?.trim() || null,
        price: parsedPrice,
        stock: Number(raw.stock) || 0,
        categoryId: raw.categoryId,
        brandId: raw.brandId,
        isFeatured: raw.isFeatured,
        isNew: raw.isNew,
        imageUrl: raw.imageUrl?.trim() || null,
        showPrice: parsedPrice !== null,
        ...(vehicleIds.length > 0 && {
          vehicles: { connect: vehicleIds.map((id) => ({ id })) },
        }),
      },
    });

    revalidatePath("/admin");
    return { success: true, message: `Producto "${raw.name}" creado exitosamente.` };
  } catch (err: unknown) {
    const isUniqueViolation =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";

    if (isUniqueViolation)
      return { success: false, message: "El SKU ya existe.", errors: { sku: "Este SKU ya está en uso." } };

    console.error("[createProduct]", err);
    return { success: false, message: "Error inesperado. Intentá de nuevo." };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID inválido." };

  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    imageUrl: formData.get("imageUrl") as string | null,
  };

  const errors: Record<string, string> = {};
  if (!raw.name?.trim()) errors.name = "El nombre es obligatorio.";
  if (!raw.sku?.trim()) errors.sku = "El SKU es obligatorio.";
  if (raw.price && (isNaN(Number(raw.price)) || Number(raw.price) <= 0))
    errors.price = "Ingresá un precio válido.";
  if (!raw.categoryId) errors.categoryId = "Seleccioná una categoría.";
  if (!raw.brandId) errors.brandId = "Seleccioná una marca.";

  if (Object.keys(errors).length > 0)
    return { success: false, message: "Corregí los errores del formulario.", errors };

  const vehicleIds = formData.getAll("vehicleId") as string[];
  const parsedPrice = raw.price?.trim() ? Number(raw.price) : null;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: raw.name.trim(),
        sku: raw.sku.trim().toUpperCase(),
        description: raw.description?.trim() || null,
        price: parsedPrice,
        stock: Number(raw.stock) || 0,
        categoryId: raw.categoryId,
        brandId: raw.brandId,
        isFeatured: raw.isFeatured,
        isNew: raw.isNew,
        ...(parsedPrice === null ? { showPrice: false } : {}),
        ...(raw.imageUrl?.trim() ? { imageUrl: raw.imageUrl.trim() } : {}),
        vehicles: { set: vehicleIds.map((id) => ({ id })) },
      },
    });

    revalidatePath("/admin/productos");
    revalidatePath("/admin");
    revalidatePath("/catalogo");
    return { success: true, message: `Producto "${raw.name}" actualizado.` };
  } catch (err: unknown) {
    const isUnique =
      typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
    if (isUnique)
      return { success: false, message: "El SKU ya existe.", errors: { sku: "Este SKU ya está en uso." } };
    console.error("[updateProduct]", err);
    return { success: false, message: "Error inesperado. Intentá de nuevo." };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteProduct(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID inválido." };

  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    return { success: true, message: "Producto eliminado." };
  } catch (err) {
    console.error("[deleteProduct]", err);
    return { success: false, message: "No se pudo eliminar el producto." };
  }
}
