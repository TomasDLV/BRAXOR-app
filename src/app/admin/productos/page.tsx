import { prisma } from "@/lib/prisma";
import CreateProductForm from "@/components/admin/CreateProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { Package, ImageOff, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export default async function AdminProductosPage() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
          Gestión de inventario
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Productos
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {products.length} producto{products.length !== 1 ? "s" : ""} en catálogo.
        </p>
      </div>

      {/* Create form */}
      <div className="mb-8">
        <CreateProductForm categories={categories} brands={brands} />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-black uppercase tracking-wide text-sm">
            Inventario completo
          </h2>
          <span className="text-zinc-600 text-xs font-mono">{products.length} registros</span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Package size={36} className="text-zinc-800" />
            <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest">
              No hay productos todavía.
            </p>
            <p className="text-zinc-700 text-xs">Usá el formulario de arriba para agregar el primero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/80">
                  {["", "SKU", "Nombre", "Categoría", "Marca", "Precio", "Stock", "Estado", "Acciones"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="text-left text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-4 py-3 whitespace-nowrap first:pl-6 last:pr-6"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Thumbnail */}
                    <td className="pl-6 pr-2 py-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0d0d0d] border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.imageUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <ImageOff size={14} className="text-zinc-700" />
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-mono text-zinc-500 text-xs whitespace-nowrap">
                      {p.sku}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 text-white font-semibold max-w-[200px]">
                      <span className="line-clamp-1">{p.name}</span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{p.category.name}</td>

                    {/* Brand */}
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{p.brand.name}</td>

                    {/* Price */}
                    <td className="px-4 py-3 text-yellow-500 font-black whitespace-nowrap">
                      {formatARS(Number(p.price))}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`font-bold tabular-nums ${
                          p.stock === 0
                            ? "text-red-400"
                            : p.stock <= 3
                            ? "text-orange-400"
                            : "text-zinc-300"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.isNew && (
                          <span className="bg-yellow-500/15 text-yellow-500 border border-yellow-500/25 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md whitespace-nowrap">
                            Nuevo
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="bg-zinc-700/50 text-zinc-300 border border-zinc-700 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md whitespace-nowrap">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="pr-6 pl-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/productos/${p.id}/edit`}
                          className="flex items-center gap-1.5 text-zinc-600 hover:text-yellow-500 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <Pencil size={13} strokeWidth={2} />
                          Editar
                        </Link>
                        <span className="text-zinc-800">|</span>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
