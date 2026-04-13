import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/EditProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands, vehicles] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { vehicles: true }, }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ orderBy: [{ make: "asc" }, { model: "asc" }] }),
  ]);

  if (!product) notFound();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-3xl">
        {/* Back */}
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Productos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            Edición
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Editar Producto
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-mono">{product.sku}</p>
        </div>

        <EditProductForm
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            description: product.description ?? "",
            price: Number(product.price),
            stock: product.stock,
            categoryId: product.categoryId,
            brandId: product.brandId,
            isFeatured: product.isFeatured,
            isNew: product.isNew,
            imageUrl: product.imageUrl ?? "",
            images: product.images ?? [],
            vehicleIds: product.vehicles.map((v) => v.id),
          }}
          categories={categories}
          brands={brands}
          vehicles={vehicles}
        />
      </div>
    </main>
  );
}
