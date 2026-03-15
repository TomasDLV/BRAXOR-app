"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Chapter = {
  tag: string;
  titleLines: [string, string];
  body: string;
  image: string | null;
};

const CHAPTERS: Chapter[] = [
  {
    tag: "— La Experiencia BRAXOR",
    titleLines: ["MÁS QUE UN TALLER,", "UN ESTÁNDAR"],
    body: "En BRAXOR no solo vendemos partes y hacemos modding; somos los arquitectos de tu desempeño automotriz. Desde la colocación quirúrgica de un repuesto hasta un cambio de aceite élite, garantizamos la perfección que solo el epicentro del lujo industrial en Tucumán puede ofrecer.",
    image: null,
  },
  {
    tag: "— Parts & Mods",
    titleLines: ["EL ARTE DE", "LA POTENCIA"],
    body: "Somos distribuidores de las mejores marcas de modding y repuestos. Pero nuestra verdadera fuerza es la Colocación Profesional. Cada pieza — desde suspensiones Off-Road hasta cubiertas masivas — se instala bajo estándares de quirófano.",
    image: "/images/braxor_experience_1.jpg",
  },
  {
    tag: "— Colocación Profesional",
    titleLines: ["LA CIENCIA DEL", "DESEMPEÑO"],
    body: "Nuestra técnica es la ciencia detrás de tu potencia. Herramientas de precisión, personal altamente capacitado, y un estándar que eleva cada modificación o repuesto a la perfección absoluta.",
    image: "/images/braxor_experience_2.jpg",
  },
  {
    tag: "— Cuidado Integral",
    titleLines: ["MANTENIMIENTO", "ÉLITE"],
    body: "Incluso el mantenimiento esencial merece un trato premium. Desde un cambio de aceite con los lubricantes de más alta gama hasta revisiones generales — garantizamos el cuidado de un quirófano automotriz.",
    image: "/images/braxor_experience_3.jpg",
  },
];

// ─── Shared title renderer ────────────────────────────────────────────────────

function ChapterTitle({
  lines,
  className = "",
}: {
  lines: [string, string];
  className?: string;
}) {
  return (
    <h2 className={className}>
      {lines[0]}
      <br />
      <span className="text-yellow-500">{lines[1]}</span>
    </h2>
  );
}

// ─── DESKTOP (md+): two-column sticky scrolltelling ──────────────────────────

function DesktopScrolltelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── All useTransform calls at top level (Rules of Hooks) ───────────────────

  // Intro overlay — fades out fast, z-50 covers everything beneath
  const opacityIntro = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  // Derived: block pointer events once intro is invisible
  const pointerEventsIntro = useTransform(opacityIntro, (v) =>
    v > 0.01 ? "auto" : "none"
  );

  // Chapter 1: fades in [0.15→0.2], full [0.2→0.4], fades out [0.4→0.45]
  const opacityCap1 = useTransform(
    scrollYProgress,
    [0.15, 0.2, 0.4, 0.45],
    [0, 1, 1, 0]
  );

  // Chapter 2: fades in [0.45→0.5], full [0.5→0.7], fades out [0.7→0.75]
  const opacityCap2 = useTransform(
    scrollYProgress,
    [0.45, 0.5, 0.7, 0.75],
    [0, 1, 1, 0]
  );

  // Chapter 3: fades in [0.75→0.8], stays full to end
  const opacityCap3 = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]);

  // Progress bar
  const scaleX = scrollYProgress;

  // ── Persiana edge bar — slides up from below during Chapter 3 ─────────────
  const yBarra = useTransform(scrollYProgress, [0.7, 0.85], ["100%", "0%"]);

  return (
    // 'relative' is REQUIRED by Framer Motion for correct scroll offset calculation
    <div
      ref={containerRef}
      className="hidden md:block relative h-[400vh] w-full bg-[#0a0a0a]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex">

        {/* Top progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-500 origin-left z-[60]"
          style={{ scaleX }}
        />

        {/* ── LAYER 1: Left column — text panels ─────────────────────────── */}
        <div className="relative w-1/2 h-full z-10 bg-[#0d0d0d]">

          {/* Left-edge progress fill */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-500/5 via-yellow-500/50 to-yellow-500/5 origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Chapter counter bottom-left */}
          <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-10 pointer-events-none">
            {[opacityIntro, opacityCap1, opacityCap2, opacityCap3].map(
              (opacity, i) => (
                <motion.div
                  key={i}
                  style={{ opacity }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-[1px] bg-yellow-500/50" />
                  <span className="text-yellow-500/70 text-[10px] font-black tabular-nums tracking-widest">
                    0{i + 1} / 04
                  </span>
                </motion.div>
              )
            )}
          </div>

          {/* Text panel — Chapter 1 */}
          <motion.div
            style={{ opacity: opacityCap1 }}
            className="absolute inset-0 flex flex-col justify-center px-12 lg:px-16 xl:px-20 pointer-events-none"
          >
            <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.4em] mb-5">
              {CHAPTERS[1].tag}
            </p>
            <ChapterTitle
              lines={CHAPTERS[1].titleLines}
              className="text-4xl lg:text-5xl xl:text-6xl font-black uppercase text-white tracking-tighter leading-[0.88] mb-5"
            />
            <div className="w-12 h-[2px] bg-yellow-500/50 mb-5" />
            <p className="text-zinc-200 text-base lg:text-lg leading-relaxed max-w-sm">
              {CHAPTERS[1].body}
            </p>
          </motion.div>

          {/* Text panel — Chapter 2 */}
          <motion.div
            style={{ opacity: opacityCap2 }}
            className="absolute inset-0 flex flex-col justify-center px-12 lg:px-16 xl:px-20 pointer-events-none"
          >
            <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.4em] mb-5">
              {CHAPTERS[2].tag}
            </p>
            <ChapterTitle
              lines={CHAPTERS[2].titleLines}
              className="text-4xl lg:text-5xl xl:text-6xl font-black uppercase text-white tracking-tighter leading-[0.88] mb-5"
            />
            <div className="w-12 h-[2px] bg-yellow-500/50 mb-5" />
            <p className="text-zinc-200 text-base lg:text-lg leading-relaxed max-w-sm">
              {CHAPTERS[2].body}
            </p>
          </motion.div>

          {/* Text panel — Chapter 3 */}
          <motion.div
            style={{ opacity: opacityCap3 }}
            className="absolute inset-0 flex flex-col justify-center px-12 lg:px-16 xl:px-20 pointer-events-none"
          >
            <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.4em] mb-5">
              {CHAPTERS[3].tag}
            </p>
            <ChapterTitle
              lines={CHAPTERS[3].titleLines}
              className="text-4xl lg:text-5xl xl:text-6xl font-black uppercase text-white tracking-tighter leading-[0.88] mb-5"
            />
            <div className="w-12 h-[2px] bg-yellow-500/50 mb-5" />
            <p className="text-zinc-200 text-base lg:text-lg leading-relaxed max-w-sm">
              {CHAPTERS[3].body}
            </p>
          </motion.div>
        </div>

        {/* ── LAYER 2: Right column — images ─────────────────────────────── */}
        <div className="relative w-1/2 h-full z-10 bg-[#111]">

          {/* Left-edge blend gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10 pointer-events-none" />

          <motion.div
            style={{ opacity: opacityCap1 }}
            className="absolute inset-0"
          >
            <Image
              src={CHAPTERS[1].image!}
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-center"
              aria-hidden
            />
          </motion.div>

          <motion.div
            style={{ opacity: opacityCap2 }}
            className="absolute inset-0"
          >
            <Image
              src={CHAPTERS[2].image!}
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-center"
              aria-hidden
            />
          </motion.div>

          <motion.div
            style={{ opacity: opacityCap3 }}
            className="absolute inset-0"
          >
            <Image
              src={CHAPTERS[3].image!}
              alt=""
              fill
              sizes="50vw"
              className="object-cover object-center"
              aria-hidden
            />
          </motion.div>
        </div>

        {/* ── LAYER 3: Persiana edge bar — slides up from below on Chapter 3 ─ */}
        <motion.div
          style={{
            y: yBarra,
            backgroundImage: "url('/images/persiana_edge.png')",
          }}
          className="absolute bottom-0 left-0 w-full h-12 md:h-16 z-[55] bg-cover bg-center pointer-events-none"
        />

        {/* ── LAYER 4: Intro overlay — z-50 covers both columns ──────────── */}
        {/* bg-[#0a0a0a] ensures a solid mask while fading out */}
        <motion.div
          style={{
            opacity: opacityIntro,
            pointerEvents: pointerEventsIntro,
          }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.44em] mb-7">
            {CHAPTERS[0].tag}
          </p>

          <ChapterTitle
            lines={CHAPTERS[0].titleLines}
            className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase text-white tracking-tighter leading-[0.88] mb-8 max-w-4xl text-center"
          />

          <div className="w-16 h-[2px] bg-yellow-500/50 mb-8" />

          <p className="text-zinc-200 text-base lg:text-lg leading-relaxed max-w-2xl text-center">
            En BRAXOR no solo vendemos partes y hacemos modding; somos los{" "}
            <span className="text-white font-semibold">
              arquitectos de tu desempeño automotriz
            </span>
            . Desde la colocación quirúrgica de un repuesto hasta un cambio de
            aceite élite, garantizamos la perfección que solo el epicentro del
            lujo industrial en Tucumán puede ofrecer.
          </p>

          {/* Scroll nudge */}
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-bold">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-yellow-500/40 to-transparent" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

// ─── MOBILE (< md): stacked full-bleed chapters ───────────────────────────────

function MobileChapters() {
  return (
    <div className="md:hidden flex flex-col">
      {CHAPTERS.map((ch, i) => (
        <div
          key={ch.tag}
          className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden"
        >
          {ch.image ? (
            <>
              <Image
                src={ch.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
                aria-hidden
              />
              <div className="absolute inset-0 bg-black/65" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[#0d0d0d]" />
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 p-7 ${
              i === 0
                ? "flex flex-col items-center text-center mb-10"
                : "bg-black/65 backdrop-blur-sm border-l-2 border-yellow-500/40 mx-5 mb-8"
            }`}
          >
            <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.38em] mb-3">
              {ch.tag}
            </p>

            <ChapterTitle
              lines={ch.titleLines}
              className="text-[2.3rem] font-black uppercase text-white tracking-tighter leading-none mb-4"
            />

            <div
              className={`w-10 h-[2px] bg-yellow-500/40 mb-4 ${
                i === 0 ? "mx-auto" : ""
              }`}
            />

            <p className="text-zinc-200 text-sm leading-relaxed max-w-sm">
              {ch.body}
            </p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function TallerSection() {
  return (
    <>
      <DesktopScrolltelling />
      <MobileChapters />
    </>
  );
}
