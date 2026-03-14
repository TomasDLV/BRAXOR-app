import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
