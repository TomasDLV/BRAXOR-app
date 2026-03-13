import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0a0a0a]">
      
      {/* NUEVO: SEPARADOR METÁLICO SUPERIOR (Justo debajo del Navbar) */}
      <div className="relative w-full h-4 md:h-6 z-30 shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
        <Image 
          src="/images/metal-divider-final.png" 
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

        {/* Dejamos un degradado sutil arriba y abajo para que el texto blanco no se pierda */}
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
            EXPLORAR CATÁLOGO
          </button>
        </div>
      </section>

      {/* SEPARADOR METÁLICO SUPERIOR (con sombras profundas personalizadas) */}
      {/* Agregamos la clase drop-shadow personalizada aquí abajo */}
      <div className="relative w-full h-4 md:h-6 z-30 drop-shadow-[0px_-2px_4px_rgba(0,0,0,0.7)_0px_8px_16px_rgba(0,0,0,0.9)] shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
        <Image 
          src="/images/metal-divider-final.png" 
          alt="Separador metálico superior" 
          fill 
          className="object-cover" 
          priority
        />
      </div>
      {/* 2. GRILLA DE CATEGORÍAS PRINCIPALES */}
      {/* Añadimos un fondo con un patrón muy sutil (carbon fiber o textura oscura) para dar el efecto del mockup */}
      <section className="relative w-full py-20 flex flex-col items-center bg-[#0d0d0d]">
        
        {/* Patrón de fondo opcional (si quieres que no sea liso oscuro) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grilla: 1 columna en móvil, 2 en PC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Tarjeta 1: Llantas */}
            <Link href="/catalogo/llantas" className="group block h-72 md:h-80 bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-[1.5rem] p-8 border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-white leading-tight w-2/3 tracking-wide drop-shadow-md">
                Llantas &<br/>Neumáticos
              </h3>
              {/* Contenedor de la imagen (Ajustar w y h según tu imagen png) */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 md:w-80 md:h-80 group-hover:scale-105 transition-transform duration-500 ease-out">
                {/* REEMPLAZAR ESTE DIV POR TU IMAGEN REAL:
                  <Image src="/images/cat-llantas.png" alt="Llantas" fill className="object-contain" />
                */}
                <div className="w-full h-full bg-zinc-800/50 rounded-full blur-xl absolute inset-0 mix-blend-overlay"></div>
                <div className="w-full h-full border-4 border-dashed border-zinc-700/30 rounded-full flex items-center justify-center text-zinc-600 font-bold uppercase text-sm rotate-[-15deg]">[Imagen Llantas]</div>
              </div>
            </Link>

            {/* Tarjeta 2: Suspensión */}
            <Link href="/catalogo/suspension" className="group block h-72 md:h-80 bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-[1.5rem] p-8 border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-white leading-tight w-2/3 tracking-wide drop-shadow-md">
                Kits de<br/>Suspensión
              </h3>
              <div className="absolute bottom-4 -right-4 w-56 h-56 md:w-72 md:h-72 group-hover:scale-105 transition-transform duration-500 ease-out">
                 {/* REEMPLAZAR ESTE DIV POR TU IMAGEN REAL:
                  <Image src="/images/cat-suspension.png" alt="Suspensión" fill className="object-contain" />
                */}
                 <div className="w-full h-full bg-zinc-800/50 rounded-lg blur-xl absolute inset-0 mix-blend-overlay"></div>
                <div className="w-full h-full border-4 border-dashed border-zinc-700/30 rounded-lg flex items-center justify-center text-zinc-600 font-bold uppercase text-sm rotate-[10deg]">[Imagen Amortiguadores]</div>
              </div>
            </Link>

            {/* Tarjeta 3: Defensas */}
            <Link href="/catalogo/defensas" className="group block h-72 md:h-80 bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-[1.5rem] p-8 border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-white leading-tight w-2/3 tracking-wide drop-shadow-md">
                Defensas &<br/>Estribos
              </h3>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-40 md:h-48 group-hover:translate-y-[-10px] transition-transform duration-500 ease-out">
                 {/* REEMPLAZAR ESTE DIV POR TU IMAGEN REAL:
                  <Image src="/images/cat-defensas.png" alt="Defensas" fill className="object-contain object-bottom" />
                */}
                 <div className="w-full h-full bg-zinc-800/50 rounded-xl blur-xl absolute inset-0 mix-blend-overlay"></div>
                <div className="w-full h-full border-4 border-dashed border-zinc-700/30 rounded-xl flex items-center justify-center text-zinc-600 font-bold uppercase text-sm">[Imagen Defensa]</div>
              </div>
            </Link>

            {/* Tarjeta 4: Iluminación */}
            <Link href="/catalogo/iluminacion" className="group block h-72 md:h-80 bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-[1.5rem] p-8 border border-zinc-800/80 hover:border-zinc-600 transition-all duration-300 relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <h3 className="text-2xl md:text-3xl font-bold uppercase text-white leading-tight w-2/3 tracking-wide drop-shadow-md">
                Iluminación<br/>LED
              </h3>
              <div className="absolute bottom-6 right-6 w-48 h-32 md:w-64 md:h-48 group-hover:scale-105 transition-transform duration-500 ease-out">
                 {/* REEMPLAZAR ESTE DIV POR TU IMAGEN REAL:
                  <Image src="/images/cat-iluminacion.png" alt="Iluminación" fill className="object-contain object-bottom right-0" />
                */}
                 <div className="w-full h-full bg-zinc-800/50 rounded-xl blur-lg absolute inset-0 mix-blend-overlay"></div>
                <div className="w-full h-full border-4 border-dashed border-zinc-700/30 rounded-xl flex items-center justify-center text-zinc-600 font-bold uppercase text-sm text-center">[Imagen Faros]</div>
              </div>
            </Link>

          </div>
        </div>
      
        <h2 className="text-2xl pt-15 font-black text-white uppercase mb-6 tracking-wide text-center">
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
      {/* SEPARADOR METÁLICO SUPERIOR (con sombras profundas personalizadas) */}
      {/* Agregamos la clase drop-shadow personalizada aquí abajo */}
      <div className="relative w-full h-4 md:h-6 z-30 drop-shadow-[0px_-2px_4px_rgba(0,0,0,0.7)_0px_8px_16px_rgba(0,0,0,0.9)] shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
        <Image 
          src="/images/metal-divider-final.png" 
          alt="Separador metálico superior" 
          fill 
          className="object-cover" 
          priority
        />
      </div>
      

      
      {/* 4. MARCAS LOGOS (Placeholder) */}
      <section className="w-full bg-[#383836] py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 text-zinc-500 font-bold uppercase tracking-widest text-sm md:text-xl">
          <span>BFGoodrich</span>
          <span>Warn</span>
          <span>ARB</span>
          <span>Baratec</span>
          <span>Method</span>
        </div>
      </section>
      {/* SEPARADOR METÁLICO INFERIOR */}
      <div className="relative w-full h-4 md:h-6 z-30 drop-shadow-[0px_-2px_4px_rgba(0,0,0,0.7)_0px_8px_16px_rgba(0,0,0,0.9)] shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
        <Image 
          src="/images/metal-divider-final.png" 
          alt="Separador metálico superior" 
          fill 
          className="object-cover" 
          priority
        />
      </div>
      
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