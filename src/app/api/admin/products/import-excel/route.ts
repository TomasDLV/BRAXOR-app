import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── Column name normalizer ────────────────────────────────────────────────────

const COLUMN_MAP: Record<string, string> = {
  // SKU
  sku: "sku", codigo: "sku", code: "sku", ref: "sku", referencia: "sku",
  art: "sku", articulo: "sku", "cod.": "sku", "cód": "sku", "cód.": "sku",
  "código interno": "sku", "codigo interno": "sku", "cód. interno": "sku",
  "cod. interno": "sku", "código int.": "sku", "codigo int.": "sku",
  // Name
  nombre: "name", name: "name", descripcion: "name", producto: "name",
  item: "name", detalle: "name", "descripción": "name",
  // Price
  precio: "price", price: "price", pvp: "price", valor: "price",
  importe: "price", costo: "price", "precio venta": "price",
  "precio de venta": "price", "p. venta": "price",
  // Stock
  stock: "stock", cantidad: "stock", qty: "stock", quantity: "stock",
  existencia: "stock", disponible: "stock", "cant.": "stock",
  // Brand
  marca: "brand", brand: "brand", fabricante: "brand", proveedor: "brand",
  // Category
  categoria: "category", category: "category", rubro: "category",
  tipo: "category", "categoría": "category", familia: "category",
};

function normalizeHeader(raw: string): string {
  return COLUMN_MAP[raw.toLowerCase().trim()] ?? raw.toLowerCase().trim();
}

function parseNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(String(val).replace(/[^0-9.,]/g, "").replace(",", "."));
  return isNaN(n) ? null : n;
}

function parseString(val: unknown): string {
  return String(val ?? "").trim();
}

// ─── Ensure fallback category & brand exist ───────────────────────────────────

async function getFallbackCategory(): Promise<string> {
  const cat = await prisma.category.upsert({
    where: { name: "Por Categorizar" },
    update: {},
    create: { name: "Por Categorizar", showInHome: false },
  });
  return cat.id;
}

async function getFallbackBrand(): Promise<string> {
  const brand = await prisma.partBrand.upsert({
    where: { name: "Sin Marca" },
    update: {},
    create: { name: "Sin Marca", showInHome: false },
  });
  return brand.id;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Parse file from form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "No se pudo leer el formulario" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  // Convert to buffer & parse with xlsx
  const buffer = Buffer.from(await file.arrayBuffer());
  let rows: Record<string, unknown>[];
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: true,
    });

    // Normalize headers
    rows = raw.map((row) => {
      const normalized: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        normalized[normalizeHeader(k)] = v;
      }
      return normalized;
    });
  } catch {
    return NextResponse.json({ error: "No se pudo parsear el archivo. Verificá que sea un Excel o CSV válido." }, { status: 400 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "El archivo está vacío o no tiene filas de datos." }, { status: 400 });
  }

  // Pre-load fallback ids
  const [fallbackCategoryId, fallbackBrandId] = await Promise.all([
    getFallbackCategory(),
    getFallbackBrand(),
  ]);

  // Pre-load existing categories & brands for name matching
  const [allCategories, allBrands] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.partBrand.findMany({ select: { id: true, name: true } }),
  ]);

  const catByName = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));
  const brandByName = new Map(allBrands.map((b) => [b.name.toLowerCase(), b.id]));

  // Process rows
  const results = {
    updated: 0,
    created: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because row 1 is headers

    const sku = parseString(row.sku).toUpperCase();
    if (!sku) {
      results.skipped++;
      results.errors.push(`Fila ${rowNum}: sin SKU, omitida.`);
      continue;
    }

    const price = parseNumber(row.price);
    const stock = parseNumber(row.stock);

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { sku } });

    if (existing) {
      // UPDATE: solo precio y stock — nombre, categoría, marca e imágenes NUNCA se tocan
      await prisma.product.update({
        where: { sku },
        data: {
          ...(price !== null ? { price, showPrice: true } : {}),
          ...(stock !== null ? { stock: Math.round(stock) } : {}),
        },
      });
      results.updated++;
    } else {
      // CREATE with fallbacks
      const name = parseString(row.name) || "Producto sin nombre";

      // Resolve category
      const rowCategory = parseString(row.category).toLowerCase();
      const categoryId = rowCategory
        ? (catByName.get(rowCategory) ?? fallbackCategoryId)
        : fallbackCategoryId;

      // Resolve brand (create if needed)
      const rowBrand = parseString(row.brand);
      let brandId = fallbackBrandId;
      if (rowBrand) {
        const existing = brandByName.get(rowBrand.toLowerCase());
        if (existing) {
          brandId = existing;
        } else {
          // Create new brand on the fly
          try {
            const newBrand = await prisma.partBrand.create({
              data: { name: rowBrand, showInHome: false },
            });
            brandByName.set(rowBrand.toLowerCase(), newBrand.id);
            brandId = newBrand.id;
          } catch {
            brandId = fallbackBrandId;
          }
        }
      }

      // Determine if product is complete enough to be active
      const isComplete = name !== "Producto sin nombre" && categoryId !== fallbackCategoryId;

      await prisma.product.create({
        data: {
          sku,
          name,
          price: price ?? null,
          showPrice: price !== null,
          stock: stock !== null ? Math.round(stock) : 0,
          categoryId,
          brandId,
          isActive: isComplete,
          isNew: false,
          isFeatured: false,
        },
      });
      results.created++;
    }
  }

  return NextResponse.json({
    success: true,
    updated: results.updated,
    created: results.created,
    skipped: results.skipped,
    errors: results.errors,
    total: rows.length,
  });
}
