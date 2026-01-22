// src/components/calculator/XtalSelect.tsx
"use client";

import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
// Asegúrate de que esta ruta sea correcta según dónde tengas tus tipos
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
};

/* =====================
   HELPER DE COLORES
   (Movido aquí para que el componente sea autónomo)
===================== */
function getXtalColor(xtal: Xtal, category: Category) {
  // ⚫ Upgrade (prioridad máxima)
  if (xtal?.stats?.["Upgrade for"]) {
    return "#000000";
  }

  // 🔵 Normal Crysta (por tipo, verifica si es array)
  if (Array.isArray(xtal?.type) && xtal.type.some((t: string) => t.toLowerCase() === "normal")) {
    return "#1e90ff"; // azul normal
  }

  // 🎨 Enhancer según slot
  switch (category) {
    case "weapon":
      return "#ff2b2b"; // rojo
    case "armor":
      return "#05ce21"; // verde
    case "add":
      return "#ffd700"; // amarillo
    case "ring":
      return "#9929c5"; // morado
    default:
      return "#000000"; // negro por defecto (para que se lea en fondo blanco)
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
}: XtalSelectProps) {
  
  // 🔹 Ordenar la lista: primero del equipo, luego normales
  const sortedList = useMemo(() => {
    if (!list) return [];
    const teamXtals = list.filter(x => !x.type.includes("normal"));
    const normalXtals = list.filter(x => x.type.includes("normal"));
    return [...teamXtals, ...normalXtals];
  }, [list]);

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold text-gray-700">{label}</span>

      <select
        className="border border-gray-300 rounded p-1 w-full"
        value={value}
        onChange={(e) =>
          setXtals((prev) => ({
            ...prev,
            [xtalKey]: e.target.value, // siempre string
          }))
        }
      >
        <option value="-1">--- none ---</option>

        {sortedList.map((xtal, index) => {
          const id = xtal.id ?? `noid-${index}`;

          return (
            <option
              key={`${category}-${id}-${index}`}
              value={String(id)}
              style={{ color: getXtalColor(xtal, category), fontWeight: '500' }}
            >
              {xtal.name}
            </option>
          );
        })}
      </select>
    </label>
  );
}