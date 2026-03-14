"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, Tag, Shield, Car, ExternalLink, Zap, Menu, X } from "lucide-react";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
  { label: "Marcas", href: "/admin/marcas", icon: Shield },
  { label: "Modelos", href: "/admin/modelos", icon: Car },
];

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-zinc-800">
        <div className="w-7 h-7 bg-yellow-500 rounded-md flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-black" strokeWidth={3} />
        </div>
        <div>
          <p className="text-white font-black uppercase tracking-widest text-sm leading-none">
            Bräxor
          </p>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-5 flex-1">
        <p className="text-zinc-700 text-[9px] uppercase tracking-[0.2em] font-bold px-3 mb-2">
          Gestión
        </p>
        {NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group ${
                active
                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} className="flex-shrink-0" />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Ver sitio + Sign out */}
      <div className="px-3 py-5 border-t border-zinc-800 flex flex-col gap-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-zinc-300 text-sm font-semibold transition-colors hover:bg-zinc-800/40"
        >
          <ExternalLink size={16} strokeWidth={2} />
          Ver Sitio
        </a>
        <SignOutButton />
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cerrar al navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── MOBILE TOPBAR ─────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-[#111] border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
            <Zap size={11} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-white font-black uppercase tracking-widest text-sm">
            Bräxor Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── MOBILE BACKDROP ───────────────────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-black/70 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-30 w-64 bg-[#111] border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#111] border-r border-zinc-800 flex-shrink-0">
        <SidebarNav pathname={pathname} />
      </aside>
    </>
  );
}
