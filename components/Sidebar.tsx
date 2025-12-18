"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"; // Necesitas instalar lucide-react o usar iconos SVG

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón Hamburguesa (Solo visible en móvil) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#1f375a] text-white rounded-md shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (Fondo oscuro al abrir en móvil) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <div className={`
        bg-[#1f375a] text-white w-64 h-screen fixed top-0 left-0 p-4 shadow-xl z-[50]
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        <h2 className="text-xl font-bold mb-6 mt-12 lg:mt-0 border-b border-white/10 pb-2">
          Menú
        </h2>

        <nav className="flex flex-col gap-2">
          <a href="/" className="hover:bg-white/10 p-2 rounded transition" onClick={() => setIsOpen(false)}>
            Inicio
          </a>
          <a href="/pedidos" className="hover:bg-white/10 p-2 rounded transition" onClick={() => setIsOpen(false)}>
            Stateos
          </a>
          <a href="/dyes" className="hover:bg-white/10 p-2 rounded transition" onClick={() => setIsOpen(false)}>
            Simulador de dyes
          </a>
        </nav>
      </div>
    </>
  );
}
