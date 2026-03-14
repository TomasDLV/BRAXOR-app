"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="w-full sticky top-0 z-50 border-b border-zinc-900 transition-colors duration-300"
      animate={{
        backgroundColor: scrolled
          ? "rgba(0,0,0,0.97)"
          : "rgba(0,0,0,0.88)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="relative z-50 flex-shrink-0">
          <div className="relative w-44 h-14 md:w-56 md:h-16">
            <Image
              src="/images/logo-header-final.png"
              alt="Bräxor"
              fill
              sizes="(max-width: 768px) 176px, 224px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 text-zinc-400 z-50">
          <IconButton aria-label="Buscar">
            <Search size={20} strokeWidth={2} />
          </IconButton>
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
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <X size={28} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <Menu size={28} strokeWidth={2.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-zinc-800 bg-black/98 backdrop-blur-3xl"
          >
            <motion.nav
              className="flex flex-col items-center py-8 gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                  }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-4 text-white text-lg font-black uppercase tracking-widest hover:text-yellow-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile icons row */}
              <div className="flex gap-8 pt-4 text-zinc-400 border-t border-zinc-800 w-2/3 justify-center mt-2">
                <button aria-label="Buscar" className="hover:text-yellow-500 transition-colors">
                  <Search size={22} strokeWidth={2} />
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group relative px-4 py-2">
      <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
      {/* Underline indicator */}
      <motion.span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-500 rounded-full"
        initial={{ width: 0 }}
        whileHover={{ width: "60%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </Link>
  );
}

function IconButton({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <motion.button
      aria-label={ariaLabel}
      whileHover={{ color: "#eab308", scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-md transition-colors cursor-pointer"
    >
      {children}
    </motion.button>
  );
}
