"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ArrowLeft, Zap } from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Productos", href: "/admin/productos", icon: Package },
  { label: "Categorías", href: "/admin/categorias", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#111] border-r border-zinc-800 flex-shrink-0">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group ${
                active
                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.5 : 2}
                className="flex-shrink-0"
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div className="px-3 py-5 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-zinc-300 text-sm font-semibold transition-colors hover:bg-zinc-800/40"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Volver a la Tienda
        </Link>
      </div>
    </aside>
  );
}
