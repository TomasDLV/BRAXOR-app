"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, CheckCircle } from "lucide-react";

const RINGS = [0, 1, 2];

export default function LocationSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to newsletter provider
    setSent(true);
  }

  return (
    <section
      id="location-section"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background: topographic off-road map ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/location_presence_yerbabuena.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        {/* Heavy overlay to maintain dark brand aesthetic */}
        <div className="absolute inset-0 bg-black/78" />
        {/* Radial vignette — darkens edges, isolates centre content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Edge lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-9 px-6 w-full max-w-md">

        {/* Industrial location pin with concentric pulse rings */}
        <div className="relative flex items-center justify-center">
          {/* Pulse rings — square, not circular, for industrial look */}
          {RINGS.map((i) => (
            <motion.div
              key={i}
              className="absolute border-2 border-yellow-500/30"
              style={{ width: 64, height: 64 }}
              animate={{ scale: [1, 4.2], opacity: [0.65, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.0,
                delay: i * 1.0,
                ease: "easeOut",
              }}
            />
          ))}
          {/* Core icon — sharp square, full yellow */}
          <div className="relative z-10 w-16 h-16 bg-yellow-500 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.75),0_0_100px_rgba(234,179,8,0.3)]">
            <MapPin size={26} className="text-black" strokeWidth={2.5} />
          </div>
        </div>

        {/* Heading */}
        <motion.div
          className="text-center flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.45em]">
            — Próximamente
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Yerba Buena
            <br />
            <span className="text-zinc-600">Tucumán</span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto mt-1">
            Nuestro showroom físico abre sus puertas pronto.
            Suscribite para ser el primero en enterarte.
          </p>
        </motion.div>

        {/* Newsletter — rugged metal input, no glassmorphism */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <CheckCircle
                size={30}
                className="text-yellow-500"
                strokeWidth={1.5}
              />
              <p className="text-white text-sm font-black uppercase tracking-widest">
                ¡Listo!
              </p>
              <p className="text-zinc-500 text-xs">
                Te avisamos en cuanto abramos.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="
                  flex-1 min-w-0
                  bg-zinc-900 border border-zinc-700
                  border-r-0
                  px-5 py-4
                  text-sm text-white placeholder-zinc-600
                  font-mono tracking-wider
                  outline-none
                  focus:border-yellow-500
                  transition-colors duration-200
                  rounded-none
                "
              />
              <motion.button
                type="submit"
                whileHover={{ backgroundColor: "#facc15" }}
                whileTap={{ scale: 0.98 }}
                className="
                  bg-yellow-500
                  text-black font-black uppercase tracking-widest text-xs
                  px-8 py-4
                  border border-yellow-500
                  transition-colors duration-200 cursor-pointer
                  whitespace-nowrap
                  rounded-none
                "
              >
                Suscribirse
              </motion.button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
