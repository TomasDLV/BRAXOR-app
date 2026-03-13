import type { Metadata } from "next";
import "./globals.css";
// Aquí estamos importando tu componente Navbar
import Navbar from "../components/layout/Navbar"; 

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
      <body className="antialiased bg-zinc-950 text-slate-50">
        {/* Aquí le decimos a la web que el Navbar siempre va arriba */}
        <Navbar />
        
        {/* Aquí adentro se inyecta tu página de inicio (page.tsx) */}
        {children} 
      </body>
    </html>
  );
}