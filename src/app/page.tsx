"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin, Zap } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { title: "Llantas &\nNeumáticos", href: "/catalogo?categoria=llantas", img: "/images/cat-llantas.png", sub: "BFGoodrich · General · Method" },
  { title: "Kits de\nSuspensión", href: "/catalogo?categoria=suspension", img: "/images/cat-suspension.png", sub: "ARB · Old Man Emu · Warn" },
  { title: "Defensas &\nEstribos", href: "/catalogo?categoria=defensas", img: "/images/cat-defensas.png", sub: "Rhino · ARB · Baratec" },
  { title: "Iluminación\nLED", href: "/catalogo?categoria=iluminacion", img: "/images/cat-iluminacion.png", sub: "Baratec · Warn · Trail Series" },
];

const BRANDS = ["BFGoodrich", "Warn", "ARB", "Baratec", "Method", "Rhino"];
const HERO_WORDS = ["EQUIPAMIENTO", "QUE", "MARCA", "LA", "DIFERENCIA."];

const VP = { once: true, margin: "-80px" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0d0d0d] overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          1. HERO — Taller full-bleed parallax
      ═══════════════════════════════════════════ */}
      <HeroSection />

      {/* ═══════════════════════════════════════════
          2. EL TALLER — Split layout
      ═══════════════════════════════════════════ */}
      <TallerSection />

      {/* ═══════════════════════════════════════════
          3. CATEGORÍAS — Metal plates grid
      ═══════════════════════════════════════════ */}
      <CategorySection />

      {/* ═══════════════════════════════════════════
          4. MARCAS — Brand strip
      ═══════════════════════════════════════════ */}
      <BrandsStrip />

      {/* ═══════════════════════════════════════════
          5. CTA FINAL
      ═══════════════════════════════════════════ */}
      <FinalCTA />
    </main>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[calc(100vh-72px)] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
        <Image
          src="/images/taller.jpg"
          alt="Showroom Bräxor Off-Road"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0d0d]" />
      {/* Vignette edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)]" />

      {/* Yellow horizontal line accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-yellow-500 text-xs font-black uppercase mb-8"
        >
          — Bräxor Off-Road · Yerba Buena
        </motion.p>

        {/* Main title — word by word */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 mb-7 leading-none"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } } }}
        >
          {HERO_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: {
                  opacity: 1, y: 0, filter: "blur(0px)",
                  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              className="text-[2.8rem] md:text-[5rem] lg:text-[6rem] font-black text-white tracking-tighter uppercase drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
              style={{ textShadow: "0 0 60px rgba(0,0,0,0.8)" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="text-zinc-300 text-base md:text-xl mb-10 font-medium max-w-lg drop-shadow-md leading-relaxed"
        >
          El quirófano del off-road. Equipamiento de élite, instalación profesional.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/catalogo">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(234,179,8,0.8)" }}
              whileTap={{ scale: 0.96 }}
              className="bg-yellow-500 text-black font-black py-4 px-12 rounded-xl uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(234,179,8,0.5)] cursor-pointer"
            >
              Explorar el Catálogo
            </motion.button>
          </Link>
          <Link href="/contacto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 font-bold py-4 px-8 rounded-xl uppercase tracking-widest text-sm transition-colors cursor-pointer"
            >
              Contacto
              <ArrowRight size={15} strokeWidth={2.5} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
        >
          <span className="text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-yellow-500/50 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── El Taller Section ────────────────────────────────────────────────────────

function TallerSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-[#0a0a0a] overflow-hidden">
      {/* Concrete noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      {/* Yellow glow — right side */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              — El Showroom
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-5">
              Donde el
              <br />
              <span className="text-yellow-500">Metal</span> Habla.
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">
              No somos un local cualquiera. Nuestro espacio fue diseñado para que cada pieza
              que ves sea la que terminás montando en tu vehículo. Bloques de cemento expuesto,
              estructuras de metal negro, detalles en amarillo vibrante.
            </p>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
            Ubicados en <span className="text-white font-semibold">Yerba Buena, Tucumán</span>,
            atendemos exclusivamente a los que saben lo que buscan.
          </p>

          {/* Details */}
          <div className="flex flex-col gap-3 pt-2">
            {[
              ["Instalación profesional", "Montaje a cargo de especialistas"],
              ["Piezas originales", "100% stock verificado y garantizado"],
              ["Asesoramiento real", "Sin humo. Lo que necesitás, lo que te funciona"],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">{title}</p>
                  <p className="text-zinc-600 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <MapPin size={14} className="text-yellow-500" strokeWidth={2} />
            <span className="text-zinc-500 text-xs uppercase tracking-widest">
              Yerba Buena · Tucumán · Argentina
            </span>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={VP}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind image */}
          <div className="absolute inset-0 bg-yellow-500/8 rounded-3xl blur-3xl scale-90 pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] aspect-[4/3]">
            <Image
              src="/images/taller.jpg"
              alt="Interior del taller Bräxor"
              fill
              className="object-cover object-center"
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Label */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
              <Zap size={12} className="text-yellow-500" strokeWidth={3} />
              <span className="text-white text-[10px] font-black uppercase tracking-widest">
                Showroom Bräxor
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────

function CategorySection() {
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryPlate key={i} {...cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryPlateProps {
  title: string;
  href: string;
  img: string;
  sub: string;
  index: number;
}

function CategoryPlate({ title, href, img, sub, index }: CategoryPlateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href}>
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
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-2xl pointer-events-none z-30"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.55), 0 0 40px rgba(234,179,8,0.12)",
            }}
          />

          {/* Base border */}
          <div className="absolute inset-0 rounded-2xl border border-zinc-800 pointer-events-none z-20" />

          {/* Inner shine — top edge metallic reflection */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />

          {/* Corner accent lines */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-zinc-700 z-20 group-hover:border-yellow-500/50 transition-colors duration-300" />

          {/* Radial glow bottom-right */}
          <motion.div
            variants={{
              rest: { opacity: 0.3 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.4 }}
            className="absolute -bottom-12 -right-12 w-52 h-52 bg-yellow-500/[0.07] rounded-full blur-3xl pointer-events-none z-10"
          />

          {/* Product image — zoom on hover */}
          <motion.div
            variants={{
              rest: { scale: 1, x: 0 },
              hover: { scale: 1.1, x: -4 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-4 -right-4 w-52 h-52 md:w-64 md:h-64 z-10"
          >
            <Image
              src={img}
              alt={title}
              fill
              className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
            />
          </motion.div>

          {/* Text */}
          <div className="relative z-20 p-7 flex flex-col gap-2 h-full">
            <h3 className="text-2xl md:text-3xl font-black uppercase text-white leading-tight tracking-tight w-[52%] drop-shadow-lg whitespace-pre-line">
              {title}
            </h3>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">{sub}</p>

            {/* CTA reveal */}
            <motion.div
              variants={{
                rest: { opacity: 0, y: 6 },
                hover: { opacity: 1, y: 0 },
              }}
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

// ─── Brands Strip ─────────────────────────────────────────────────────────────

function BrandsStrip() {
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
          {BRANDS.map((brand) => (
            <motion.span
              key={brand}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ color: "#eab308", scale: 1.1, y: -2 }}
              className="text-zinc-600 font-black uppercase tracking-widest text-xs md:text-sm cursor-default transition-colors"
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-[#0a0a0a]">
      {/* Taller image — blurred background */}
      <div className="absolute inset-0">
        <Image
          src="/images/taller.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-20"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7 }}
        >
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-7 shadow-[0_0_40px_rgba(234,179,8,0.5)]">
            <Zap size={22} className="text-black" strokeWidth={3} />
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-5 drop-shadow-2xl">
            ¿Listo para
            <br />
            <span className="text-yellow-500">equiparte?</span>
          </h2>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Visitá nuestro showroom en Yerba Buena o escribinos por WhatsApp.
            El mejor equipamiento Off-Road de Argentina te espera.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(234,179,8,0.7)" }}
                whileTap={{ scale: 0.96 }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm px-10 py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-colors cursor-pointer"
              >
                Explorar Catálogo
              </motion.button>
            </Link>
            <a
              href="https://wa.me/5493816000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 bg-[#25d366]/10 hover:bg-[#25d366] border border-[#25d366]/40 hover:border-[#25d366] text-[#25d366] hover:text-white font-black uppercase tracking-widest text-sm px-10 py-4 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
              >
                WhatsApp
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
