"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Star, ArrowRight, SlidersHorizontal, ImageOff, LayoutGrid } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  showPrice: boolean;
  imageUrl: string | null;
  isNew: boolean;
  isFeatured: boolean;
  category: { name: string };
  brand: { name: string };
}

export interface CatalogCategory {
  id: string;
  name: string;
  imageUrl: string | null;
}

type CategoryFilter = "Todos" | string;

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Main Client Component ────────────────────────────────────────────────────

export default function CatalogoClient({
  products,
  categories,
  initialCategory = "Todos",
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = activeCategory === "Todos" || p.category.name === activeCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, activeCategory, products]);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── HEADER ── */}
      <section className="relative w-full pt-16 pb-12 px-4 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">
              — Bräxor Off-Road
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-lg">
              Catálogo
              <br />
              <span className="text-zinc-600">Completo</span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg mt-4 max-w-xl font-medium">
              Equipamiento seleccionado para el máximo rendimiento Off-Road.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── TOOLBAR ── */}
      <section className="sticky top-[72px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-900 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-full md:max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, marca o SKU..."
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white text-sm pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-zinc-600 placeholder-zinc-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={16} className="text-zinc-600 flex-shrink-0 hidden md:block" />

            {/* Botón "Todos" */}
            <motion.button
              key="Todos"
              onClick={() => setActiveCategory("Todos")}
              whileTap={{ scale: 0.94 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === "Todos"
                  ? "bg-yellow-500 text-black shadow-[0_0_14px_rgba(234,179,8,0.45)]"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
            >
              <LayoutGrid size={12} strokeWidth={2.5} />
              Todos
            </motion.button>

            {/* Categorías dinámicas */}
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                whileTap={{ scale: 0.94 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.name
                    ? "bg-yellow-500 text-black shadow-[0_0_14px_rgba(234,179,8,0.45)]"
                    : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {cat.imageUrl ? (
                  <span className="relative w-4 h-4 flex-shrink-0">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </span>
                ) : null}
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.p layout className="text-zinc-600 text-xs uppercase tracking-widest mb-8 font-medium">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado
          {filtered.length !== 1 ? "s" : ""}
        </motion.p>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-32 gap-4 text-center"
              >
                <Search size={40} className="text-zinc-700" />
                <p className="text-zinc-500 font-semibold uppercase tracking-widest text-sm">
                  {products.length === 0
                    ? "No hay productos publicados aún"
                    : `Sin resultados para "${query}"`}
                </p>
                {products.length > 0 && (
                  <button
                    onClick={() => { setQuery(""); setActiveCategory("Todos"); }}
                    className="text-yellow-500 text-xs uppercase tracking-widest font-bold hover:text-yellow-400 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.38, delay: index * 0.055, ease: "easeOut" as const }}
      whileHover="hover"
      className="group"
    >
      <Link href={`/catalogo/${product.id}`}>
        <motion.article
          variants={{
            rest: { y: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.55)" },
            hover: { y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(234,179,8,0.18)" },
          }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="relative bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
        >
          {/* IMAGE ZONE */}
          <div className="relative h-56 md:h-60 bg-[#0d0d0d] overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.06)_0%,_transparent_70%)]" />

            <motion.div
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.07 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" as const }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.9)] p-6"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-20">
                  <ImageOff size={36} className="text-zinc-400" />
                  <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                    {product.category.name}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none">
                  <Zap size={9} strokeWidth={3} />
                  Nuevo
                </span>
              )}
              {product.isFeatured && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none border border-zinc-700">
                  <Star size={9} strokeWidth={3} />
                  Destacado
                </span>
              )}
            </div>

            {/* Hover CTA */}
            <motion.div
              variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-3 right-3 z-10"
            >
              <span className="flex items-center gap-1.5 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md leading-none shadow-lg">
                Ver detalles
                <ArrowRight size={10} strokeWidth={3} />
              </span>
            </motion.div>
          </div>

          {/* INFO ZONE */}
          <div className="flex flex-col flex-1 p-5 gap-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              {product.brand.name}
            </p>
            <h3 className="text-white font-black uppercase text-sm md:text-[13px] leading-snug tracking-wide line-clamp-2 flex-1">
              {product.name}
            </h3>
            <div className="w-full h-px bg-zinc-800 mt-1" />
            <div className="flex items-end justify-between mt-1">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Precio</p>
                {product.showPrice ? (
                  <p className="text-yellow-500 font-black text-lg md:text-xl leading-none">
                    {formatARS(product.price)}
                  </p>
                ) : (
                  <p className="text-zinc-500 font-black text-sm uppercase tracking-widest leading-none">
                    Consultar
                  </p>
                )}
              </div>
              <p className="text-zinc-700 text-[9px] uppercase tracking-widest font-mono">
                {product.sku}
              </p>
            </div>
          </div>

          {/* Bottom glow on hover */}
          <motion.div
            variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent origin-center"
          />
        </motion.article>
      </Link>
    </motion.div>
  );
}
