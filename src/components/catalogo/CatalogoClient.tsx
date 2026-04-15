"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Zap, Star, ArrowRight, ImageOff, LayoutGrid,
  SlidersHorizontal, X, Car, ChevronDown, Loader2,
} from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import AddToCartButton from "@/components/cart/AddToCartButton";

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

export interface CatalogFilters {
  categoria: string;
  brand: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: string | null;
  isNew: boolean;
  isFeatured: boolean;
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Vehicle Cascade Filter ───────────────────────────────────────────────────

function VehicleCascadeFilter({
  vehicles,
  make,
  model,
  year,
  onChange,
}: {
  vehicles: CatalogVehicle[];
  make: string | null;
  model: string | null;
  year: string | null;
  onChange: (make: string | null, model: string | null, year: string | null) => void;
}) {
  const allMakes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make))].sort(),
    [vehicles]
  );

  const modelsForMake = useMemo(
    () =>
      make
        ? [...new Set(
            vehicles
              .filter((v) => v.make.toLowerCase() === make.toLowerCase())
              .map((v) => v.model)
          )].sort()
        : [],
    [vehicles, make]
  );

  const activeVehicle = useMemo(
    () =>
      make && model
        ? (vehicles.find(
            (v) =>
              v.make.toLowerCase() === make.toLowerCase() &&
              v.model.toLowerCase() === model.toLowerCase()
          ) ?? null)
        : null,
    [vehicles, make, model]
  );

  // Local state for year input — only push to URL on blur/Enter
  const [localYear, setLocalYear] = useState(year ?? "");
  useEffect(() => { setLocalYear(year ?? ""); }, [year]);

  function commitYear(value: string) {
    const trimmed = value.trim();
    if (trimmed === (year ?? "")) return; // no change
    onChange(make, model, trimmed || null);
  }

  const hasAnyFilter = make || model || year || localYear;

  const selectClass = (disabled: boolean) =>
    `w-full bg-white/[0.04] border text-sm px-3 py-2.5 rounded-xl focus:outline-none transition-all appearance-none cursor-pointer ${
      disabled
        ? "border-white/[0.04] text-zinc-700 cursor-not-allowed opacity-50"
        : "border-white/10 text-white hover:border-white/20 focus:border-yellow-500/40"
    }`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Car size={10} strokeWidth={2.5} />
          Mi Vehículo
        </p>
        {hasAnyFilter && (
          <button
            onClick={() => onChange(null, null, null)}
            className="text-zinc-700 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1"
          >
            <X size={9} strokeWidth={2.5} />
            Limpiar
          </button>
        )}
      </div>

      {/* Marca */}
      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
          Marca
        </label>
        <div className="relative">
          <select
            value={make ?? ""}
            onChange={(e) => onChange(e.target.value || null, null, null)}
            className={selectClass(false)}
          >
            <option value="" className="bg-[#1a1a1a] text-zinc-500">
              — Seleccionar —
            </option>
            {allMakes.map((m) => (
              <option key={m} value={m} className="bg-[#1a1a1a] text-white">
                {m}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Modelo */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${
            make ? "text-zinc-600" : "text-zinc-800"
          }`}
        >
          Modelo
        </label>
        <div className="relative">
          <select
            value={model ?? ""}
            disabled={!make}
            onChange={(e) => onChange(make, e.target.value || null, null)}
            className={selectClass(!make)}
          >
            <option value="" className="bg-[#1a1a1a] text-zinc-500">
              — Seleccionar —
            </option>
            {modelsForMake.map((m) => (
              <option key={m} value={m} className="bg-[#1a1a1a] text-white">
                {m}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Año */}
      <div className="flex flex-col gap-1.5">
        <label
          className={`text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 ${
            model ? "text-zinc-600" : "text-zinc-800"
          }`}
        >
          Año
          {activeVehicle && (activeVehicle.yearStart || activeVehicle.yearEnd) && (
            <span className="text-zinc-700 normal-case tracking-normal font-normal font-mono text-[9px]">
              ({activeVehicle.yearStart ?? "?"}–{activeVehicle.yearEnd ?? "hoy"})
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="number"
            disabled={!model}
            value={localYear}
            onChange={(e) => setLocalYear(e.target.value)}
            onBlur={(e) => commitYear(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
            placeholder={
              activeVehicle
                ? `${activeVehicle.yearStart ?? "?"}–${activeVehicle.yearEnd ?? "hoy"}`
                : "Ej: 2018"
            }
            min={activeVehicle?.yearStart ?? 1990}
            max={activeVehicle?.yearEnd ?? new Date().getFullYear()}
            className={`w-full bg-white/[0.04] border text-sm px-3 py-2.5 rounded-xl focus:outline-none transition-all placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-8 ${
              !model
                ? "border-white/[0.04] text-zinc-700 cursor-not-allowed opacity-50"
                : "border-white/10 text-white hover:border-white/20 focus:border-yellow-500/40"
            }`}
          />
          {(year || localYear) && (
            <button
              onClick={() => { setLocalYear(""); onChange(make, model, null); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors cursor-pointer"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>
        {year && (
          <p className="text-[10px] text-zinc-700">
            Compatibles con{" "}
            <span className="text-yellow-500 font-bold">
              {make} {model} {year}
            </span>
          </p>
        )}
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
  initialFilters,
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  brands: CatalogBrand[];
  vehicles: CatalogVehicle[];
  initialFilters: CatalogFilters;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Text search — client-side only (instant, no roundtrip)
  const [query, setQuery] = useState("");
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // Destructure current filter state from server props
  const {
    categoria,
    brand,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    isNew,
    isFeatured,
  } = initialFilters;

  // ── URL navigation helper ──────────────────────────────────────────────────

  function pushFilters(overrides: Partial<CatalogFilters>) {
    const next: CatalogFilters = { ...initialFilters, ...overrides };
    const params = new URLSearchParams();

    if (next.categoria && next.categoria !== "Todos")
      params.set("categoria", next.categoria);
    if (next.brand) params.set("brand", next.brand);
    if (next.vehicleMake) params.set("vehicleMake", next.vehicleMake);
    if (next.vehicleModel) params.set("vehicleModel", next.vehicleModel);
    if (next.vehicleYear) params.set("vehicleYear", next.vehicleYear);
    if (next.isNew) params.set("isNew", "true");
    if (next.isFeatured) params.set("isFeatured", "true");

    const qs = params.toString();
    startTransition(() => {
      router.replace(`/catalogo${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  function clearFilters() {
    setQuery("");
    startTransition(() => {
      router.replace("/catalogo", { scroll: false });
    });
  }

  // ── Client-side text search on top of server-filtered products ─────────────

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, query]);

  // ── Active filter count (for badges) ──────────────────────────────────────

  const activeFiltersCount = [
    categoria !== "Todos",
    brand !== null,
    vehicleMake !== null,
    isNew,
    isFeatured,
  ].filter(Boolean).length;

  // ── Sidebar sections (reused in desktop + mobile) ─────────────────────────

  function SidebarContent() {
    return (
      <>
        {/* Filtrar por */}
        <div className="flex flex-col gap-2">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Filtrar por
          </p>
          <button
            onClick={() => pushFilters({ isNew: !isNew })}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              isNew
                ? "bg-yellow-500/15 border border-yellow-500/50 text-yellow-400"
                : "bg-white/[0.03] border border-white/[0.07] text-zinc-500 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Zap size={12} strokeWidth={3} />
            Nuevo
          </button>
          <button
            onClick={() => pushFilters({ isFeatured: !isFeatured })}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              isFeatured
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
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
            Categorías
          </p>
          <button
            onClick={() => pushFilters({ categoria: "Todos" })}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
              categoria === "Todos"
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
              onClick={() => pushFilters({ categoria: cat.name })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                categoria === cat.name
                  ? "bg-white/10 border border-yellow-500/50 text-yellow-400"
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {cat.icon ? (
                  <CategoryIcon
                    name={cat.icon}
                    size={13}
                    className={
                      categoria === cat.name ? "text-yellow-400" : "text-zinc-500"
                    }
                  />
                ) : cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={28}
                    height={28}
                    className="object-contain p-1"
                    unoptimized
                  />
                ) : (
                  <span className="text-zinc-500 text-[9px] font-black">
                    {cat.name[0]}
                  </span>
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
            <VehicleCascadeFilter
              vehicles={vehicles}
              make={vehicleMake}
              model={vehicleModel}
              year={vehicleYear}
              onChange={(m, mo, y) =>
                pushFilters({ vehicleMake: m, vehicleModel: mo, vehicleYear: y })
              }
            />
          </>
        )}

        {/* Clear all */}
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
              Limpiar todos los filtros
            </motion.button>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <main
      className="relative min-h-screen bg-[#0a0a0a]"
      style={{
        backgroundImage: "url('/images/fondo-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-[#0a0a0a]/50 pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <section className="relative z-10 w-full pt-16 pb-12 px-4 overflow-hidden border-b border-white/[0.06]">
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
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
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
            {isPending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <SlidersHorizontal size={13} strokeWidth={2.5} />
            )}
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8 items-start">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:flex sticky top-24 w-64 xl:w-72 flex-shrink-0">
          <div className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/30 placeholder-zinc-600 transition-colors"
              />
            </div>

            {/* Loading indicator */}
            {isPending && (
              <div className="flex items-center gap-2 text-zinc-600 text-[10px] uppercase tracking-widest -mt-2">
                <Loader2 size={10} className="animate-spin" />
                Actualizando...
              </div>
            )}

            <SidebarContent />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div
          className={`flex-1 min-w-0 flex flex-col gap-8 transition-opacity duration-200 ${
            isPending ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {/* Marcas */}
          {brands.length > 0 && (
            <section>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                Marcas
              </p>
              <div
                className="flex flex-row gap-5 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {brands.map((b) => (
                  <motion.button
                    key={b.id}
                    onClick={() =>
                      pushFilters({ brand: brand === b.name ? null : b.name })
                    }
                    whileTap={{ scale: 0.93 }}
                    className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden relative transition-all duration-200 hover:-translate-y-1 ${
                        brand === b.name
                          ? "bg-yellow-500/10 border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {b.logoUrl ? (
                        <Image
                          src={b.logoUrl}
                          alt={b.name}
                          width={64}
                          height={64}
                          className="object-contain p-3"
                          unoptimized
                        />
                      ) : (
                        <span
                          className={`text-xs font-black uppercase tracking-tight ${
                            brand === b.name ? "text-yellow-400" : "text-zinc-500"
                          }`}
                        >
                          {b.name.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium uppercase tracking-wider leading-none transition-colors whitespace-nowrap ${
                        brand === b.name ? "text-yellow-400" : "text-zinc-400"
                      }`}
                    >
                      {b.name}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="h-px bg-white/[0.06] mt-5" />
            </section>
          )}

          {/* Active vehicle filter pill */}
          {vehicleMake && vehicleModel && (
            <div className="flex items-center gap-2 flex-wrap -mb-4">
              <span className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full">
                <Car size={11} strokeWidth={2.5} />
                {vehicleMake} {vehicleModel}
                {vehicleYear && <span className="opacity-70">· {vehicleYear}</span>}
                <button
                  onClick={() =>
                    pushFilters({ vehicleMake: null, vehicleModel: null, vehicleYear: null })
                  }
                  className="ml-1 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </span>
            </div>
          )}

          {/* Contador */}
          <motion.p
            layout
            className="text-zinc-600 text-xs uppercase tracking-widest font-medium -mb-4"
          >
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
            encontrado{filtered.length !== 1 ? "s" : ""}
          </motion.p>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
                      : "Sin resultados para este filtro"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-yellow-500 text-xs uppercase tracking-widest font-bold hover:text-yellow-400 transition-colors cursor-pointer"
                    >
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
                <span className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  Filtros
                  {isPending && <Loader2 size={12} className="animate-spin text-yellow-500" />}
                </span>
                <button
                  onClick={() => setBottomSheetOpen(false)}
                  className="text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-6">
                <SidebarContent />
              </div>

              <div className="flex gap-3 px-5 py-4 border-t border-white/[0.08] flex-shrink-0">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => { clearFilters(); setBottomSheetOpen(false); }}
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
          {/* IMAGE */}
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
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="flex items-center gap-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none shadow-[0_0_16px_rgba(234,179,8,0.5)]">
                  <Zap size={9} strokeWidth={3} />
                  Nuevo
                </span>
              )}
              {product.isFeatured && (
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none">
                  <Star size={9} strokeWidth={3} />
                  Destacado
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

          {/* ACTIONS */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex items-center justify-between bg-transparent border border-white/10 group-hover:border-yellow-500/70 text-zinc-300 group-hover:text-white rounded-xl py-2 px-4 transition-all text-sm uppercase tracking-widest font-semibold">
              <span>Ver detalles</span>
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </div>
            <AddToCartButton
              variant="icon"
              product={{
                id: product.id,
                name: product.name,
                brand: product.brand.name,
                category: product.category.name,
                price: product.showPrice ? product.price : null,
                showPrice: product.showPrice,
                imageUrl: product.imageUrl,
                sku: product.sku,
              }}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </article>
      </Link>
    </motion.div>
  );
}
