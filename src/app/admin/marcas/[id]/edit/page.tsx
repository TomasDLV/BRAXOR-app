import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBrandForm from "@/components/admin/EditBrandForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await prisma.partBrand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-lg">
        {/* Back */}
        <Link
          href="/admin/marcas"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Marcas
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            Edición
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Editar Marca
          </h1>
          <p className="text-zinc-500 text-sm mt-1">{brand.name}</p>
        </div>

        <EditBrandForm
          brand={{ id: brand.id, name: brand.name, logoUrl: brand.logoUrl }}
        />
      </div>
    </main>
  );
}
