"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Zap, Star, ArrowRight, ImageOff, LayoutGrid,
  SlidersHorizontal, X,
} from "lucide-react";

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

export interface CatalogBrand {
  id: string;
  name: string;
  logoUrl: string | null;
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CatalogoClient({
  products,
  categories,
  brands,
  initialCategory = "Todos",
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [filterNew, setFilterNew] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = activeCategory === "Todos" || p.category.name === activeCategory;
      const matchBrand = !activeBrand || p.brand.name === activeBrand;
      const matchNew = !filterNew || p.isNew;
      const matchFeatured = !filterFeatured || p.isFeatured;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchCat && matchBrand && matchNew && matchFeatured && matchQuery;
    });
  }, [query, activeCategory, activeBrand, filterNew, filterFeatured, products]);

  const activeFiltersCount = [
    activeCategory !== "Todos",
    activeBrand !== null,
    filterNew,
    filterFeatured,
  ].filter(Boolean).length;

  function clearFilters() {
    setQuery("");
    setActiveCategory("Todos");
    setActiveBrand(null);
    setFilterNew(false);
    setFilterFeatured(false);
  }

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
            transition={{ duration: 0.6, ease: "easeOut" }}
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

      {/* ── MOBILE STICKY TOP BAR ── */}
      <div className="lg:hidden sticky top-[72px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-900 px-4 py-3">
        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-zinc-600 placeholder-zinc-600 transition-colors"
            />
          </div>

          {/* Filtros button */}
          <button
            onClick={() => setBottomSheetOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-black uppercase tracking-widest cursor-pointer transition-colors flex-shrink-0 ${
              activeFiltersCount > 0
                ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                : "bg-[#1a1a1a] border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <SlidersHorizontal size={13} strokeWidth={2.5} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-yellow-500 text-black text-[9px] font-black flex items-center justify-center leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8 items-start">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:flex sticky top-24 w-64 xl:w-72 flex-shrink-0 flex-col gap-6">

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white text-sm pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-zinc-600 placeholder-zinc-600 transition-colors"
            />
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-2">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-1">Filtrar por</p>
            <button
              onClick={() => setFilterNew((v) => !v)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                filterNew
                  ? "bg-yellow-500/15 border border-yellow-500/40 text-yellow-400"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600"
              }`}
            >
              <Zap size={12} strokeWidth={3} />
              Nuevo
            </button>
            <button
              onClick={() => setFilterFeatured((v) => !v)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                filterFeatured
                  ? "bg-zinc-700/50 border border-zinc-500/40 text-zinc-200"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600"
              }`}
            >
              <Star size={12} strokeWidth={3} />
              Destacado
            </button>
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Categorías */}
          <div className="flex flex-col gap-1.5">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-1">Categorías</p>
            <button
              onClick={() => setActiveCategory("Todos")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer text-left ${
                activeCategory === "Todos"
                  ? "bg-yellow-500/10 border border-yellow-500/25 text-yellow-400"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <LayoutGrid size={12} className="text-zinc-400" />
              </div>
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer text-left ${
                  activeCategory === cat.name
                    ? "bg-yellow-500/10 border border-yellow-500/25 text-yellow-400"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {cat.imageUrl ? (
                    <Image src={cat.imageUrl} alt={cat.name} width={28} height={28} className="object-contain p-1" unoptimized />
                  ) : (
                    <span className="text-zinc-500 text-[9px] font-black">{cat.name[0]}</span>
                  )}
                </div>
                {cat.name}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                onClick={clearFilters}
                className="flex items-center gap-2 text-zinc-600 hover:text-red-400 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                <X size={12} strokeWidth={2.5} />
                Limpiar filtros
              </motion.button>
            )}
          </AnimatePresence>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* ── MARCAS — horizontal scroll ── */}
          {brands.length > 0 && (
            <section>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4">Marcas</p>
              <div
                className="flex flex-row gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {brands.map((brand) => (
                  <motion.button
                    key={brand.id}
                    onClick={() => setActiveBrand(activeBrand === brand.name ? null : brand.name)}
                    whileTap={{ scale: 0.93 }}
                    className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <div
                      className={`w-14 h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center overflow-hidden ${
                        activeBrand === brand.name
                          ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_16px_rgba(234,179,8,0.4)]"
                          : "border-zinc-800 bg-[#1a1a1a] hover:border-zinc-600"
                      }`}
                    >
                      {brand.logoUrl ? (
                        <Image src={brand.logoUrl} alt={brand.name} width={56} height={56} className="object-contain p-2" unoptimized />
                      ) : (
                        <span className={`text-xs font-black uppercase tracking-tight ${activeBrand === brand.name ? "text-yellow-400" : "text-zinc-500"}`}>
                          {brand.name.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider leading-none transition-colors whitespace-nowrap ${activeBrand === brand.name ? "text-yellow-400" : "text-zinc-600"}`}>
                      {brand.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="h-px bg-zinc-900 mt-4" />
            </section>
          )}

          {/* Contador */}
          <motion.p layout className="text-zinc-600 text-xs uppercase tracking-widest font-medium -mb-4">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </motion.p>

          {/* ── GRID ── */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                    {products.length === 0 ? "No hay productos publicados aún" : "Sin resultados"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-yellow-500 text-xs uppercase tracking-widest font-bold hover:text-yellow-400 transition-colors cursor-pointer">
                      Limpiar filtros
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET ── */}
      <AnimatePresence>
        {bottomSheetOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBottomSheetOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#111] border-t border-zinc-800 rounded-t-2xl overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-zinc-700" />
              </div>

              <div className="px-5 pb-8 pt-3 max-h-[75vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-white font-black uppercase tracking-widest text-sm">Filtros</span>
                  <button onClick={() => setBottomSheetOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                {/* Nuevo / Destacado */}
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">Estado</p>
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setFilterNew((v) => !v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                      filterNew
                        ? "bg-yellow-500/15 border border-yellow-500/40 text-yellow-400"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Zap size={12} strokeWidth={3} />
                    Nuevo
                  </button>
                  <button
                    onClick={() => setFilterFeatured((v) => !v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                      filterFeatured
                        ? "bg-zinc-700/50 border border-zinc-500/40 text-zinc-200"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                    }`}
                  >
                    <Star size={12} strokeWidth={3} />
                    Destacado
                  </button>
                </div>

                {/* Categorías */}
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">Categorías</p>
                <div className="flex flex-col gap-2 mb-6">
                  <button
                    onClick={() => setActiveCategory("Todos")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left ${
                      activeCategory === "Todos"
                        ? "bg-yellow-500/10 border border-yellow-500/25 text-yellow-400"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <LayoutGrid size={12} className="text-zinc-400" />
                    </div>
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left ${
                        activeCategory === cat.name
                          ? "bg-yellow-500/10 border border-yellow-500/25 text-yellow-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} width={28} height={28} className="object-contain p-1" unoptimized />
                        ) : (
                          <span className="text-zinc-500 text-[9px] font-black">{cat.name[0]}</span>
                        )}
                      </div>
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:border-red-500/40 hover:text-red-400 transition-colors"
                    >
                      Limpiar
                    </button>
                  )}
                  <button
                    onClick={() => setBottomSheetOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-yellow-500 text-black text-xs font-black uppercase tracking-widest cursor-pointer"
                  >
                    Ver {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
      transition={{ duration: 0.38, delay: index * 0.04, ease: "easeOut" }}
      whileHover="hover"
      className="group"
    >
      <Link href={`/catalogo/${product.id}`}>
        <motion.article
          variants={{
            rest: { y: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.55)" },
            hover: { y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(234,179,8,0.18)" },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
        >
          {/* IMAGE */}
          <div className="relative h-52 bg-[#0d0d0d] overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.06)_0%,_transparent_70%)]" />
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.9)] p-6" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-full opacity-20">
                  <ImageOff size={32} className="text-zinc-400" />
                </div>
              )}
            </motion.div>

            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none">
                  <Zap size={9} strokeWidth={3} />Nuevo
                </span>
              )}
              {product.isFeatured && (
                <span className="flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none border border-zinc-700">
                  <Star size={9} strokeWidth={3} />Destacado
                </span>
              )}
            </div>

            <motion.div
              variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-3 right-3 z-10"
            >
              <span className="flex items-center gap-1.5 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md leading-none shadow-lg">
                Ver detalles <ArrowRight size={10} strokeWidth={3} />
              </span>
            </motion.div>
          </div>

          {/* INFO */}
          <div className="flex flex-col flex-1 p-5 gap-2">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{product.brand.name}</p>
            <h3 className="text-white font-black uppercase text-sm leading-snug tracking-wide line-clamp-2 flex-1">{product.name}</h3>
            <div className="w-full h-px bg-zinc-800 mt-1" />
            <div className="flex items-end justify-between mt-1">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Precio</p>
                {product.showPrice ? (
                  <p className="text-yellow-500 font-black text-lg leading-none">{formatARS(product.price)}</p>
                ) : (
                  <p className="text-zinc-500 font-black text-sm uppercase tracking-widest leading-none">Consultar</p>
                )}
              </div>
              <p className="text-zinc-700 text-[9px] uppercase tracking-widest font-mono">{product.sku}</p>
            </div>
          </div>

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
