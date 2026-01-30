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
    <header className="absolute top-0 left-0 lg:left-64 right-0 z-40 h-16 bg-black/80 backdrop-blur-md shadow-lg">
      
      {/* 
         1. Agregamos 'gap-4' para separar la imagen de los botones.
         2. Mantenemos el padding.
      */}
      <div className="flex items-center h-full px-4 pl-14 lg:pl-4 gap-4">

        {/* 🔥 LOGO / BANNER EXPANDIDO */}
         <Link
          href="https://www.youtube.com/@nilloconline"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group 
            relative
            flex-1
            h-full
            /* neon-glow  <-- A veces el glow molesta si la imagen tiene transparencia, actívalo si te gusta */
          "
        >
          <Image
            src="/banner.jpg"
            alt="Nilloco Online"
            fill
            priority
            className="
              object-contain    /* <--- CLAVE: Ajusta la imagen para que quepa entera */
              object-left       /* Alinea el banner a la izquierda (junto al botón de menú si hubiera) */
              transition-all duration-300
              group-hover:scale-105
            "
          />
        </Link>


        {/* 🔘 SESIÓN (Con shrink-0 para que no se aplaste) */}
        <nav className="flex items-center gap-4 shrink-0">
          {isLoggedIn ? (
            <>
              {userNick && (
                <span className="text-sm text-gray-200 hidden sm:block">
                  👋 {userNick}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="
                  py-1 px-4 rounded-full text-sm font-semibold
                  bg-red-600 hover:bg-red-700
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
                bg-green-500 hover:bg-green-600
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