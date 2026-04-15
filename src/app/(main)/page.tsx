import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import BrandsStrip from "@/components/home/BrandsStrip";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import LocationSection from "@/components/home/LocationSection";
import FinalCTA from "@/components/home/FinalCTA";

export const revalidate = 60; // ISR: regenera en background cada 60s

export default async function Home() {
  const [categories, brands, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      where: { showInHome: true },
      orderBy: { name: "asc" },
    }),
    prisma.partBrand.findMany({
      where: { showInHome: true },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 12,
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
    logoUrl: b.logoUrl,
  }));

  const serializedFeatured = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl,
    price: p.price ? Number(p.price) : null,
    showPrice: p.showPrice,
    isNew: p.isNew,
    brand: { name: p.brand.name },
    category: { name: p.category.name },
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
      {/* Radial gradient overlay — makes glassmorphism visible on the texture */}
      <div className="background-overlay fixed inset-0 pointer-events-none z-0" />

      {/* id="hero-section" → SnapController target */}
      <div id="hero-section">
        <HeroSection />
      </div>

      {/* Destacados — after hero, before chapters */}
      <FeaturedCarousel products={serializedFeatured} />

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
