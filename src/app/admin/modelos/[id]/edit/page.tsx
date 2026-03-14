import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditVehicleForm from "@/components/admin/EditVehicleForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-lg">
        {/* Back */}
        <Link
          href="/admin/modelos"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Modelos
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            Edición
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Editar Modelo
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {vehicle.make} {vehicle.model}
          </p>
        </div>

        <EditVehicleForm
          vehicle={{
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            yearStart: vehicle.yearStart,
            yearEnd: vehicle.yearEnd,
          }}
        />
      </div>
    </main>
  );
}
