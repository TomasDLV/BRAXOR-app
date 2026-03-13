"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-zinc-900 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
      {/* CAMBIO CLAVE: Quitamos h-20 y usamos py-4 para que la barra se adapte al logo */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO MÁS GRANDE */}
        <Link href="/" className="flex items-center z-50">
          {/* Aquí controlamos el tamaño. Si lo quieres MÁS grande, sube estos números (ej: w-56 h-20) */}
          <div className="relative w-48 h-16 md:w-64 md:h-20"> 
            <Image 
              src="/images/logo-header-final.png" 
              alt="Logo Bräxor" 
              fill 
              sizes="(max-width: 768px) 200px, 300px" /* Agregado para que no salga la advertencia amarilla */
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 text-sm font-semibold tracking-widest text-zinc-300 uppercase w-max">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
          <Link href="/marcas" className="hover:text-white transition-colors">Marcas</Link>
          <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
        </nav>

        {/* Iconos y Menú Mobile */}
        <div className="flex items-center gap-4 text-zinc-300 z-50">
          <button className="hidden md:block hover:text-yellow-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-zinc-800 flex flex-col items-center py-8 gap-8 shadow-2xl">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white text-xl font-black uppercase tracking-widest">Inicio</Link>
          <Link href="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-white text-xl font-black uppercase tracking-widest">Catálogo</Link>
          <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="text-white text-xl font-black uppercase tracking-widest">Contacto</Link>
        </div>
      )}
    </header>
  );
}