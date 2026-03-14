import { prisma } from "@/lib/prisma";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = "force-dynamic";

// Maps URL ?categoria= param to exact DB category names
const PARAM_TO_CATEGORY: Record<string, string> = {
  llantas: "Llantas",
  suspension: "Suspensión",
  defensas: "Defensas",
  iluminacion: "Iluminación",
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const initialCategory =
    categoria && PARAM_TO_CATEGORY[categoria.toLowerCase()]
      ? PARAM_TO_CATEGORY[categoria.toLowerCase()]
      : "Todos";

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    category: { name: p.category.name },
    brand: { name: p.brand.name },
  }));

  return <CatalogoClient products={serialized} initialCategory={initialCategory} />;
}
