import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroller from "@/components/layout/SmoothScroller";

export const metadata: Metadata = {
  title: "BRÄXOR | Equipamiento Off-Road",
  description: "Equipamiento que marca la diferencia. Encontrá llantas, suspensiones y más para tu camioneta en Yerba Buena.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#0d0d0d] text-white">
        <SmoothScroller>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
