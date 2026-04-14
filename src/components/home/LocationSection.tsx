"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Clock, Phone, ArrowRight, CheckCircle } from "lucide-react";

const HOURS = [
  { day: "Lunes a Viernes", time: "09:00 – 18:00 hs", open: true },
  { day: "Sábados", time: "09:00 – 13:00 hs", open: true },
  { day: "Domingos", time: "Cerrado", open: false },
];

const VP = { once: true, margin: "-60px" };

export default function LocationSection() {
  return (
    <section
      id="location-section"
      className="relative w-full py-20 md:py-28 overflow-hidden border-t border-zinc-900"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full">
              <CheckCircle size={9} strokeWidth={3} />
              Abierto al público
            </span>
          </div>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            — Showroom & Taller
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Encontranos en<br />
            <span className="text-zinc-500">Yerba Buena</span>
          </h2>
        </motion.div>

        {/* Grid: imagen + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Imagen del taller */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl aspect-[4/3]"
          >
            <Image
              src="/images/taller.jpg"
              alt="Taller Bräxor Off-Road — Yerba Buena, Tucumán"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badge sobre imagen */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5">
                <MapPin size={13} className="text-yellow-500 flex-shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-white text-xs font-bold leading-tight">Yerba Buena</p>
                  <p className="text-zinc-400 text-[10px]">Tucumán, Argentina</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Yerba+Buena+Tucuman+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-2.5 rounded-xl transition-all"
              >
                Ver en mapa
                <ArrowRight size={10} strokeWidth={3} />
              </a>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Horarios */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-5">
                <Clock size={14} className="text-yellow-500" strokeWidth={2} />
                <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">Horarios</p>
              </div>
              <div className="flex flex-col gap-3">
                {HOURS.map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${open ? "text-zinc-300" : "text-zinc-700"}`}>
                      {day}
                    </span>
                    <span className={`text-sm font-bold ${open ? "text-white" : "text-zinc-700"}`}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-yellow-500" strokeWidth={2} />
                <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">Ubicación</p>
              </div>
              <p className="text-white text-base font-bold mb-1">Yerba Buena</p>
              <p className="text-zinc-500 text-sm">Tucumán, Argentina</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5493816390854"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white text-sm font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(37,211,102,0.2)]"
              >
                <Phone size={15} strokeWidth={2.5} />
                Consultar por WhatsApp
              </a>
              <a
                href="tel:+5493816390854"
                className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 text-zinc-300 text-sm font-bold uppercase tracking-widest px-6 py-4 rounded-xl transition-all"
              >
                +54 9 381 639-0854
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
