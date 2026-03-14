"use client";

import Image from "next/image";

export interface HomeBrand {
  id: string;
  name: string;
  logoUrl?: string | null;
}

const FALLBACK_NAMES: HomeBrand[] = [
  { id: "1", name: "BFGoodrich" },
  { id: "2", name: "WARN" },
  { id: "3", name: "ARB" },
  { id: "4", name: "Old Man Emu" },
  { id: "5", name: "Ironman 4x4" },
  { id: "6", name: "Kings" },
  { id: "7", name: "Bilstein" },
  { id: "8", name: "Fox" },
  { id: "9", name: "Toyo" },
  { id: "10", name: "Mickey Thompson" },
];

function BrandItem({ brand }: { brand: HomeBrand }) {
  if (brand.logoUrl) {
    return (
      <div className="relative w-24 h-18 flex-shrink-0">
        <Image
          src={brand.logoUrl}
          alt={brand.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    );
  }
  return (
    <span className="text-zinc-600 font-black uppercase tracking-widest text-xs select-none">
      {brand.name}
    </span>
  );
}

export default function BrandsStrip({ brands }: { brands: HomeBrand[] }) {
  const items = brands.length > 0 ? brands : FALLBACK_NAMES;
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full bg-[#080808] border-y border-zinc-900 py-5 overflow-hidden">

      {/* ── DESKTOP: grid estático ─────────────────────────────────── */}
      <div className="hidden md:flex items-center justify-center flex-wrap gap-x-12 gap-y-6 px-16">
        {items.map((brand) => (
          <BrandItem key={brand.id} brand={brand} />
        ))}
      </div>

      {/* ── MOBILE: marquee infinito ───────────────────────────────── */}
      <div className="md:hidden relative">
        {/* Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center whitespace-nowrap"
          style={{
            width: "max-content",
            animation: "braxxor-marquee 32s linear infinite",
            willChange: "transform",
          }}
        >
          {doubled.map((brand, i) => (
            <span key={i} className="inline-flex items-center px-6">
              <BrandItem brand={brand} />
              <span className="ml-6 text-zinc-800" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
