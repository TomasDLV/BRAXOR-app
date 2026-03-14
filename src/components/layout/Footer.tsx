import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Mail, Phone, Instagram, Facebook, Youtube } from "lucide-react";
import { prisma } from "@/lib/prisma";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Marcas", href: "/marcas" },
  { label: "Contacto", href: "/contacto" },
];

export default async function Footer() {
  const categories = await prisma.category.findMany({
    where: { showInHome: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return (
    <footer className="relative w-full bg-[#050505] overflow-hidden">
      {/* Yellow brand line — top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

      {/* Subtle concrete noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-zinc-900">

          {/* Col 1: Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className="relative w-48 h-14">
              <Image
                src="/images/logo-footer.png"
                alt="Bräxor Off-Road"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed max-w-[220px] uppercase tracking-widest font-medium">
              El equipamiento Off-Road de élite que tu camioneta merece.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-1">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-yellow-500 hover:border-yellow-500/40 transition-all cursor-pointer"
                >
                  <Icon size={15} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Navegación */}
          <div>
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.25em] font-black mb-5">
              Navegación
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-500 hover:text-white text-sm font-medium transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {categories.length > 0 && (
                <li className="pt-1 border-t border-zinc-900 mt-1">
                  <p className="text-zinc-700 text-[9px] uppercase tracking-[0.2em] font-black mb-2.5">
                    Categorías
                  </p>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/catalogo?categoria=${encodeURIComponent(c.name.toLowerCase())}`}
                      className="block text-zinc-600 hover:text-zinc-300 text-xs font-medium transition-colors mb-1.5"
                    >
                      {c.name}
                    </Link>
                  ))}
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.25em] font-black mb-5">
              Contacto
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-zinc-300 text-sm font-medium">Yerba Buena</p>
                  <p className="text-zinc-600 text-xs">Tucumán, Argentina</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <a
                  href="mailto:Braxorequipamientos@gmail.com"
                  className="text-zinc-400 hover:text-white text-xs transition-colors break-all"
                >
                  Braxorequipamientos@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <a
                  href="https://wa.me/5493816000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white text-xs transition-colors"
                >
                  +54 9 381 600-0000
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Horarios */}
          <div>
            <p className="text-zinc-500 text-[9px] uppercase tracking-[0.25em] font-black mb-5">
              Horarios
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-zinc-300 text-xs font-semibold mb-1">Lunes a Viernes</p>
                  <p className="text-zinc-600 text-xs">09:00 – 18:00 hs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-yellow-500/40 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-zinc-300 text-xs font-semibold mb-1">Sábados</p>
                  <p className="text-zinc-600 text-xs">09:00 – 13:00 hs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="text-zinc-800 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-zinc-700 text-xs font-semibold mb-1">Domingos</p>
                  <p className="text-zinc-800 text-xs">Cerrado</p>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5493816000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 bg-[#25d366]/10 hover:bg-[#25d366] border border-[#25d366]/30 hover:border-[#25d366] text-[#25d366] hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all duration-200"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-zinc-800 text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} Bräxor Off-Road. Todos los derechos reservados.
          </p>
          <p className="text-zinc-800 text-[10px] uppercase tracking-widest">
            Yerba Buena · Tucumán · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
