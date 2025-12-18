'use client'

import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '/components/Sidebar';


export default function HomeHero() {
  return (
    // Usa 'min-h-screen' para asegurar que el contenido se centre verticalmente
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#020617] via-[#020617] to-black">

      {/* Glow background */}
      <div className="absolute inset-0">
        {/* El glow es un elemento de fondo no interactivo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* GRID PRINCIPAL (3 Columnas para Sprites y Contenido) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl w-full px-6 items-center py-16">

        {/* COLUMNA 1: Bloque del Chico (Coco) - Izquierda */}
        {/* Usamos lg:justify-start para que flote a la izquierda en pantallas grandes */}
        <div className="flex justify-center lg:justify-start animate-float-delayed order-2 lg:order-1 mb-6 lg:mb-0">
          <Image
            src="/coco1.png"
            alt="Coco"
            width={280}
            height={280}
            // Sombra azul (Cyan) para Coco
            className="drop-shadow-[0_0_25px_rgba(34,211,238,0.45)] hover:scale-105 transition"
            priority
          />
        </div>

        {/* COLUMNA 2: Center Content */}
        {/* Usamos order-1 para que el contenido central quede arriba en móvil, pero en medio en escritorio */}
        <div className="text-center space-y-6 order-1 lg:order-2">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
            NILLOCO ONLINE
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
            Comunidad, guías y herramientas para jugadores de Toram Online.
            Todo en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="px-8 py-3 rounded-full font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-lg shadow-cyan-500/30"
            >
              Crear usuario
            </Link>

            <Link
              href="/login"
              className="px-8 py-3 rounded-full font-semibold border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition"
            >
              Iniciar Sesión
            </Link>
          </div>

          <div className="flex justify-center mt-2">
            <Link
              href="https://www.youtube.com/@nilloconline"
              target="_blank"
              className="px-10 py-3 rounded-full font-semibold border border-red-500 text-red-400 hover:bg-red-500/10 transition"
            >
              Nuestro canal de YouTube
            </Link>
          </div>
        </div>

        {/* COLUMNA 3: Nilla Sprite - Derecha */}
        {/* Usamos lg:justify-end para que flote a la derecha en pantallas grandes */}
        <div className="flex justify-center lg:justify-end animate-float order-3">
          <Image
            src="/nilla2.png"
            alt="Nilla"
            width={280}
            height={280}
            // Sombra rosa (Pink) para Nilla
            className="drop-shadow-[0_0_25px_rgba(236,72,153,0.45)] hover:scale-105 transition"
            priority
          />
        </div>

      </div> {/* FIN DEL GRID PRINCIPAL */}

    </section>
  )
}
