'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useGlobalSession } from '@/hooks/useGlobalSession'

export default function Header() {
  const { isLoggedIn, userNick, logout } = useGlobalSession()

  if (isLoggedIn === undefined) return null

  const handleLogout = () => {
    void logout('/')
  }

  return (
    <header className="absolute top-0 left-0 lg:left-64 right-0 z-40 h-20 bg-black/90 shadow-lg group">
      
      {/* --------------------------------------------------------- */}
      {/* CAPA 1: FONDO VISUAL (YA NO ES UN LINK)                   */}
      {/* Cambiamos <Link> por <div> para que no sea clickeable     */}
      {/* --------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 block w-full h-full neon-glow overflow-hidden">
        <Image
          src="/banner3.png"
          alt="Nilloco Online Banner"
          fill
          priority
          className="
            object-cover         /* IMPORTANTE: Llenar de lado a lado */
            object-[center_30%]  /* Ajuste vertical */
            transition-all duration-500
            opacity-70
            group-hover:scale-105
            group-hover:opacity-100
          "
        />
        {/* Degradado */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* --------------------------------------------------------- */}
      {/* CAPA 2: CONTENIDO (LINK Y BOTONES)                        */}
      {/* --------------------------------------------------------- */}
      <div className="relative z-10 flex items-center justify-between h-full px-4 gap-4">

        {/* 🟢 AQUÍ ESTÁ EL LINK AHORA (SOLO EN EL TEXTO) */}
        <Link 
          href="https://www.youtube.com/@nilloconline"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2 
            text-white/90 
            hover:text-white 
            transition-colors
            cursor-pointer
            group/link           /* Grupo interno para animar icono y texto juntos */
          "
        >
          {/* Icono de YouTube */}
          <svg className="w-5 h-5 fill-current text-red-600 transition-transform group-hover/link:scale-110" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase group-hover/link:underline underline-offset-4 decoration-red-600">
            Link a YouTube
          </span>
        </Link>

        {/* 🔴 BOTONES DE SESIÓN */}
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {userNick && (
                <span className="text-sm text-white font-bold drop-shadow-md hidden sm:block">
                  👋 {userNick}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="
                  py-1 px-4 rounded-full text-sm font-semibold
                  bg-red-600 hover:bg-red-700
                  text-white shadow-lg
                  transition duration-200
                  whitespace-nowrap
                "
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="
                py-1 px-4 rounded-full text-sm font-semibold
                bg-green-600 hover:bg-green-500
                text-white shadow-lg
                transition duration-200
                whitespace-nowrap
              "
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>

      </div>
    </header>
  )
}