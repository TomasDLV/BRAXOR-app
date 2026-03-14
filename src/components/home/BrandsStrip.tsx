"use client";

export interface HomeBrand {
  id: string;
  name: string;
}

// Static fallback shown while DB brands load / if none are configured
const FALLBACK_NAMES = [
  "BFGoodrich",
  "WARN",
  "ARB",
  "Old Man Emu",
  "Ironman 4x4",
  "Kings",
  "Bilstein",
  "Fox",
  "Toyo",
  "Mickey Thompson",
];

export default function BrandsStrip({ brands }: { brands: HomeBrand[] }) {
  const names = brands.length > 0 ? brands.map((b) => b.name) : FALLBACK_NAMES;

  // Duplicate for seamless infinite loop (translateX -50% = one full copy)
  const doubled = [...names, ...names];

  return (
    <div className="relative w-full bg-[#080808] border-y border-zinc-900 py-5 overflow-hidden">
      {/* Left / right edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          width: "max-content",
          animation: "braxxor-marquee 32s linear infinite",
          willChange: "transform",
        }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="inline-flex items-center text-zinc-600 font-black uppercase tracking-widest text-xs md:text-sm px-7 hover:text-yellow-500 transition-colors duration-300 cursor-default select-none"
          >
            {name}
            <span
              className="ml-7 text-zinc-800 font-normal"
              aria-hidden="true"
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
