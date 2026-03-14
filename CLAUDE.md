# BRÄXOR - Project Context & Rules

## 1. Identidad del Proyecto
* **Negocio:** BRÄXOR es un Catálogo/Showroom Digital Premium de equipamiento Off-Road (Yerba Buena, Tucumán).
* **Modelo:** NO ES UN E-COMMERCE TRANSACCIONAL. No hay carrito de compras, no hay pasarela de pagos. El objetivo es mostrar el catálogo y que el CTA (Call To Action) sea siempre "Consultar por WhatsApp" o "Contactar".
* **Estilo Visual (UI/UX):** Dark Mode estricto (`bg-[#0a0a0a]`, `bg-[#111]`). Estética agresiva, metálica y premium. Acento en amarillo (`text-yellow-500`). Uso de texturas sutiles, bordes de zinc (`border-zinc-800`) y sombras profundas para simular piezas metálicas.

## 2. Stack Tecnológico Estricto
* **Framework:** Next.js 15+ (App Router estricto).
* **Estilos:** Tailwind CSS v4 (usando `@import "tailwindcss";` en `globals.css`).
* **Base de Datos:** PostgreSQL alojada en Neon.tech.
* **ORM:** Prisma v6.
* **Autenticación:** Auth.js (NextAuth) con Prisma Adapter.
* **Archivos/Imágenes:** UploadThing para alojamiento de fotos en la nube.
* **Animaciones e Íconos:** Framer Motion y Lucide-React.

## 3. Reglas de Desarrollo
* Usa siempre Server Components por defecto. Solo usa `"use client"` cuando haya interactividad (hooks, Framer Motion, onClick).
* Las interacciones con la base de datos se hacen exclusivamente mediante **Server Actions** (nada de API Routes a menos que sea para webhooks de terceros).
* Nunca asumas código antiguo (Pages router o Tailwind v3).
* Escribe código limpio, modular y listo para producción. Si hay un error, maneja las excepciones sin romper la UI (ej. usando Toasts o mensajes de error elegantes).
## 4. Evolución UI/UX: Inmersión y Scrolltelling (Fase 2)
* **Smooth Scrolling:** Obligatorio el uso de `@studio-freight/react-lenis` en el Layout principal (`src/app/layout.tsx`) para garantizar que los efectos de parallax y scrolltelling sean fluidos y de calidad Apple/Tesla.
* **Scrolltelling Avanzado:** Para secciones narrativas (ej. el Home), priorizar layouts `sticky` (`h-[300vh]` con contenedores `sticky top-0`), usando `useScroll` y `useTransform` de `framer-motion` para atar opacidades, escalas y traslaciones directamente al progreso del scroll del usuario.
* **Preparación 3D (React Three Fiber):** El entorno ya cuenta con `@react-three/fiber` y `@react-three/drei`. En futuras iteraciones se integrarán modelos `.gltf` / `.glb` (ej. visualizador de camionetas o repuestos). Diseñar los contenedores previendo espacios `canvas` para 3D.
* **Performance:** Los componentes de scrolltelling pesado o 3D deben aislarse en Client Components (`"use client"`) y cargarse dinámicamente (`next/dynamic`) si es necesario para no penalizar el First Load.