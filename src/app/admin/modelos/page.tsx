import { prisma } from "@/lib/prisma";
import VehicleForm from "@/components/admin/VehicleForm";
import DeleteVehicleButton from "@/components/admin/DeleteVehicleButton";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import AdminPagination from "@/components/admin/AdminPagination";
import { Car, Layers, Pencil } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function AdminModelosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = q
    ? {
        OR: [
          { make: { contains: q, mode: "insensitive" as const } },
          { model: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy: [{ make: "asc" }, { model: "asc" }],
      include: { _count: { select: { products: true } } },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
          Gestión de catálogo
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
          Modelos de Vehículos
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {total} modelo{total !== 1 ? "s" : ""} registrado{total !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Create form + Search */}
      <div className="mb-8">
        <VehicleForm>
          <AdminSearchInput placeholder="Buscar por marca o modelo..." />
        </VehicleForm>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-black uppercase tracking-wide text-sm">
            Modelos registrados
          </h2>
          <span className="text-zinc-600 text-xs font-mono">{total} registros</span>
        </div>

        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Car size={36} className="text-zinc-800" />
            <p className="text-zinc-600 text-sm font-semibold uppercase tracking-widest">
              {q ? `Sin resultados para "${q}".` : "No hay modelos todavía."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/80">
                  {["Marca / Modelo", "Años", "Productos", "Acciones"].map((h, i) => (
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
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Make / Model */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                          <Car size={13} className="text-yellow-500" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{v.make}</p>
                          <p className="text-zinc-500 text-xs">{v.model}</p>
                        </div>
                      </div>
                    </td>

                    {/* Years */}
                    <td className="px-6 py-4">
                      {v.yearStart || v.yearEnd ? (
                        <span className="text-zinc-400 font-mono text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                          {v.yearStart ?? "?"} – {v.yearEnd ?? "hoy"}
                        </span>
                      ) : (
                        <span className="text-zinc-700 text-xs italic">Todas las generaciones</span>
                      )}
                    </td>

                    {/* Product count */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Layers size={13} className="text-zinc-600" />
                        <span
                          className={`font-bold tabular-nums text-sm ${
                            v._count.products > 0 ? "text-zinc-300" : "text-zinc-700"
                          }`}
                        >
                          {v._count.products}
                        </span>
                        <span className="text-zinc-600 text-xs">
                          {v._count.products === 1 ? "producto" : "productos"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="pr-6 pl-4 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/modelos/${v.id}/edit`}
                          className="flex items-center gap-1.5 text-zinc-600 hover:text-yellow-500 transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <Pencil size={13} strokeWidth={2} />
                          Editar
                        </Link>
                        <span className="text-zinc-800">|</span>
                        <DeleteVehicleButton
                          id={v.id}
                          label={`${v.make} ${v.model}`}
                          disabled={v._count.products > 0}
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
