import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Zap, Star, MessageCircle, ImageOff, Tag } from "lucide-react";

const WA_NUMBER = "5493816000000"; // ← Reemplazar con el número real

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true },
  });

  if (!product) notFound();

  const waText = encodeURIComponent(
    `Hola, quiero consultar por el producto: ${product.name} (SKU: ${product.sku})`
  );
  const waHref = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Carbon texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px),repeating-linear-gradient(-45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px)`,
        }}
      />

      {/* Back link */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver al Catálogo
        </Link>
      </div>

      {/* Product layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── LEFT: IMAGE ── */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-yellow-500/5 rounded-3xl blur-3xl scale-90 pointer-events-none" />

            <div className="relative bg-[#111] border border-zinc-800 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
              {/* Radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.07)_0%,_transparent_65%)]" />

              {product.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <ImageOff size={64} className="text-zinc-400" />
                  <span className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
                    Sin imagen
                  </span>
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="flex items-center gap-1.5 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                    <Zap size={11} strokeWidth={3} />
                    Nuevo
                  </span>
                )}
                {product.isFeatured && (
                  <span className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-zinc-700">
                    <Star size={11} strokeWidth={3} />
                    Destacado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: INFO ── */}
          <div className="flex flex-col gap-6 lg:pt-4">
            {/* Brand + Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                {product.brand.name}
              </span>
              <span className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                <Tag size={10} strokeWidth={2.5} />
                {product.category.name}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-zinc-700 text-xs font-mono uppercase tracking-widest">
              SKU: {product.sku}
            </p>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-yellow-500/30 via-zinc-800 to-transparent" />

            {/* Price */}
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] font-bold mb-1">
                Precio de referencia
              </p>
              <p className="text-5xl md:text-6xl font-black text-yellow-500 leading-none drop-shadow-[0_0_20px_rgba(234,179,8,0.35)]">
                {formatARS(Number(product.price))}
              </p>
              <p className="text-zinc-700 text-xs mt-2">
                * Consultá disponibilidad y precio actualizado por WhatsApp
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-[#111] border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Descripción
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock === 0
                    ? "bg-red-500"
                    : product.stock <= 3
                    ? "bg-orange-400"
                    : "bg-emerald-500"
                } shadow-[0_0_6px_currentColor]`}
              />
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                {product.stock === 0
                  ? "Sin stock — Consultá disponibilidad"
                  : product.stock <= 3
                  ? `Últimas ${product.stock} unidades`
                  : "Stock disponible"}
              </span>
            </div>

            {/* CTA WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-base px-8 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              Consultar por WhatsApp
            </a>

            {/* Back link mobile */}
            <Link
              href="/catalogo"
              className="text-center text-zinc-700 hover:text-zinc-400 text-xs uppercase tracking-widest font-bold transition-colors"
            >
              ← Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
