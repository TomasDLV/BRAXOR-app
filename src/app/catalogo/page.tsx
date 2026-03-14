import { prisma } from "@/lib/prisma";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
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
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
  }));

  const serializedBrands = brands.map((b) => ({
    id: b.id,
    name: b.name,
    logoUrl: b.logoUrl,
  }));

  return (
    <CatalogoClient
      products={serializedProducts}
      categories={serializedCategories}
      brands={serializedBrands}
      initialCategory={matchedCategory}
    />
  );
}
