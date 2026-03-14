"use client";

import { motion } from "framer-motion";

const VP = { once: true, margin: "-80px" };

export interface HomeBrand {
  id: string;
  name: string;
}

export default function BrandsStrip({ brands }: { brands: HomeBrand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="relative w-full bg-[#080808] border-y border-zinc-900 py-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          className="text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-black text-center mb-8"
        >
          Marcas Oficiales
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-14"
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {brands.map((brand) => (
            <motion.span
              key={brand.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ color: "#eab308", scale: 1.1, y: -2 }}
              className="text-zinc-600 font-black uppercase tracking-widest text-xs md:text-sm cursor-default transition-colors"
            >
              {brand.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
