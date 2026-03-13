import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all(
    ["Llantas", "Suspensión", "Defensas", "Iluminación"].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Brands
  await Promise.all(
    ["BFGoodrich", "Baratec", "Rhino", "Method Race Wheels", "Warn", "ARB"].map((name) =>
      prisma.partBrand.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log(
    `✅ Seed completo. Categorías: ${categories.length} | Marcas: 6`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
