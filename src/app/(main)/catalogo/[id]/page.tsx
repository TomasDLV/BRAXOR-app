import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Star, MessageCircle, Tag, Car } from "lucide-react";
import ProductCarousel from "@/components/catalogo/ProductCarousel";
import AddToCartButton from "@/components/cart/AddToCartButton";

const WA_NUMBER = "5493816390854";

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
    include: {
      category: true,
      brand: true,
      vehicles: { orderBy: [{ make: "asc" }, { model: "asc" }] },
    },
  });

  if (!product) notFound();

  // Portada primero, luego fotos adicionales de la galería
  const allImages: string[] = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.images ?? []),
  ];

  const waText = encodeURIComponent(
    `Hola, quiero consultar por el producto: ${product.name} (SKU: ${product.sku})`
  );
  const waHref = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Background texture */}
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

          {/* ── LEFT: CAROUSEL ── */}
          <ProductCarousel
            images={allImages}
            productName={product.name}
            isNew={product.isNew}
            isFeatured={product.isFeatured}
          />

          {/* ── RIGHT: INFO ── */}
          <div className="flex flex-col gap-6 lg:pt-4">
            {/* Brand + Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                {product.brand.name}
              </span>
              <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.07] text-zinc-500 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
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
            <div className="h-px bg-gradient-to-r from-yellow-500/30 via-white/10 to-transparent" />

            {/* Price */}
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.25em] font-bold mb-1">
                Precio de referencia
              </p>
              {product.showPrice && product.price ? (
                <>
                  <p className="text-5xl md:text-6xl font-black text-yellow-500 leading-none drop-shadow-[0_0_20px_rgba(234,179,8,0.35)]">
                    {formatARS(Number(product.price))}
                  </p>
                  <p className="text-zinc-700 text-xs mt-2">
                    * Consultá disponibilidad y precio actualizado por WhatsApp
                  </p>
                </>
              ) : (
                <p className="text-3xl font-black text-zinc-400 uppercase tracking-widest leading-none">
                  Consultá precio
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Descripción
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Vehículos compatibles */}
            {product.vehicles.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Car size={13} className="text-yellow-500" strokeWidth={2.5} />
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                    Vehículos compatibles
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(
                    product.vehicles.reduce<Record<string, typeof product.vehicles>>(
                      (acc, v) => { (acc[v.make] ??= []).push(v); return acc; },
                      {}
                    )
                  ).map(([make, models]) => (
                    <div key={make} className="flex flex-col gap-1.5">
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{make}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {models.map((v) => (
                          <span
                            key={v.id}
                            className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-lg"
                          >
                            {v.model}
                            {(v.yearStart || v.yearEnd) && (
                              <span className="text-zinc-600 font-mono text-[10px]">
                                {v.yearStart ?? "?"}–{v.yearEnd ?? "hoy"}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand.name,
                  category: product.category.name,
                  price: product.price ? Number(product.price) : null,
                  showPrice: product.showPrice,
                  imageUrl: product.imageUrl,
                  sku: product.sku,
                }}
              />
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-base px-8 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                Consultar directamente
              </a>
            </div>

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
