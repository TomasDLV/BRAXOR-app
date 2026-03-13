"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 35, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: ["Llantas &", "Neumáticos"],
    href: "/catalogo/llantas",
    img: "/images/cat-llantas.png",
  },
  {
    title: ["Kits de", "Suspensión"],
    href: "/catalogo/suspension",
    img: "/images/cat-suspension.png",
  },
  {
    title: ["Defensas &", "Estribos"],
    href: "/catalogo/defensas",
    img: "/images/cat-defensas.png",
  },
  {
    title: ["Iluminación", "LED"],
    href: "/catalogo/iluminacion",
    img: "/images/cat-iluminacion.png",
  },
];

const BRANDS = ["BFGoodrich", "Warn", "ARB", "Baratec", "Method Race Wheels"];

const HERO_WORDS = ["EQUIPAMIENTO", "QUE", "MARCA", "LA", "DIFERENCIA."];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <MetalDivider />

      {/* ── 1. HERO ── */}
      <section className="relative w-full h-[540px] md:h-[660px] flex flex-col items-center justify-start pt-14 md:pt-24 text-center px-4 overflow-hidden">
        {/* Background */}
        <Image
          src="/images/hero-bg.png"
          alt="Camionetas Bräxor Off-Road"
          fill
          priority
          className="object-cover object-center z-0 scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/15 to-[#0a0a0a] z-10" />
        {/* Left/right vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.55)_100%)] z-10" />

        <div className="relative z-20 flex flex-col items-center max-w-5xl mx-auto">
          {/* Staggered title — word by word */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-1 mb-4 leading-none"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {HERO_WORDS.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariant}
                className="text-[2.6rem] md:text-[4.5rem] lg:text-[5.5rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_6px_14px_rgba(0,0,0,0.95)]"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="text-zinc-300 text-base md:text-lg mb-9 font-medium drop-shadow-md"
          >
            Probá y visualizá tus piezas en tiempo real.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05, duration: 0.45, ease: "backOut" }}
          >
            <Link href="/catalogo">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 45px rgba(234,179,8,0.75)",
                }}
                whileTap={{ scale: 0.96 }}
                className="bg-yellow-500 text-black font-extrabold py-4 px-14 rounded-md uppercase tracking-widest text-sm md:text-base shadow-[0_0_22px_rgba(234,179,8,0.45)] cursor-pointer"
              >
                Explorar Catálogo
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <MetalDivider />

      {/* ── 2. CATEGORY GRID ── */}
      <section className="relative w-full py-14 md:py-20 bg-[#0d0d0d]">
        {/* Carbon texture */}
        <div className="absolute inset-0 opacity-[0.035] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

        <motion.div
          className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={i} {...cat} index={i} />
          ))}
        </motion.div>
      </section>

      <MetalDivider />

      {/* ── 3. BRANDS STRIP ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full bg-[#161616] border-y border-zinc-800 py-9"
      >
        <motion.div
          className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-10 md:gap-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {BRANDS.map((brand, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, delay: i * 0.08 },
                },
              }}
              whileHover={{ color: "#ffffff", scale: 1.12 }}
              className="text-zinc-400 font-black uppercase tracking-widest text-xs md:text-sm cursor-default transition-colors"
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>
      </motion.section>

      <MetalDivider />

      {/* ── 4. COMING SOON + FOOTER ── */}
      <section className="relative w-full bg-[#0a0a0a] pt-20 pb-12 border-t border-zinc-900/60 overflow-hidden">
        {/* Map texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.06]" />

        {/* "Próximamente" block */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white uppercase leading-tight drop-shadow-md"
          >
            <span className="text-yellow-500">📍</span> Próximamente
            <br />
            en Yerba Buena.
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex w-full md:w-auto shadow-xl"
          >
            <input
              type="email"
              placeholder="Dejanos tu email y te avisamos."
              className="bg-[#111] border border-zinc-700 text-white px-4 py-3 rounded-l-md w-full md:w-72 focus:outline-none focus:border-yellow-500 text-sm placeholder-zinc-600 transition-colors"
            />
            <motion.button
              whileHover={{ backgroundColor: "#facc15", color: "#000" }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black font-bold uppercase text-xs md:text-sm px-6 py-3 rounded-r-md transition-colors whitespace-nowrap cursor-pointer"
            >
              Suscribirse
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 mt-20 flex flex-col items-center text-center"
        >
          <div className="relative w-52 h-14 mb-3">
            <Image
              src="/images/logo-footer.png"
              alt="Bräxor Off-Road"
              fill
              className="object-contain object-center"
            />
          </div>
          <p className="text-zinc-500 text-xs mb-4">
            Contact: info@braxor.com.ar
          </p>
          <div className="flex gap-5 text-zinc-500 text-sm font-bold">
            {["FB", "IG", "YT"].map((s) => (
              <motion.span
                key={s}
                whileHover={{ color: "#fff", scale: 1.15 }}
                className="cursor-pointer transition-colors"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetalDivider() {
  return (
    <div className="relative w-full h-[18px] md:h-[22px] z-30 shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
      <Image
        src="/images/metal-divider-final.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}

interface CategoryCardProps {
  title: string[];
  href: string;
  img: string;
  index: number;
}

function CategoryCard({ title, href, img, index }: CategoryCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.52, delay: index * 0.1, ease: "easeOut" },
        },
      }}
    >
      <Link href={href}>
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="relative h-64 md:h-72 bg-gradient-to-br from-[#1e1e1e] to-[#111] rounded-2xl p-7 border border-zinc-800 overflow-hidden cursor-pointer shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
        >
          {/* Hover: border glow */}
          <motion.div
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-2xl border border-zinc-500/50 pointer-events-none z-20"
          />
          {/* Hover: inner shine */}
          <motion.div
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none z-20"
          />
          {/* Hover: card lift */}
          <motion.div
            variants={{
              rest: { y: 0 },
              hover: { y: -4 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0)" }}
          />

          {/* Title */}
          <h3 className="relative z-10 text-xl md:text-2xl font-black uppercase text-white leading-tight tracking-wide w-[52%] drop-shadow-lg">
            {title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h3>

          {/* Bottom-right glow blob */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-500/[0.06] rounded-full blur-3xl pointer-events-none" />

          {/* Product Image — zoom on hover */}
          <motion.div
            variants={{
              rest: { scale: 1, rotate: 0 },
              hover: { scale: 1.09 },
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute -bottom-3 -right-3 w-52 h-52 md:w-64 md:h-64 z-10"
          >
            <Image
              src={img}
              alt={title.join(" ")}
              fill
              className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
