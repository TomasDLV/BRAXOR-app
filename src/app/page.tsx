import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import TallerSection from "@/components/home/TallerSection";
import CategorySection from "@/components/home/CategorySection";
import BrandsStrip from "@/components/home/BrandsStrip";
import LocationSection from "@/components/home/LocationSection";
import FinalCTA from "@/components/home/FinalCTA";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { showInHome: true },
      orderBy: { name: "asc" },
    }),
    prisma.partBrand.findMany({
      where: { showInHome: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    href: `/catalogo?categoria=${encodeURIComponent(c.name.toLowerCase())}`,
  }));

  const serializedBrands = brands.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  return (
    <main
      className="flex flex-col relative"
      style={{
        backgroundImage: "url('/images/background_concrete.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* id="hero-section" → SnapController target */}
      <div id="hero-section">
        <HeroSection />
      </div>

      {/* TallerSection excluded from snap — internal sticky scrolltelling */}
      <TallerSection />

      {/* id="categories-section" → SnapController target */}
      <div id="categories-section">
        <CategorySection categories={serialized} />
      </div>

      <BrandsStrip brands={serializedBrands} />

      {/* LocationSection carries id="location-section" internally */}
      <LocationSection />

      {/* id="cta-section" → SnapController target */}
      <div id="cta-section">
        <FinalCTA />
      </div>
    </main>
  );
}
