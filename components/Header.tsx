//components/header

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useGlobalSession } from '@/hooks/useGlobalSession'

export default function Header() {
  const { isLoggedIn, logout } = useGlobalSession()

  // Evita parpadeo al cargar sesión
  if (isLoggedIn === undefined) return null

  return (
       <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 h-16 bg-black/80 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between h-full">


    
        {/* 🔥 BANNER + LINK A YOUTUBE */}
        
        <Link
          href="https://www.youtube.com/@nilloconline"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center neon-glow"
        >

        <Image
          src="/1729466966609.png"
          alt="Nilloco Online - YouTube Channel"
          width={1920}
          height={400}
          priority
          className="
            h-10 sm:h-12 md:h-14
            w-auto object-contain
            transition-all duration-300
            group-hover:scale-105
            group-hover:brightness-110
          "
        />

        </Link>
        
        {/* 🔘 BOTÓN SESIÓN */}
        <nav className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={() => logout()}   // 👈 FIX DEFINITIVO
              className="
                py-1 px-4 rounded-full text-sm font-semibold
                bg-red-600 hover:bg-red-700
                transition duration-200
              "
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="
                py-1 px-4 rounded-full text-sm font-semibold
                bg-green-500 hover:bg-green-600
                transition duration-200
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
