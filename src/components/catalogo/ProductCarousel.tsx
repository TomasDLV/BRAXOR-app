"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff, Zap, Star } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
  isNew: boolean;
  isFeatured: boolean;
}

export default function ProductCarousel({ images, productName, isNew, isFeatured }: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const prev = () => go(active === 0 ? images.length - 1 : active - 1);
  const next = () => go(active === images.length - 1 ? 0 : active + 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="relative flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-[#111] border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.6)]">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,179,8,0.07)_0%,_transparent_65%)] pointer-events-none z-10" />

        {images.length > 0 ? (
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${productName} — foto ${active + 1}`}
                fill
                className="object-cover"
                priority={active === 0}
                              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center gap-4 justify-center h-full opacity-20">
            <ImageOff size={64} className="text-zinc-400" />
            <span className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Sin imagen</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {isNew && (
            <span className="flex items-center gap-1.5 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              <Zap size={11} strokeWidth={3} />Nuevo
            </span>
          )}
          {isFeatured && (
            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
              <Star size={11} strokeWidth={3} />Destacado
            </span>
          )}
        </div>

        {/* Nav arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all duration-200 cursor-pointer ${
                    i === active
                      ? "w-5 h-1.5 bg-yellow-500"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                i === active
                  ? "border-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.4)]"
                  : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/30"
              }`}
            >
              <Image src={url} alt={`Miniatura ${i + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
