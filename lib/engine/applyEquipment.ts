//lib/engine/applyEquipment

import { Status } from "./types";

// Helper para limpiar nombres de stats (ej: "STR %" -> "STR", type: percent)
function parseStat(key: string, value: number) {
  const isPercent = key.includes("%");
  const cleanKey = key.replace("%", "").trim();
  
  // Mapeos comunes de nombres (Ajusta según tus JSONs)
  const map: Record<string, string> = {
    "Critical Rate": "CR",
    "Critical Damage": "CD",
    "Aggro": "Aggro", // Si lo usas
    // Añade más si tus JSON tienen nombres raros
  };

  return {
    key: (map[cleanKey] || cleanKey) as keyof Status["base"],
    value: Number(value),
    isPercent
  };
}

export function applyEquipment(status: Status, equipment: any[]) {
  if (!equipment) return;

  for (const item of equipment) {
    if (!item) continue;

    // 1. Stats Base del Item (si tiene stats pre-calculados o raw)
    const statsObj = item.stats || item.base_stats || {}; 
    
    // Si tus JSON tienen los stats como array [{key: "STR", value: 10}]
    if (Array.isArray(statsObj)) {
      statsObj.forEach((s: any) => {
        const { key, value, isPercent } = parseStat(s.key || s.stat, s.value);
        if (isPercent) {
          if (status.percent[key] !== undefined) status.percent[key] += value;
        } else {
          if (status.flat[key] !== undefined) status.flat[key] += value;
        }
      });
    } 
    // Si son objeto {"STR": 10}
    else {
      Object.entries(statsObj).forEach(([k, v]) => {
        const { key, value, isPercent } = parseStat(k, Number(v));
        if (isPercent) {
          if (status.percent[key] !== undefined) status.percent[key] += value;
        } else {
          if (status.flat[key] !== undefined) status.flat[key] += value;
        }
      });
    }

    // 2. Aplicar Xtals (si el item ya viene con xtals procesados o raw)
    // Nota: Aquí asumo que 'item.xtals' es el objeto {x1: "id", x2: "id"} que pasamos desde page.tsx
    // Para procesarlos, necesitaríamos buscar sus stats en la lista de xtals.
    // Por simplicidad ahora, asegúrate de que 'applyEquipment' reciba los stats ya sumados o procesa los xtals aquí.
  }
}