import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import TallerSection from "@/components/home/TallerSection";
import CategorySection from "@/components/home/CategorySection";
import BrandsStrip from "@/components/home/BrandsStrip";
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
    <main className="flex flex-col w-full min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <HeroSection />
      <TallerSection />
      <CategorySection categories={serialized} />
      <BrandsStrip brands={serializedBrands} />
      <FinalCTA />
    </main>
  );
}
