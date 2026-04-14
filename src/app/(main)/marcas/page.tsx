"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";

// ─── Brand Data ───────────────────────────────────────────────────────────────

const BRANDS = [
  {
    id: "steel-tiger",
    name: "Steel Tiger",
    tagline: "Viví tu Pick-up.",
    sub: "Equipada con Steel Tiger.",
    description:
      "Fabricante argentino especializado en accesorios premium para camionetas y SUVs. Diseñan y producen sus propias líneas de barras de trabajo, cobertores de caja y sistemas de enganche para los modelos más populares del mercado: Hilux, Amarok, Ranger, Frontier y más.",
    origin: "Río Cuarto, Córdoba · Argentina",
    tags: ["Barras de Trabajo", "Tapas Top Tiger", "Estribos", "Paragolpes", "Enganches", "Off Road"],
    logoUrl: "/images/steeltiger-logo.png" as string | null,
    imageUrl: "/images/steeltiger-hero.jpg" as string | null,
    imagePlaceholder: "steeltiger-hero.jpg",
    logoPh: "steeltiger-logo.png",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.12)",
    accentBorder: "rgba(245,158,11,0.3)",
    website: "steeltiger.ar",
  },
  {
    id: "driven",
    name: "Driven",
    tagline: "Equipamiento Superior.",
    sub: "Diseñamos pensando en el uso real.",
    description:
      "Marca argentina de equipamiento premium para 4x4, camionetas y aventura overland. Desde compresores portátiles hasta cajas estancas de 128L y bidones homologados — todo pensado para condiciones exigentes en el campo.",
    origin: "Argentina",
    tags: ["Compresores", "Cajas Estancas", "Iluminación LED", "Bidones", "Herramientas", "Overlanding"],
    logoUrl: "/images/Driven-logo.png" as string | null,
    imageUrl: "/images/driven-hero.jpg" as string | null,
    imagePlaceholder: "driven-hero.jpg",
    logoPh: "Driven-logo.png ✓",
    accent: "#22c55e",
    accentDim: "rgba(34,197,94,0.10)",
    accentBorder: "rgba(34,197,94,0.28)",
    website: "driven.com.ar",
  },
  {
    id: "kraken",
    name: "Kraken",
    tagline: "Accesorios de caja.",
    sub: "Fuerza y funcionalidad para tu pickup.",
    description:
      "Fabricante argentino de tapas y accesorios para la caja de pickup trucks. Producen tapas retráctiles, plegables, estribos retráctiles y barras antivuelco para los modelos más vendidos del país, con foco en funcionalidad, seguridad y estilo.",
    origin: "Argentina",
    tags: ["Tapas Retráctiles", "Tapas Plegables", "Estribos Retráctiles", "Barras Antivuelco", "Portaequipajes", "Accesorios de Caja"],
    logoUrl: "/images/kraken-logo.png" as string | null,
    imageUrl: "/images/kraken-hero.jpg" as string | null,
    imagePlaceholder: "kraken-hero.jpg",
    logoPh: "kraken-logo.png",
    accent: "#38bdf8",
    accentDim: "rgba(56,189,248,0.10)",
    accentBorder: "rgba(56,189,248,0.28)",
    website: "accesorioskraken.com.ar",
  },
];

