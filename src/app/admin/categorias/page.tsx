import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import ToggleCategoryButton from "@/components/admin/ToggleCategoryButton";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminPagination from "@/components/admin/AdminPagination";
import { Tag, Layers, Pencil, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/lib/category-icons";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function AdminCategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.category.count({ where }),
  ]);

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
          Gestión de catálogo
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Categorías
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {total} categoría{total !== 1 ? "s" : ""} activa{total !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Create form + Search */}
      <div className="mb-8">
        <CategoryForm>
          <AdminSearchInput placeholder="Buscar categorías..." />
        </CategoryForm>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-black uppercase tracking-wide text-sm">
            Categorías registradas
          </h2>
          <span className="text-zinc-600 text-xs font-mono">{total} registros</span>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Tag size={36} className="text-zinc-800" />
            <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest">
              {q ? `Sin resultados para "${q}".` : "No hay categorías todavía."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/80">
                  {["Imagen", "Nombre", "Productos", "Visibilidad", "Acciones"].map((h, i) => (
                    <th
                      key={i}
                      className="text-left text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-6 py-3 whitespace-nowrap first:pl-6 last:pr-6 last:text-right"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Imagen / Ícono */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0d0d0d] border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {cat.icon ? (
                          <CategoryIcon name={cat.icon} size={22} className="text-yellow-500" />
                        ) : cat.imageUrl ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={cat.imageUrl}
                              alt={cat.name}
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <ImageOff size={16} className="text-zinc-700" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          {cat.icon ? (
                            <CategoryIcon name={cat.icon} size={13} className="text-yellow-500" />
                          ) : (
                            <Tag size={13} className="text-yellow-500" strokeWidth={2} />
                          )}
                        </div>
                        <span className="text-white font-bold">{cat.name}</span>
                      </div>
                    </td>

                    {/* Product count */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Layers size={13} className="text-zinc-600" />
                        <span
                          className={`font-bold tabular-nums text-sm ${
                            cat._count.products > 0 ? "text-zinc-300" : "text-zinc-700"
                          }`}
                        >
                          {cat._count.products}
                        </span>
                        <span className="text-zinc-600 text-xs">
                          {cat._count.products === 1 ? "producto" : "productos"}
                        </span>
                      </div>
                    </td>

                    {/* Visibilidad */}
                    <td className="px-6 py-4">
                      <ToggleCategoryButton id={cat.id} showInHome={cat.showInHome} />
                    </td>

                    {/* Actions */}
                    <td className="pr-6 pl-4 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/categorias/${cat.id}/edit`}
                          className="flex items-center gap-1.5 text-zinc-600 hover:text-yellow-500 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <Pencil size={13} strokeWidth={2} />
                          Editar
                        </Link>
                        <span className="text-zinc-800">|</span>
                        <DeleteCategoryButton
                          id={cat.id}
                          name={cat.name}
                          disabled={cat._count.products > 0}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination total={total} perPage={PAGE_SIZE} />
      </div>
    </main>
  );
}
