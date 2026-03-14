import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCategoryForm from "@/components/admin/EditCategoryForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-lg">
        {/* Back */}
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Categorías
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
            Edición
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Editar Categoría
          </h1>
          <p className="text-zinc-500 text-sm mt-1">{category.name}</p>
        </div>

        <EditCategoryForm category={{ id: category.id, name: category.name, imageUrl: category.imageUrl }} />
      </div>
    </main>
  );
}
