import { prisma } from "@/lib/prisma";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
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

  return <CatalogoClient products={serialized} />;
}
