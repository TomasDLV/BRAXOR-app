import { prisma } from "@/lib/prisma";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [products, categories, brands, vehicles] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, brand: true, vehicles: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ orderBy: [{ make: "asc" }, { model: "asc" }] }),
  ]);

  const matchedCategory = categoria
    ? categories.find((c) => c.name.toLowerCase() === categoria.toLowerCase())?.name ?? "Todos"
    : "Todos";

  const serializedProducts = products.map((p) => ({
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
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    icon: c.icon,
  }));

  const serializedBrands = brands.map((b) => ({
    id: b.id,
    name: b.name,
    logoUrl: b.logoUrl,
  }));

  const serializedVehicles = vehicles.map((v) => ({
    id: v.id,
    make: v.make,
    model: v.model,
    yearStart: v.yearStart,
    yearEnd: v.yearEnd,
  }));

  return (
    <CatalogoClient
      products={serializedProducts}
      categories={serializedCategories}
      brands={serializedBrands}
      vehicles={serializedVehicles}
      initialCategory={matchedCategory}
    />
  );
}
