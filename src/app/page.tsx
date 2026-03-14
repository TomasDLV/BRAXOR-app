import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import TallerSection from "@/components/home/TallerSection";
import CategorySection from "@/components/home/CategorySection";
import BrandsStrip from "@/components/home/BrandsStrip";
import FinalCTA from "@/components/home/FinalCTA";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    href: `/catalogo?categoria=${encodeURIComponent(c.name.toLowerCase())}`,
  }));

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <HeroSection />
      <TallerSection />
      <CategorySection categories={serialized} />
      <BrandsStrip />
      <FinalCTA />
    </main>
  );
}
