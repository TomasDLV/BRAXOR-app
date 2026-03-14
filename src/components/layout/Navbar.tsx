"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Marcas", href: "/marcas" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="w-full sticky top-0 z-50 border-b border-white/[0.06]"
      animate={{
        backgroundColor: scrolled ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.18)",
        backdropFilter: scrolled ? "blur(24px) saturate(140%)" : "blur(12px) saturate(120%)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="relative z-50 flex-shrink-0">
          <div className="relative w-44 h-12 md:w-52 md:h-14">
            <Image
              src="/images/logo-header-final.png"
              alt="Bräxor"
              fill
              sizes="(max-width: 768px) 176px, 208px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Desktop: CTA button */}
        <div className="hidden md:flex items-center z-50">
          <Link href="/catalogo">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500 border border-yellow-500/40 hover:border-yellow-500 text-yellow-500 hover:text-black text-[10px] font-black uppercase tracking-[0.18em] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Ver Catálogo
            </motion.span>
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <div className="flex md:hidden items-center z-50">
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            className="text-white p-2 rounded-md"
            whileTap={{ scale: 0.88 }}
            aria-label="Menú"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <X size={26} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <Menu size={26} strokeWidth={2.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]"
            style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(30px)" }}
          >
            <motion.nav
              className="flex flex-col items-center py-8 gap-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.28 } },
                  }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-4 text-white text-base font-black uppercase tracking-[0.2em] hover:text-yellow-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.28 } },
                }}
                className="pt-5 mt-2 border-t border-white/[0.06] w-3/4"
              >
                <Link
                  href="/catalogo"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-yellow-500 text-black font-black uppercase tracking-widest text-sm px-8 py-3.5 rounded-xl"
                >
                  Ver Catálogo
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative px-4 py-2.5">
      <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
      <motion.span
        className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-500 rounded-full"
        initial={{ width: 0, opacity: 0 }}
        whileHover={{ width: "55%", opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </Link>
  );
}
