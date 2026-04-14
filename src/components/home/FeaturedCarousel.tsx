"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ImageOff, Zap, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface FeaturedProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  showPrice: boolean;
  isNew: boolean;
  brand: { name: string };
  category: { name: string };
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const VP = { once: true, margin: "-60px" };

export default function FeaturedCarousel({ products }: { products: FeaturedProduct[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (products.length === 0) return null;

  // Duplicate for seamless loop feel
  const items = products.length < 3 ? [...products, ...products, ...products] : products;
  const total = items.length;

  const goTo = useCallback((idx: number) => {
    const clamped = (idx + total) % total;
    setActive(clamped);
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[clamped] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetWidth / 2 + card.offsetWidth / 2, behavior: "smooth" });
    }
  }, [total]);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!paused) setActive((prev) => {
        const next = (prev + 1) % total;
        goTo(next);
        return next;
      });
    }, 3500);
  }, [paused, total, goTo]);

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAuto]);

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      {/* Subtle yellow glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 flex items-end justify-between"
      >
        <div>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            — Selección Premium
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Destacados
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setPaused(true); goTo(active - 1); }}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-yellow-500/40 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => { setPaused(true); goTo(active + 1); }}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-yellow-500/40 transition-all cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
          <Link
            href="/catalogo"
            className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-yellow-500 text-xs font-black uppercase tracking-widest transition-colors group ml-1"
          >
            Ver todo
            <ArrowRight size={13} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {items.map((product, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={`${product.id}-${i}`}
              animate={{ opacity: 1, scale: isActive ? 1 : 0.96 }}
              transition={{ duration: 0.4 }}
              className="flex-shrink-0 snap-center w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[38vw] max-w-[560px]"
            >
              <Link href={`/catalogo/${product.id}`}>
                <article className="group relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.18] transition-all duration-300 flex flex-col">

                  {/* Image — tall */}
                  <div className="relative h-[52vw] sm:h-[36vw] md:h-[28vw] lg:h-[24vw] max-h-[380px] min-h-[200px] bg-[#0d0d0d] overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.07)_0%,_transparent_70%)]" />

                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full opacity-20">
                        <ImageOff size={40} className="text-zinc-400" />
                      </div>
                    )}


                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-yellow-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none border border-yellow-500/30">
                        <Star size={8} strokeWidth={3} />Destacado
                      </span>
                      {product.isNew && (
                        <span className="flex items-center gap-1 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md leading-none">
                          <Zap size={8} strokeWidth={3} />Nuevo
                        </span>
                      )}
                    </div>

                    {/* Active indicator */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </div>

                  {/* Info */}
                  <div className="p-5 md:p-6 flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-xs text-zinc-500 uppercase font-semibold tracking-widest truncate">
                        {product.brand.name} · {product.category.name}
                      </p>
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                      {product.showPrice && product.price ? (
                        <p className="text-yellow-500 font-black text-2xl leading-none mt-1">
                          {formatARS(product.price)}
                        </p>
                      ) : (
                        <p className="text-zinc-500 font-black text-sm uppercase tracking-widest leading-none mt-1">
                          Consultar precio
                        </p>
                      )}
                    </div>

                    <span className="flex-shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 group-hover:border-yellow-500/50 group-hover:text-yellow-500 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all whitespace-nowrap">
                      Ver más <ArrowRight size={11} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPaused(true); goTo(i); }}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === (active % products.length)
                ? "w-6 h-1.5 bg-yellow-500"
                : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent pointer-events-none" />
    </section>
  );
}
