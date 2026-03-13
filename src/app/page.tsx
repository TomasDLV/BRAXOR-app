import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0a0a0a]">
      
      {/* NUEVO: SEPARADOR METÁLICO SUPERIOR (Justo debajo del Navbar) */}
      <div className="relative w-full h-4 md:h-6 z-30 shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
        <Image 
          src="/images/metal-divider.png" 
          alt="Separador metálico superior" 
          fill 
          className="object-cover" 
          priority
        />
      </div>

      {/* 1. HERO SECTION (Limpio y con el texto posicionado más arriba) */}
      {/* Cambiamos justify-center por justify-start y agregamos pt-16 para empujar el texto hacia arriba */}
      <section className="relative w-full h-[550px] md:h-[650px] flex flex-col items-center justify-start pt-16 md:pt-24 text-center px-4 overflow-hidden">
        
        {/* Tu imagen de fondo (Ahora 100% visible, sin opacidad que la oscurezca) */}
        <Image 
          src="/images/hero-bg.png"
          alt="Camionetas Bräxor Off-Road"
          fill
          priority
          className="object-cover object-center z-0"
        />

        {/* Humo negro eliminado. Solo dejamos un degradado sutil arriba y abajo para que el texto blanco no se pierda */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a] z-10"></div>
        
        {/* Contenido (Texto y Botón) */}
        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Equipamiento que <br /> marca la diferencia.
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl mb-8 font-medium drop-shadow-md">
            Encontrá el repuesto exacto para tu camioneta.
          </p>
          
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-4 px-10 rounded-md uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-1">
            Buscar tu vehículo
          </button>
        </div>
      </section>

      {/* 2. SEPARADOR METÁLICO INFERIOR */}
      <div className="relative w-full h-4 md:h-6 z-30 shadow-[0_-10px_15px_rgba(0,0,0,0.6)] mt-[-1px]">
        <Image 
          src="/images/metal-divider.png" 
          alt="Separador metálico inferior" 
          fill 
          className="object-cover" 
        />
      </div>
      {/* 2. DESTACADOS & NOVEDADES */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
        <h2 className="text-3xl font-black text-white uppercase mb-10 tracking-wide text-center">
          Destacados & Novedades Bräxor
        </h2>

        {/* Grilla de 4 Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          
          {/* Tarjeta de Producto 1 */}
          <div className="bg-[#1a1a1a] border border-zinc-700 hover:border-zinc-500 transition-colors rounded-xl p-4 flex flex-col relative group cursor-pointer">
            {/* Etiqueta [NUEVO] */}
            <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
              [Nuevo]
            </span>
            {/* Espacio para Imagen */}
            <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform"></div>
            {/* Info */}
            <h3 className="text-sm font-bold text-zinc-300 uppercase text-center h-10 line-clamp-2">
              BFGoodrich Tire & Neumáticos
            </h3>
            <div className="w-full h-px bg-yellow-500 my-3 opacity-50"></div>
            <p className="text-xl font-bold text-white text-center">ARS 299.000</p>
          </div>

          {/* Tarjeta de Producto 2 */}
          <div className="bg-[#1a1a1a] border border-zinc-700 hover:border-zinc-500 transition-colors rounded-xl p-4 flex flex-col relative group cursor-pointer">
            <span className="absolute top-3 right-3 bg-zinc-300 text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
              [Destacado]
            </span>
            <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform"></div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase text-center h-10 line-clamp-2">
              Baratec Kits de Suspensión Kit
            </h3>
            <div className="w-full h-px bg-yellow-500 my-3 opacity-50"></div>
            <p className="text-xl font-bold text-white text-center">ARS 375.000</p>
          </div>

          {/* Tarjeta de Producto 3 */}
          <div className="bg-[#1a1a1a] border border-zinc-700 hover:border-zinc-500 transition-colors rounded-xl p-4 flex flex-col relative group cursor-pointer">
            <span className="absolute top-3 right-3 bg-zinc-300 text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
              [Destacado]
            </span>
            <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform"></div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase text-center h-10 line-clamp-2">
              Rhino Bumper
            </h3>
            <div className="w-full h-px bg-yellow-500 my-3 opacity-50"></div>
            <p className="text-xl font-bold text-white text-center">ARS 279.000</p>
          </div>

          {/* Tarjeta de Producto 4 */}
          <div className="bg-[#1a1a1a] border border-zinc-700 hover:border-zinc-500 transition-colors rounded-xl p-4 flex flex-col relative group cursor-pointer">
            <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
              [Nuevo]
            </span>
            <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform"></div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase text-center h-10 line-clamp-2">
              Method Race Wheels
            </h3>
            <div className="w-full h-px bg-yellow-500 my-3 opacity-50"></div>
            <p className="text-xl font-bold text-white text-center">ARS 335.000</p>
          </div>

        </div>
      </section>

      {/* 3. BUSCADOR POR VEHÍCULO */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-20 flex flex-col items-center">
        <h2 className="text-2xl font-black text-white uppercase mb-6 tracking-wide text-center">
          Encontrá tus repuestos por vehículo
        </h2>
        
        {/* Caja oscura del formulario */}
        <div className="bg-[#111111] border border-zinc-700 p-6 md:p-8 rounded-2xl w-full shadow-2xl">
          <form className="flex flex-col md:flex-row gap-4 md:gap-6 items-end w-full">
            
            {/* Select Marca */}
            <div className="flex flex-col w-full">
              <label className="text-zinc-500 text-xs mb-2">| Selecciona Marca</label>
              <select className="w-full bg-[#1a1a1a] border border-zinc-600 text-white rounded-md p-4 focus:outline-none focus:border-yellow-500 cursor-pointer">
                <option value="toyota">(Toyota)</option>
                <option value="ford">(Ford)</option>
                <option value="vw">(Volkswagen)</option>
              </select>
            </div>

            {/* Select Modelo */}
            <div className="flex flex-col w-full">
              <label className="text-zinc-500 text-xs mb-2">| Selecciona Modelo</label>
              <select className="w-full bg-[#1a1a1a] border border-zinc-600 text-white rounded-md p-4 focus:outline-none focus:border-yellow-500 cursor-pointer">
                <option value="hilux">(Hilux)</option>
                <option value="ranger">(Ranger)</option>
                <option value="amarok">(Amarok)</option>
              </select>
            </div>

            {/* Select Año */}
            <div className="flex flex-col w-full">
              <label className="text-zinc-500 text-xs mb-2">| Selecciona Año</label>
              <select className="w-full bg-[#1a1a1a] border border-zinc-600 text-white rounded-md p-4 focus:outline-none focus:border-yellow-500 cursor-pointer">
                <option value="2023">(2023)</option>
                <option value="2022">(2022)</option>
                <option value="2021">(2021)</option>
              </select>
            </div>

            {/* Botón Buscar */}
            <button type="button" className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-4 px-10 rounded-md uppercase tracking-wide transition-colors whitespace-nowrap">
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* SEPARADOR METÁLICO */}
      <div className="w-full h-2 bg-gradient-to-b from-zinc-500 via-zinc-300 to-zinc-600 border-y border-black opacity-80"></div>

      {/* 4. MARCAS LOGOS (Placeholder) */}
      <section className="w-full bg-[#111111] py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 text-zinc-500 font-bold uppercase tracking-widest text-sm md:text-xl">
          <span>BFGoodrich</span>
          <span>Warn</span>
          <span>ARB</span>
          <span>Baratec</span>
          <span>Method</span>
        </div>
      </section>

      {/* 5. FOOTER / MAPA */}
      <section className="relative w-full bg-[#0a0a0a] min-h-[400px] flex flex-col items-center justify-center border-t border-zinc-800 overflow-hidden">
        {/* Placeholder para fondo de mapa de Yerba Buena */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10 mt-10">
          
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight drop-shadow-md">
            <span className="text-yellow-500">📍</span> Próximamente <br /> en Yerba Buena.
          </h2>

          {/* Formulario de Suscripción */}
          <div className="flex w-full md:w-auto mt-6 md:mt-0 shadow-lg">
            <input 
              type="email" 
              placeholder="Dejanos tu email y te avisamos." 
              className="bg-[#111] border border-zinc-700 text-white px-4 py-3 rounded-l-md w-full md:w-64 focus:outline-none focus:border-yellow-500"
            />
            <button className="bg-white text-black font-bold uppercase text-sm px-6 py-3 rounded-r-md hover:bg-gray-200 transition-colors">
              Suscribirse
            </button>
          </div>

        </div>

        {/* Footer final con Logo */}
        {/* Footer final con Logo */}
        <div className="relative z-10 mt-20 pb-8 flex flex-col items-center text-center w-full">
          
          {/* Reemplazamos el texto por tu logo wordmark */}
          <div className="relative w-56 h-16 mb-4">
            <Image 
              src="/images/logo-footer.png" // Asegúrate de tener esta imagen en tu carpeta
              alt="Bräxor Off-Road Logo"
              fill
              className="object-contain object-center"
            />
          </div>

          <p className="text-zinc-500 text-xs mb-4">Contact: srrinfo@braxor.com.ar</p>
          <div className="flex gap-4 text-zinc-500">
            {/* Redes sociales placeholders */}
            <span className="hover:text-white cursor-pointer">f</span>
            <span className="hover:text-white cursor-pointer">IG</span>
            <span className="hover:text-white cursor-pointer">YT</span>
          </div>
        </div>
      </section>

    </main>
  );
}