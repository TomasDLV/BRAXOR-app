"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Zap } from "lucide-react";

// ─── Brand Data ───────────────────────────────────────────────────────────────

const BRANDS = [
  {
    name: "BFGoodrich",
    tagline: "Domination since 1870.",
    description:
      "Neumáticos de competición y uso extremo. Los mismos que corren el Baja 1000 y el Dakar. BFGoodrich define el estándar en tracción off-road con su línea All-Terrain T/A KO2 y Mud-Terrain T/A KM3.",
    accent: "#eab308",
    tags: ["All-Terrain", "Mud-Terrain", "Baja 1000", "Dakar"],
    imagePlaceholder: "Imagen de Acción BFGoodrich",
    logoPlaceholder: "Logo BFGoodrich",
  },
  {
    name: "Baratec",
    tagline: "Ingeniería para el terreno argentino.",
    description:
      "Especialistas en barras LED, estribos tubulares y accesorios de protección diseñados y manufacturados para las exigencias únicas de las rutas y pistas de Sudamérica.",
    accent: "#eab308",
    tags: ["Barras LED", "Estribos", "Protección", "Nacional"],
    imagePlaceholder: "Imagen de Producto Baratec",
    logoPlaceholder: "Logo Baratec",
  },
  {
    name: "Rhino",
    tagline: "Built for the wild.",
    description:
      "Defensas, racks y sistemas de protección de carrocería con la resistencia de un rinoceronte. Acero de alta resistencia, acabados anticorrosión y diseño funcional que no sacrifica estética.",
    accent: "#eab308",
    tags: ["Defensas", "Bull Bars", "Racks", "Steel"],
    imagePlaceholder: "Imagen de Defensa Rhino",
    logoPlaceholder: "Logo Rhino",
  },
  {
    name: "Method Race Wheels",
    tagline: "Race-proven. Road-ready.",
    description:
      "Llantas forjadas en el circuito de competición y transferidas a la calle. El favorito de los pilotos del Ultra4 y del SCORE. Cada diseño nace en la pista, no en un escritorio.",
    accent: "#eab308",
    tags: ["Forged", "Ultra4", "SCORE", "Race"],
    imagePlaceholder: "Imagen de Llanta Method",
    logoPlaceholder: "Logo Method Race Wheels",
  },
  {
    name: "Warn",
    tagline: "Recovery. Always.",
    description:
      "El líder global en winches y equipos de recuperación. Desde el legendario 9.5XP hasta los sistemas de iluminación Trail Series. Warn es el seguro de vida de tu vehículo en el campo.",
    accent: "#eab308",
    tags: ["Winches", "Recuperación", "Iluminación", "Legend"],
    imagePlaceholder: "Imagen de Winch Warn",
    logoPlaceholder: "Logo Warn",
  },
  {
    name: "ARB",
    tagline: "The off-road authority.",
    description:
      "Desde Old Man Emu hasta los air lockers, ARB tiene décadas fabricando el equipamiento de referencia para expediciones y aventura extrema. Ingeniería australiana probada en los terrenos más duros del mundo.",
    accent: "#eab308",
    tags: ["Old Man Emu", "Air Lockers", "Expedición", "Australia"],
    imagePlaceholder: "Imagen de Producto ARB",
    logoPlaceholder: "Logo ARB",
  },
];

// ─── Animation Helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const VIEWPORT = { once: true, margin: "-80px" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarcasPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden border-b border-zinc-900">
        {/* Carbon texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px),repeating-linear-gradient(-45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px)`,
          }}
        />
        {/* Yellow glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/8 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl"
        >
          <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.4em] mb-6">
            — Partners Oficiales
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-2xl">
            Marcas
            <br />
            <span className="text-zinc-700">Oficiales</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Trabajamos exclusivamente con la élite del equipamiento Off-Road global.
            Cada marca fue seleccionada por su desempeño comprobado en los terrenos más extremos del planeta.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-zinc-700 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── BRAND SECTIONS (alternating) ── */}
      {BRANDS.map((brand, i) => {
        const isEven = i % 2 === 0;
        return (
          <BrandSection key={brand.name} brand={brand} imageLeft={isEven} index={i} />
        );
      })}

      {/* ── CTA FOOTER ── */}
      <section className="relative py-24 px-4 border-t border-zinc-900 bg-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.05)_0%,transparent_65%)] pointer-events-none" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            <Zap size={22} className="text-black" strokeWidth={3} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
            ¿Listo para equiparte?
          </h2>
          <p className="text-zinc-500 text-base mb-8 leading-relaxed">
            Explorá nuestro catálogo completo y consultá disponibilidad directamente por WhatsApp.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] hover:-translate-y-0.5"
          >
            Ver Catálogo Completo
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

// ─── Brand Section ────────────────────────────────────────────────────────────

function BrandSection({
  brand,
  imageLeft,
  index,
}: {
  brand: typeof BRANDS[0];
  imageLeft: boolean;
  index: number;
}) {
  const imgVariant = imageLeft ? fadeLeft : fadeRight;
  const textVariant = imageLeft ? fadeRight : fadeLeft;

  return (
    <section
      className={`relative py-20 md:py-28 border-b border-zinc-900 overflow-hidden ${
        index % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"
      }`}
    >
      {/* Subtle side glow */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          imageLeft ? "left-0" : "right-0"
        } w-72 h-72 bg-yellow-500/[0.04] rounded-full blur-3xl pointer-events-none`}
      />

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col ${
          imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } items-center gap-12 lg:gap-20`}
      >
        {/* Image Block */}
        <motion.div
          variants={imgVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="w-full lg:w-1/2 flex-shrink-0"
        >
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.6)] aspect-[4/3] bg-[#111] flex items-center justify-center">
            {/* Placeholder */}
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                <Shield size={28} className="text-zinc-600" strokeWidth={1.5} />
              </div>
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">
                [{brand.imagePlaceholder}]
              </p>
            </div>
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-500/5 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Text Block */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="w-full lg:w-1/2 flex flex-col gap-6"
        >
          {/* Logo placeholder */}
          <div className="inline-flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800 max-w-[40px]" />
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                [{brand.logoPlaceholder}]
              </span>
            </div>
          </div>

          {/* Brand name */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2">
              {brand.name}
            </h2>
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest">
              {brand.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-base leading-relaxed">{brand.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {brand.tags.map((tag) => (
              <span
                key={tag}
                className="bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/catalogo?marca=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-xs font-black uppercase tracking-widest transition-colors group w-fit"
          >
            Ver productos de {brand.name}
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
