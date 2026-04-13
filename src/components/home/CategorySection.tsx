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
      initial={{ opacity: 0, y: 32, scale: 0.95, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={VP}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={category.href}
        className="glass-card relative overflow-hidden group aspect-[16/9] md:aspect-[4/3] block"
      >
        {/* Full-bleed image */}
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02]">
            <Tag size={64} className="text-zinc-700" strokeWidth={1} />
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />

        {/* Hover yellow border glow */}
        <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
          style={{ boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.5)" }}
        />

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-white/10 z-20 group-hover:border-yellow-500/60 transition-colors duration-300" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/10 z-20 group-hover:border-yellow-500/60 transition-colors duration-300" />

        {/* Text layer */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
          <div /> {/* spacer — keeps title pushed toward bottom */}
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-tight drop-shadow-lg" style={{ fontWeight: 600 }}>
              {category.name}
            </h3>
            <span className="flex items-center gap-2 text-yellow-500 text-sm font-bold tracking-widest group-hover:text-yellow-400 transition-colors">
              Ver productos
              <ArrowRight size={13} strokeWidth={3} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </div>
        </div>
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
