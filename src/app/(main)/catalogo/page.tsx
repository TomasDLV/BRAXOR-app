import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    brand?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    isNew?: string;
    isFeatured?: string;
  }>;
}) {
  const params = await searchParams;

  const vehicleMake = params.vehicleMake?.trim() || null;
  const vehicleModel = params.vehicleModel?.trim() || null;
  const vehicleYearNum = params.vehicleYear ? parseInt(params.vehicleYear, 10) : null;
  const categoriaParam = params.categoria?.trim() || null;
  const brandParam = params.brand?.trim() || null;
  const isNewParam = params.isNew === "true";
  const isFeaturedParam = params.isFeatured === "true";

  // ── Vehicle filter with year-range logic ──────────────────────────────────
  const vehicleSomeFilter: Prisma.VehicleWhereInput = {};
  let hasVehicleFilter = false;

  if (vehicleMake && vehicleModel) {
    hasVehicleFilter = true;
    vehicleSomeFilter.make = { equals: vehicleMake, mode: "insensitive" };
    vehicleSomeFilter.model = { equals: vehicleModel, mode: "insensitive" };

    if (vehicleYearNum) {
      vehicleSomeFilter.AND = [
        { OR: [{ yearStart: null }, { yearStart: { lte: vehicleYearNum } }] },
        { OR: [{ yearEnd: null }, { yearEnd: { gte: vehicleYearNum } }] },
      ];
    }
  }

  // ── Main product query ────────────────────────────────────────────────────
  const [products, categories, brands, vehicles] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(hasVehicleFilter ? { vehicles: { some: vehicleSomeFilter } } : {}),
        ...(categoriaParam && categoriaParam !== "Todos"
          ? { category: { name: { equals: categoriaParam, mode: "insensitive" } } }
          : {}),
        ...(brandParam
          ? { brand: { name: { equals: brandParam, mode: "insensitive" } } }
          : {}),
        ...(isNewParam ? { isNew: true } : {}),
        ...(isFeaturedParam ? { isFeatured: true } : {}),
      },
      include: { category: true, brand: true, vehicles: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ orderBy: [{ make: "asc" }, { model: "asc" }] }),
  ]);

  return (
    <CatalogoClient
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: Number(p.price),
        showPrice: p.showPrice,
        imageUrl: p.imageUrl,
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        category: { name: p.category.name },
        brand: { name: p.brand.name },
        vehicleIds: p.vehicles.map((v) => v.id),
      }))}
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        imageUrl: c.imageUrl,
        icon: c.icon,
      }))}
      brands={brands.map((b) => ({
        id: b.id,
        name: b.name,
        logoUrl: b.logoUrl,
      }))}
      vehicles={vehicles.map((v) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        yearStart: v.yearStart,
        yearEnd: v.yearEnd,
      }))}
      initialFilters={{
        categoria: categoriaParam ?? "Todos",
        brand: brandParam,
        vehicleMake,
        vehicleModel,
        vehicleYear: params.vehicleYear?.trim() || null,
        isNew: isNewParam,
        isFeatured: isFeaturedParam,
      }}
    />
  );
}
