import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      
      {/* 1. HERO SECTION (Fondo de camionetas) */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {<Image 
          src="/images/hero-bg.png" // 2. La ruta empieza desde 'public'
          alt="Camionetas Off-Road Bräxor"
          fill // 3. Hace que la imagen ocupe todo el contenedor
          className="object-cover z-0" // 4. Mantiene la proporción sin deformarse
          priority // 5. Le dice al navegador que cargue esta imagen primero que nada
        />}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-950 opacity-50 z-0"></div>
        
        {/* Contenido del Hero */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">
            Equipamiento que <br /> marca la diferencia.
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl mb-8 font-medium">
            Probá y visualizá tus piezas en tiempo real.
          </p>
          
          {/* Botón Amarillo */}
          <Link href="/catalogo">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-4 px-10 rounded-md uppercase tracking-wide transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Explorar Catálogo
            </button>
          </Link>
        </div>
      </section>

      {/* 2. SEPARADOR METÁLICO */}
      <div className="w-full h-3 bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-500 border-y border-black opacity-80"></div>

      {/* 3. GRILLA DE CATEGORÍAS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1: Llantas */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl h-64 p-6 relative overflow-hidden hover:border-zinc-600 transition-colors group cursor-pointer">
            <h3 className="text-2xl font-bold uppercase text-white w-1/2 leading-tight">Llantas &<br/>Neumáticos</h3>
            {/* Espacio para la imagen de las llantas */}
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-zinc-800 rounded-full opacity-50 group-hover:scale-105 transition-transform"></div>
          </div>

          {/* Tarjeta 2: Suspensión */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl h-64 p-6 relative overflow-hidden hover:border-zinc-600 transition-colors group cursor-pointer">
            <h3 className="text-2xl font-bold uppercase text-white w-1/2 leading-tight">Kits de<br/>Suspensión</h3>
            {/* Espacio para la imagen de la suspensión */}
            <div className="absolute bottom-0 right-0 w-48 h-full bg-zinc-800 opacity-50 group-hover:scale-105 transition-transform"></div>
          </div>

          {/* Tarjeta 3: Defensas */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl h-64 p-6 relative overflow-hidden hover:border-zinc-600 transition-colors group cursor-pointer">
            <h3 className="text-2xl font-bold uppercase text-white w-1/2 leading-tight">Defensas &<br/>Estribos</h3>
            {/* Espacio para la imagen de las defensas */}
            <div className="absolute bottom-4 -right-4 w-56 h-32 bg-zinc-800 opacity-50 group-hover:scale-105 transition-transform"></div>
          </div>

          {/* Tarjeta 4: Iluminación */}
          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl h-64 p-6 relative overflow-hidden hover:border-zinc-600 transition-colors group cursor-pointer">
            <h3 className="text-2xl font-bold uppercase text-white w-1/2 leading-tight">Iluminación<br/>LED</h3>
            {/* Espacio para la imagen de los faros */}
            <div className="absolute bottom-4 right-4 w-40 h-32 bg-zinc-800 opacity-50 group-hover:scale-105 transition-transform"></div>
          </div>

        </div>
      </section>

      {/* Otro separador metálico antes de las marcas */}
      <div className="w-full h-3 bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-500 border-y border-black opacity-80"></div>

    </main>
  );
}