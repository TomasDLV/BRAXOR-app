"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const VP = { once: true, margin: "-80px" };

export default function FinalCTA() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Taller image — blurred background */}
      <div className="absolute inset-0">
        <Image
          src="/images/taller.jpg"
          alt=""
          fill
          sizes="100vw"
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
              href="https://wa.me/5493816390854"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glass flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm px-10 py-4 cursor-pointer w-full sm:w-auto"
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
