"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const HERO_WORDS = ["EQUIPAMIENTO", "QUE", "MARCA", "LA", "DIFERENCIA."];

export default function HeroSection() {
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
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d0d0d]" />
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
              className="btn-glass flex items-center gap-2 text-white font-bold py-4 px-8 uppercase tracking-widest text-sm cursor-pointer"
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
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex"
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
