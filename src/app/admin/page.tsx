import { prisma } from "@/lib/prisma";
import CreateProductForm from "@/components/admin/CreateProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { Package, TrendingUp, Archive, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partBrand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const featured = products.filter((p) => p.isFeatured).length;
  const newProducts = products.filter((p) => p.isNew).length;

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      {/* ── PAGE HEADER ── */}
      <div className="mb-8">
        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
          Panel de control
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Productos
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Gestioná el inventario de Bräxor en tiempo real.
        </p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Package size={18} />}
          label="Total productos"
          value={products.length}
        />
        <StatCard
          icon={<Archive size={18} />}
          label="Unidades en stock"
          value={totalStock}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Destacados"
          value={featured}
          accent
        />
        <StatCard
          icon={<Layers size={18} />}
          label="Novedades"
          value={newProducts}
          accent
        />
      </div>

      {/* ── CREATE FORM ── */}
      <div className="mb-8">
        <CreateProductForm categories={categories} brands={brands} />
      </div>

      {/* ── PRODUCTS TABLE ── */}
      <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-black uppercase tracking-wide text-sm">
            Inventario
          </h2>
          <span className="text-zinc-600 text-xs font-mono">
            {products.length} registros
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Package size={36} className="text-zinc-800" />
            <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest">
              No hay productos todavía.
            </p>
            <p className="text-zinc-700 text-xs">
              Usá el formulario de arriba para agregar el primero.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/80">
                  {["SKU", "Nombre", "Categoría", "Marca", "Precio", "Stock", "Estado", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-zinc-600 text-[10px] font-bold uppercase tracking-widest px-5 py-3 whitespace-nowrap first:pl-6 last:pr-6"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-zinc-900/50 transition-colors group"
                  >
                    {/* SKU */}
                    <td className="pl-6 pr-4 py-4 font-mono text-zinc-500 text-xs whitespace-nowrap">
                      {p.sku}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4 text-white font-semibold max-w-[220px]">
                      <span className="line-clamp-1">{p.name}</span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">
                      {p.category.name}
                    </td>

                    {/* Brand */}
                    <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">
                      {p.brand.name}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 text-yellow-500 font-black whitespace-nowrap">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(Number(p.price))}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4 whitespace-nowrap">
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
                    <td className="px-4 py-4">
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
                    <td className="pr-6 pl-4 py-4 text-right">
                      <DeleteProductButton id={p.id} name={p.name} />
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

// ─── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-xl px-5 py-4 flex flex-col gap-3">
      <div className={`${accent ? "text-yellow-500" : "text-zinc-600"}`}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-white tabular-nums">{value}</p>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}
