"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Zap } from "lucide-react";

const VP = { once: true, margin: "-80px" };

export default function TallerSection() {
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
          <div className="absolute inset-0 bg-yellow-500/8 rounded-3xl blur-3xl scale-90 pointer-events-none" />

          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] aspect-[4/3]">
            <Image
              src="/images/taller.jpg"
              alt="Interior del taller Bräxor"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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
