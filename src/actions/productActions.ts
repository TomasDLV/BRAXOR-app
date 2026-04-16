"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

import type { ActionState } from "@/types/actions";

// ─── Vehicle helpers ──────────────────────────────────────────────────────────

interface ParsedVehicle {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

function parseVehicleString(text: string): ParsedVehicle | null {
  const m = text.trim().match(/^(\S+)\s+(.+?)\s+(\d{4})-(\d{4})$/i);
  if (!m) return null;
  const [, make, model, ys, ye] = m;
  const yearStart = parseInt(ys, 10);
  const yearEnd = parseInt(ye, 10);
  if (yearEnd < yearStart || yearStart < 1900 || yearEnd > 2100) return null;
  return { make, model: model.trim(), yearStart, yearEnd };
}

/** Finds or creates vehicle records and returns all resolved IDs. */
async function resolveVehicleIds(
  existingIds: string[],
  newStrings: string[]
): Promise<string[]> {
  if (newStrings.length === 0) return existingIds;

  const resolved = await Promise.all(
    newStrings.map(async (raw) => {
      const parsed = parseVehicleString(raw);
      if (!parsed) return null;

      // Look for exact match (make + model + same year range)
      const existing = await prisma.vehicle.findFirst({
        where: {
          make: parsed.make,
          model: parsed.model,
          yearStart: parsed.yearStart,
          yearEnd: parsed.yearEnd,
        },
        select: { id: true },
      });
      if (existing) return existing.id;

      // Create a new record for this year range
      const created = await prisma.vehicle.create({
        data: {
          make: parsed.make,
          model: parsed.model,
          yearStart: parsed.yearStart,
          yearEnd: parsed.yearEnd,
        },
        select: { id: true },
      });
      return created.id;
    })
  );

  const newIds = resolved.filter((id): id is string => id !== null);
  return [...new Set([...existingIds, ...newIds])];
}

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
    images: formData.get("images") as string | null,
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

  const rawVehicleIds = formData.getAll("vehicleId") as string[];
  const newVehicleStrings = formData.getAll("vehicleNew") as string[];
  const parsedPrice = raw.price?.trim() ? Number(raw.price) : null;
  const parsedImages: string[] = raw.images ? JSON.parse(raw.images) : [];

  const vehicleIds = await resolveVehicleIds(rawVehicleIds, newVehicleStrings);

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
        images: parsedImages,
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
    images: formData.get("images") as string | null,
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

  const rawVehicleIds = formData.getAll("vehicleId") as string[];
  const newVehicleStrings = formData.getAll("vehicleNew") as string[];
  const parsedPrice = raw.price?.trim() ? Number(raw.price) : null;
  const parsedImages: string[] = raw.images ? JSON.parse(raw.images) : [];

  const vehicleIds = await resolveVehicleIds(rawVehicleIds, newVehicleStrings);

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
        images: parsedImages,
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
