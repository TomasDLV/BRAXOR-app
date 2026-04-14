"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Phone,
} from "lucide-react";

const WA_NUMBER = "5493816390854";
const WA_CONTACT_TEXT = encodeURIComponent("Hola, me gustaría hacer una consulta sobre equipamiento Off-Road.");

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const VIEWPORT = { once: true, margin: "-60px" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulated submit delay
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── HERO ── */}
      <section className="relative w-full pt-16 pb-14 px-4 overflow-hidden border-b border-zinc-900">
        {/* Carbon texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px),repeating-linear-gradient(-45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px)`,
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.35em] mb-3">
              — Bräxor Off-Road · Yerba Buena, Tucumán
            </p>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-5 drop-shadow-2xl">
              Contacto
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl font-medium leading-relaxed">
              El mejor equipamiento Off-Road te espera en Yerba Buena.
              Escribinos o visitá nuestro showroom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Info directa ── */}
          <div className="flex flex-col gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              custom={0}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-8">
                Visitanos
              </h2>

              <div className="flex flex-col gap-5">
                {/* Address */}
                <InfoRow icon={<MapPin size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />}>
                  <div>
                    <p className="text-white font-bold text-sm">Dirección</p>
                    <p className="text-zinc-400 text-sm mt-0.5">Camino de la Virgen 400</p>
                    <p className="text-zinc-500 text-xs">Complejo Uork 3, Local 3 · Yerba Buena, Tucumán</p>
                  </div>
                </InfoRow>

                {/* Hours */}
                <InfoRow icon={<Clock size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />}>
                  <div>
                    <p className="text-white font-bold text-sm">Horarios de Atención</p>
                    <p className="text-zinc-400 text-sm mt-0.5">Lunes a Viernes: 09:00 – 18:00 hs</p>
                    <p className="text-zinc-400 text-sm">Sábados: 09:00 – 13:00 hs</p>
                  </div>
                </InfoRow>

                {/* Email */}
                <InfoRow icon={<Mail size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />}>
                  <div>
                    <p className="text-white font-bold text-sm">Email</p>
                    <a
                      href="mailto:Braxorequipamientos@gmail.com"
                      className="text-zinc-400 hover:text-yellow-500 text-sm mt-0.5 transition-colors break-all"
                    >
                      Braxorequipamientos@gmail.com
                    </a>
                  </div>
                </InfoRow>

                {/* Phone placeholder */}
                <InfoRow icon={<Phone size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />}>
                  <div>
                    <p className="text-white font-bold text-sm">Teléfono / WhatsApp</p>
                    <p className="text-zinc-400 text-sm mt-0.5">+54 9 381 600-0000</p>
                  </div>
                </InfoRow>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              custom={0.1}
            >
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_CONTACT_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-black uppercase tracking-widest text-sm px-6 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(37,211,102,0.2)] hover:shadow-[0_0_50px_rgba(37,211,102,0.35)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                Chat por WhatsApp
              </a>
            </motion.div>

            {/* Map */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              custom={0.15}
              className="relative rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/3]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14244.86366951376!2d-65.32745361328126!3d-26.801252751033335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942242ec5f17f463%3A0x4d47d3ffc9f975af!2sRotonda%20Horco%20Molle!5e0!3m2!1ses!2sar!4v1773501182925!5m2!1ses!2sar"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, /* filter: "grayscale(1) invert(0.9) contrast(0.85)" */ }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Bräxor Off-Road"
              />
            </motion.div>
          </div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            custom={0.08}
          >
            <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                Enviar Consulta
              </h2>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mb-8">
                Te respondemos en menos de 24 horas.
              </p>

              {sent ? (
                <SuccessState onReset={() => setSent(false)} />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name */}
                  <FormField
                    label="Nombre Completo"
                    name="nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                  />

                  {/* Vehicle */}
                  <FormField
                    label="Tu Vehículo"
                    name="vehiculo"
                    type="text"
                    placeholder="Ej: Toyota Hilux 2023 / Ford Ranger 2021"
                  />

                  {/* Phone */}
                  <FormField
                    label="Teléfono / WhatsApp"
                    name="telefono"
                    type="tel"
                    placeholder="+54 9 381 000-0000"
                    required
                  />

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                      Mensaje / Consulta <span className="text-yellow-500">*</span>
                    </label>
                    <textarea
                      name="mensaje"
                      required
                      rows={5}
                      placeholder="Contanos qué equipamiento estás buscando, qué modificación querés hacer o cualquier consulta..."
                      className="bg-[#0a0a0a] border border-zinc-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-1"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Enviar Consulta
                      </>
                    )}
                  </button>

                  <p className="text-zinc-700 text-[10px] text-center uppercase tracking-widest">
                    Tu información es privada y no será compartida.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#111] border border-zinc-800/60 rounded-xl">
      {icon}
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
        {label} {required && <span className="text-yellow-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-[#0a0a0a] border border-zinc-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
      />
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center text-center py-10 gap-5"
    >
      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
        <CheckCircle2 size={30} className="text-emerald-400" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-white font-black uppercase tracking-wide text-xl mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
          Recibimos tu consulta. Te responderemos a la brevedad, generalmente en menos de 24 horas.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${WA_CONTACT_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl transition-colors flex-1"
        >
          <MessageCircle size={14} strokeWidth={2.5} />
          WhatsApp
        </a>
        <button
          onClick={onReset}
          className="flex-1 text-zinc-500 hover:text-zinc-300 text-xs uppercase tracking-widest font-bold transition-colors border border-zinc-800 hover:border-zinc-600 px-5 py-3 rounded-xl cursor-pointer"
        >
          Nueva consulta
        </button>
      </div>
    </motion.div>
  );
}
