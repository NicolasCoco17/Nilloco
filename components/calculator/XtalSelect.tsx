"use client";

import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Xtal } from "@/types/xtal"; 

/* =====================
   TIPOS
===================== */
export type Category = "weapon" | "armor" | "add" | "ring" | "normal";

export type XtalSlotState = {
  x1: string;
  x2: string;
};

type XtalSelectProps = {
  label: string;
  value: string;
  xtalKey: "x1" | "x2";
  category: Category;
  list: Xtal[];
  setXtals: Dispatch<SetStateAction<XtalSlotState>>;
  
  // === 1. NUEVA PROP PARA EL ICONO ===
  icon?: string; 
};

/* =====================
   HELPER DE COLORES
===================== */
function getXtalColor(xtal: Xtal, category: Category) {
  if (xtal?.stats?.["Upgrade for"]) {
    return "#aaffaa"; // Color brillante para upgrades en modo oscuro
  }

  // Verificar si es normal (asegurando que type exista y sea array)
  if (xtal?.type && Array.isArray(xtal.type) && xtal.type.some((t: string) => t.toLowerCase() === "normal")) {
    return "#3b82f6"; // Azul brillante (Tailwind blue-500)
  }

  switch (category) {
    case "weapon": return "#ff5555"; // Rojo claro
    case "armor": return "#4ade80";  // Verde claro
    case "add": return "#facc15";    // Amarillo
    case "ring": return "#d946ef";   // Fucsia
    default: return "#ffffff";       // Blanco por defecto
  }
}

/* =====================
   COMPONENTE PRINCIPAL
===================== */
export function XtalSelect({
  label,
  value,
  xtalKey,
  category,
  list,
  setXtals,
  icon, // <--- Recibimos el icono
}: XtalSelectProps) {
  
  const sortedList = useMemo(() => {
    if (!list) return [];
    // Filtrado seguro verificando que 'type' exista
    const teamXtals = list.filter(x => x.type && !x.type.includes("normal"));
    const normalXtals = list.filter(x => x.type && x.type.includes("normal"));
    return [...teamXtals, ...normalXtals];
  }, [list]);

  return (
    <div className="flex flex-col gap-1 text-sm w-full">
      
      {/* === 2. CABECERA CON ICONOS === */}
      <div className="flex items-center gap-1 mb-0.5 ml-1">
        
        {/* Icono del tipo de equipo (Espada, Armadura, etc) */}
        {icon && (
          <img 
            src={icon} 
            alt="" 
            style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
          />
        )}

        {/* Icono de Xtal Normal (Siempre visible) */}
        <img 
          src="/icons/xtal_normal.png" 
          alt="" 
          style={{ width: '16px', height: '16px', objectFit: 'contain', opacity: 0.8 }} 
        />

        {/* Etiqueta de texto (Slot 1 / Slot 2) */}
        <span className="font-bold text-gray-500 text-xs uppercase tracking-wide ml-1">
          {label}
        </span>
      </div>

      {/* === SELECTOR === */}
      <select
        // Ajusté los estilos para modo oscuro basándome en tus capturas previas
        className="border border-gray-600 bg-[#0f0f0f] text-white rounded p-1 w-full text-xs outline-none focus:border-blue-500"
        value={value}
        onChange={(e) =>
          setXtals((prev) => ({
            ...prev,
            [xtalKey]: e.target.value,
          }))
        }
      >
        <option value="-1" style={{ color: '#888' }}>-- Empty --</option>

        {sortedList.map((xtal, index) => {
          const id = xtal.id ?? `noid-${index}`;

          return (
            <option
              key={`${category}-${id}-${index}`}
              value={String(id)}
              style={{ 
                color: getXtalColor(xtal, category), 
                fontWeight: 'bold',
                backgroundColor: '#1a1a1a' // Fondo oscuro para las opciones
              }}
            >
              {xtal.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}