const VIEWPORT = { once: true, margin: "-60px" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarcasPage() {
  return (
    <main className="min-h-screen bg-[#080808] overflow-x-hidden">

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── BRANDS ── */}
      {BRANDS.map((brand, i) => (
        <BrandSection key={brand.id} brand={brand} index={i} />
      ))}

      {/* ── CTA ── */}
      <CTASection />

    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-28 overflow-hidden">

      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0900] via-[#080808] to-[#080808]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Big glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Partners Oficiales</span>
        </div>

        <h1 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
          Nuestras<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600">
            Marcas
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Trabajamos exclusivamente con marcas de equipamiento Off-Road que demostraron su valor en los terrenos más exigentes de Argentina y el mundo.
        </p>

        {/* Brand count chips */}
        <div className="flex items-center justify-center gap-3 mt-10 flex-wrap">
          {BRANDS.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: b.accent }}
              />
              {b.name}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-yellow-500/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Brand Section ────────────────────────────────────────────────────────────

function BrandSection({ brand, index }: { brand: typeof BRANDS[0]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  const isEven = index % 2 === 0;

  return (
    <section
      id={brand.id}
      ref={ref}
      className="relative py-24 md:py-36 overflow-hidden border-t"
      style={{ borderColor: brand.accentBorder }}
    >
      {/* Section bg */}
      <div className="absolute inset-0 bg-[#090909]" />

      {/* Accent glow */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${isEven ? "left-0" : "right-0"} w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none`}
        style={{ backgroundColor: brand.accentDim }}
      />

      {/* Index number bg */}
      <div
        className={`absolute top-8 ${isEven ? "right-8" : "left-8"} text-[160px] md:text-[220px] font-black leading-none select-none pointer-events-none opacity-[0.025] text-white`}
      >
        0{index + 1}
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-14 lg:gap-20`}>

        {/* ── Image ── */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex-shrink-0"
        >
          <div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl"
            style={{
              border: `1px solid ${brand.accentBorder}`,
              boxShadow: `0 0 80px ${brand.accentDim}, 0 0 0 1px ${brand.accentBorder}`,
            }}
          >
            {brand.imageUrl ? (
              <motion.div className="absolute inset-0" style={{ y: imageY }}>
                <Image
                  src={brand.imageUrl}
                  alt={brand.name}
                  fill
                  className="object-cover scale-110"
                  unoptimized
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f0f] gap-5">
                {/* Placeholder accent lines */}
                <div className="w-16 h-px" style={{ backgroundColor: brand.accent }} />
                <p className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-bold text-center px-8">
                  Poné la imagen en<br />
                  <span style={{ color: brand.accent }}>/public/images/{brand.imagePlaceholder}</span>
                </p>
                <div className="w-16 h-px" style={{ backgroundColor: brand.accent }} />
              </div>
            )}

            {/* Origin badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
              <MapPin size={10} style={{ color: brand.accent }} />
              <span className="text-white text-[9px] font-bold uppercase tracking-widest">{brand.origin}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Text ── */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 60 : -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="w-full lg:w-1/2 flex flex-col gap-7"
        >
          {/* Logo or wordmark */}
          {brand.logoUrl ? (
            <div className="relative h-12 w-48">
              <Image
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                fill
                className="object-contain object-left"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 w-fit"
              style={{ backgroundColor: brand.accentDim, border: `1px solid ${brand.accentBorder}` }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: brand.accent }}>
                {brand.logoPh}
              </span>
            </div>
          )}

          {/* Name */}
          <div>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              {brand.name}
            </h2>
            <p className="mt-3 text-base font-bold uppercase tracking-widest" style={{ color: brand.accent }}>
              {brand.tagline}
            </p>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">
              {brand.sub}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-16" style={{ backgroundColor: brand.accentBorder }} />

          {/* Description */}
          <p className="text-zinc-300 text-base leading-relaxed">{brand.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {brand.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: brand.accentDim,
                  border: `1px solid ${brand.accentBorder}`,
                  color: brand.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap pt-1">
            <Link
              href={`/catalogo?marca=${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-xs px-6 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: brand.accent,
                color: "#000",
              }}
            >
              Ver productos
              <ArrowRight size={14} strokeWidth={3} />
            </Link>
            <a
              href={`https://${brand.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              {brand.website}
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative py-28 px-4 overflow-hidden border-t border-zinc-900">
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.07)_0%,transparent_65%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.65 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
          — Consultá disponibilidad
        </p>
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
          ¿Listo para<br />
          <span className="text-yellow-500">equiparte?</span>
        </h2>
        <p className="text-zinc-500 text-base mb-10 leading-relaxed max-w-xl mx-auto">
          Explorá el catálogo completo o consultá directamente por WhatsApp. Te asesoramos con el equipamiento ideal para tu vehículo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)] hover:-translate-y-0.5"
          >
            Ver Catálogo Completo
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a
            href="https://wa.me/5493816390854"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25d366]/10 hover:bg-[#25d366] border border-[#25d366]/30 hover:border-[#25d366] text-[#25d366] hover:text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all duration-200"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
