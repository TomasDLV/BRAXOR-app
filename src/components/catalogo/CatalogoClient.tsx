"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Zap, Star, ArrowRight, ImageOff, LayoutGrid,
  SlidersHorizontal, X, Car, ChevronDown,
} from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";

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
  vehicleIds: string[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  imageUrl: string | null;
  icon: string | null;
}

export interface CatalogBrand {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface CatalogVehicle {
  id: string;
  make: string;
  model: string;
  yearStart: number | null;
  yearEnd: number | null;
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Vehicle filter section ───────────────────────────────────────────────────

function VehicleFilter({
  vehicles,
  activeVehicle,
  onSelect,
  variant = "desktop",
}: {
  vehicles: CatalogVehicle[];
  activeVehicle: string | null;
  onSelect: (id: string | null) => void;
  variant?: "desktop" | "mobile";
}) {
  const [openMakes, setOpenMakes] = useState<Record<string, boolean>>({});
  const [vehicleSearch, setVehicleSearch] = useState("");

  const grouped = useMemo(() => {
    const q = vehicleSearch.toLowerCase();
    const filtered = q
      ? vehicles.filter(
          (v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
        )
      : vehicles;
    return Object.entries(
      filtered.reduce<Record<string, CatalogVehicle[]>>((acc, v) => {
        (acc[v.make] ??= []).push(v);
        return acc;
      }, {})
    ).sort(([a], [b]) => a.localeCompare(b));
  }, [vehicles, vehicleSearch]);

  const toggleMake = (make: string) =>
    setOpenMakes((prev) => ({ ...prev, [make]: !prev[make] }));

  if (vehicles.length === 0) return null;

  const isMobile = variant === "mobile";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
        Mi Vehículo
      </p>

      {vehicles.length > 6 && (
        <div className="relative mb-1">
          <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <input
            type="text"
            value={vehicleSearch}
            onChange={(e) => setVehicleSearch(e.target.value)}
            placeholder="Buscar modelo..."
            className="w-full bg-white/5 border border-white/10 text-white text-xs pl-7 pr-3 py-2 rounded-xl focus:outline-none focus:border-yellow-500/30 placeholder-zinc-600 transition-colors"
          />
        </div>
      )}

      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
          isMobile ? "px-4" : ""
        } ${
          activeVehicle === null
            ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
            : "bg-white/[0.02] border border-white/[0.05] text-zinc-500 hover:text-white hover:bg-white/5"
        }`}
      >
        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
          <Car size={12} className="text-zinc-400" />
        </div>
        Todos
      </button>

      <div className="flex flex-col gap-0.5">
        {grouped.map(([make, makeVehicles]) => {
          const isOpen = openMakes[make] ?? false;
          const hasMakeActive = makeVehicles.some((v) => v.id === activeVehicle);

          return (
            <div key={make}>
              <button
                onClick={() => toggleMake(make)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${
                  hasMakeActive
                    ? "text-yellow-400"
                    : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                }`}
              >
                <span>{make}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isOpen || hasMakeActive ? "rotate-180" : ""}`}
                />
              </button>

              {(isOpen || hasMakeActive) && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3 mb-1">
                  {makeVehicles.map((v) => {
                    const isActive = activeVehicle === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => onSelect(isActive ? null : v.id)}
                        className={`flex items-center justify-between px-2 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                          isActive
                            ? "bg-white/10 text-yellow-400"
                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{v.model}</span>
                        {(v.yearStart || v.yearEnd) && (
                          <span className="text-zinc-700 font-mono text-[10px] flex-shrink-0 ml-2">
                            {v.yearStart ?? "?"}–{v.yearEnd ?? "hoy"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CatalogoClient({
  products,
  categories,
  brands,
  vehicles,
  initialCategory = "Todos",
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  vehicles: CatalogVehicle[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<string | null>(null);
  const [filterNew, setFilterNew] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = activeCategory === "Todos" || p.category.name === activeCategory;
      const matchBrand = !activeBrand || p.brand.name === activeBrand;
      const matchVehicle = !activeVehicle || p.vehicleIds.includes(activeVehicle);
      const matchNew = !filterNew || p.isNew;
      const matchFeatured = !filterFeatured || p.isFeatured;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchCat && matchBrand && matchVehicle && matchNew && matchFeatured && matchQuery;
    });
  }, [query, activeCategory, activeBrand, activeVehicle, filterNew, filterFeatured, products]);

  const activeFiltersCount = [
    activeCategory !== "Todos",
    activeBrand !== null,
    activeVehicle !== null,
    filterNew,
    filterFeatured,
  ].filter(Boolean).length;

  function clearFilters() {
    setQuery("");
    setActiveCategory("Todos");
    setActiveBrand(null);
    setActiveVehicle(null);
    setFilterNew(false);
    setFilterFeatured(false);
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">

      {/* Fondo inmersivo */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/images/taller.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-10"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="background-overlay absolute inset-0" />
      </div>

      {/* ── HEADER ── */}
      <section className="relative w-full pt-16 pb-12 px-4 overflow-hidden border-b border-white/[0.06]">
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
      <div className="lg:hidden sticky top-[72px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-yellow-500/30 placeholder-zinc-600 transition-colors"
            />
          </div>
          <button
            onClick={() => setBottomSheetOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex-shrink-0 ${
              activeFiltersCount > 0
                ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
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

        {/* ── DESKTOP SIDEBAR (Glass Panel) ── */}
        <aside className="hidden lg:flex sticky top-24 w-64 xl:w-72 flex-shrink-0">
          <div className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6">

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/30 placeholder-zinc-600 transition-colors"
              />
            </div>

            {/* Filtrar por */}
            <div className="flex flex-col gap-2">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Filtrar por</p>
              <button
                onClick={() => setFilterNew((v) => !v)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  filterNew
                    ? "bg-yellow-500/15 border border-yellow-500/50 text-yellow-400"
                    : "bg-white/[0.03] border border-white/[0.07] text-zinc-500 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Zap size={12} strokeWidth={3} />
                Nuevo
              </button>
              <button
                onClick={() => setFilterFeatured((v) => !v)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  filterFeatured
                    ? "bg-white/10 border border-white/20 text-zinc-200"
                    : "bg-white/[0.03] border border-white/[0.07] text-zinc-500 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Star size={12} strokeWidth={3} />
                Destacado
              </button>
            </div>

            <div className="h-px bg-white/[0.08]" />

            {/* Categorías */}
            <div className="flex flex-col gap-1.5">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Categorías</p>
              <button
                onClick={() => setActiveCategory("Todos")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                  activeCategory === "Todos"
                    ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid size={12} className="text-zinc-400" />
                </div>
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                    activeCategory === cat.name
                      ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
                      : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {cat.icon ? (
                      <CategoryIcon
                        name={cat.icon}
                        size={13}
                        className={activeCategory === cat.name ? "text-yellow-400" : "text-zinc-500"}
                      />
                    ) : cat.imageUrl ? (
                      <Image src={cat.imageUrl} alt={cat.name} width={28} height={28} className="object-contain p-1" unoptimized />
                    ) : (
                      <span className="text-zinc-500 text-[9px] font-black">{cat.name[0]}</span>
                    )}
                  </div>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Vehículos */}
            {vehicles.length > 0 && (
              <>
                <div className="h-px bg-white/[0.08]" />
                <VehicleFilter
                  vehicles={vehicles}
                  activeVehicle={activeVehicle}
                  onSelect={setActiveVehicle}
                  variant="desktop"
                />
              </>
            )}

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
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* ── MARCAS — círculos glass ── */}
          {brands.length > 0 && (
            <section>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Marcas</p>
              <div
                className="flex flex-row gap-5 overflow-x-auto pb-2"
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
                      className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden relative transition-all duration-200 hover:-translate-y-1 ${
                        activeBrand === brand.name
                          ? "bg-yellow-500/10 border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {brand.logoUrl ? (
                        <Image src={brand.logoUrl} alt={brand.name} width={64} height={64} className="object-contain p-3" unoptimized />
                      ) : (
                        <span className={`text-xs font-black uppercase tracking-tight ${activeBrand === brand.name ? "text-yellow-400" : "text-zinc-500"}`}>
                          {brand.name.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wider leading-none transition-colors whitespace-nowrap ${activeBrand === brand.name ? "text-yellow-400" : "text-zinc-400"}`}>
                      {brand.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="h-px bg-white/[0.06] mt-5" />
            </section>
          )}

          {/* Contador */}
          <motion.p layout className="text-zinc-600 text-xs uppercase tracking-widest font-medium -mb-4">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </motion.p>

          {/* ── GRID ── */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBottomSheetOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#111]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl flex flex-col"
              style={{ maxHeight: "85vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-5 pt-2 pb-4 flex-shrink-0">
                <span className="text-white font-black uppercase tracking-widest text-sm">Filtros</span>
                <button onClick={() => setBottomSheetOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Estado</p>
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setFilterNew((v) => !v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                      filterNew
                        ? "bg-yellow-500/15 border border-yellow-500/50 text-yellow-400"
                        : "bg-white/5 border border-white/10 text-zinc-500"
                    }`}
                  >
                    <Zap size={12} strokeWidth={3} />
                    Nuevo
                  </button>
                  <button
                    onClick={() => setFilterFeatured((v) => !v)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                      filterFeatured
                        ? "bg-white/10 border border-white/20 text-zinc-200"
                        : "bg-white/5 border border-white/10 text-zinc-500"
                    }`}
                  >
                    <Star size={12} strokeWidth={3} />
                    Destacado
                  </button>
                </div>

                {vehicles.length > 0 && (
                  <div className="mb-6">
                    <VehicleFilter
                      vehicles={vehicles}
                      activeVehicle={activeVehicle}
                      onSelect={(id) => { setActiveVehicle(id); }}
                      variant="mobile"
                    />
                  </div>
                )}

                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Categorías</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveCategory("Todos")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                      activeCategory === "Todos"
                        ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
                        : "bg-white/5 border border-white/[0.07] text-zinc-400"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <LayoutGrid size={12} className="text-zinc-400" />
                    </div>
                    Todos
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                        activeCategory === cat.name
                          ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
                          : "bg-white/5 border border-white/[0.07] text-zinc-400"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {cat.icon ? (
                          <CategoryIcon
                            name={cat.icon}
                            size={13}
                            className={activeCategory === cat.name ? "text-yellow-400" : "text-zinc-500"}
                          />
                        ) : cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} width={28} height={28} className="object-contain p-1" unoptimized />
                        ) : (
                          <span className="text-zinc-500 text-[9px] font-black">{cat.name[0]}</span>
                        )}
                      </div>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 px-5 py-4 border-t border-white/[0.08] flex-shrink-0">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:border-red-500/40 hover:text-red-400 transition-colors"
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
      className="group"
    >
      <Link href={`/catalogo/${product.id}`}>
        <article className="relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 flex flex-col hover:bg-white/[0.06] transition-all hover:border-white/[0.15] overflow-hidden cursor-pointer h-full hover:-translate-y-1 duration-300">

          {/* IMAGE AREA */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0d0d0d] flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.06)_0%,_transparent_70%)]" />

            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full opacity-20">
                <ImageOff size={32} className="text-zinc-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none shadow-[0_0_16px_rgba(234,179,8,0.5)]">
                  <Zap size={9} strokeWidth={3} />Nuevo
                </span>
              )}
              {product.isFeatured && (
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none">
                  <Star size={9} strokeWidth={3} />Destacado
                </span>
              )}
            </div>
          </div>

          {/* BODY */}
          <div className="flex flex-col flex-1 mt-4 gap-1">
            <p className="text-xs text-zinc-500 uppercase font-semibold tracking-widest">
              {product.brand.name} · {product.category.name}
            </p>
            <h3 className="text-lg text-white font-bold leading-tight mt-1 line-clamp-2 flex-1">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-4">
              {product.showPrice ? (
                <p className="text-xl text-yellow-500 font-black leading-none">
                  {formatARS(product.price)}
                </p>
              ) : (
                <p className="text-base text-zinc-500 font-black uppercase tracking-widest leading-none">
                  Consultar precio
                </p>
              )}
            </div>
          </div>

          {/* VER DETALLES button */}
          <div className="mt-4 flex items-center justify-between w-full bg-transparent border border-white/10 group-hover:border-yellow-500/70 text-zinc-300 group-hover:text-white rounded-xl py-2 px-4 transition-all text-sm uppercase tracking-widest font-semibold">
            <span>Ver detalles</span>
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </article>
      </Link>
    </motion.div>
  );
}
