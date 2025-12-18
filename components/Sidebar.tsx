// components/Sidebar.tsx
"use client";

export default function Sidebar() {
  return (
    <div className="bg-[#1f375a] text-white w-64 h-screen fixed top-0 left-0 p-4 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Menú</h2>

      <nav className="flex flex-col gap-2">
        <a href="/" className="hover:bg-white/10 p-2 rounded">
          Inicio
        </a>
        <a href="/pedidos" className="hover:bg-white/10 p-2 rounded">
          Stateos 
        </a>
        <a href="/dyes" className="hover:bg-white/10 p-2 rounded">
          Simulador de dyes
        </a>
      </nav>
    </div>
  );
}
