"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Tag } from "lucide-react";

const VP = { once: true, margin: "-80px" };

export interface HomeCategory {
  id: string;
  name: string;
  imageUrl: string | null;
  href: string;
}

interface CategoryPlateProps {
  category: HomeCategory;
  index: number;
}

function CategoryPlate({ category, index }: CategoryPlateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={category.href}>
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="relative h-64 md:h-72 rounded-2xl overflow-hidden cursor-pointer group"
          style={{
            background: "linear-gradient(135deg, #1c1c1c 0%, #0f0f0f 60%, #141414 100%)",
          }}
        >
          {/* Metal border — animated yellow on hover */}
          <motion.div
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl pointer-events-none z-30"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.55), 0 0 40px rgba(234,179,8,0.12)",
            }}
          />

          {/* Base border */}
          <div className="absolute inset-0 rounded-2xl border border-zinc-800 pointer-events-none z-20" />

          {/* Inner shine */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />

          {/* Radial glow */}
          <motion.div
            variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
            className="absolute -bottom-12 -right-12 w-52 h-52 bg-yellow-500/[0.07] rounded-full blur-3xl pointer-events-none z-10"
          />

          {/* Imagen de categoría */}
          {category.imageUrl ? (
            <motion.div
              variants={{ rest: { scale: 1, x: 0 }, hover: { scale: 1.1, x: -4 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-4 -right-4 w-52 h-52 md:w-64 md:h-64 z-10"
            >
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
                unoptimized
              />
            </motion.div>
          ) : (
            /* Placeholder cuando no hay imagen */
            <motion.div
              variants={{ rest: { scale: 1, opacity: 0.15 }, hover: { scale: 1.05, opacity: 0.25 } }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-4 -right-4 w-52 h-52 md:w-64 md:h-64 z-10 flex items-center justify-center"
            >
              <Tag size={80} className="text-yellow-500" strokeWidth={1} />
            </motion.div>
          )}

          {/* Text */}
          <div className="relative z-20 p-7 flex flex-col gap-2 h-full">
            <h3 className="text-2xl md:text-3xl font-black uppercase text-white leading-tight tracking-tight w-[55%] drop-shadow-lg">
              {category.name}
            </h3>

            <motion.div
              variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.22 }}
              className="absolute bottom-6 left-7 flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest"
            >
              Ver productos
              <ArrowRight size={11} strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CategorySection({ categories }: { categories: HomeCategory[] }) {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Concrete texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.65 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
              — Catálogo
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Categorías
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 text-xs font-black uppercase tracking-widest transition-colors group self-start md:self-auto"
          >
            Ver todo el catálogo
            <ArrowRight size={13} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid o empty state */}
        {categories.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            className="text-zinc-700 text-sm uppercase tracking-widest font-bold text-center py-16"
          >
            No hay categorías publicadas aún.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {categories.map((cat, i) => (
              <CategoryPlate key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
