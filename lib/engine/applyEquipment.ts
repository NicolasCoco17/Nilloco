import { Status } from "./types";

// --- 1. Helper para limpiar nombres y valores ---
function parseStat(key: string, value: string | number) {
  // 1. Detectar porcentaje antes de limpiar
  const isPercent = key.includes("%");
  
  // 2. Limpiar nombre: "MaxHP %" -> "MaxHP"
  const cleanKey = key.replace("%", "").trim();
  
  // 3. Mapeo de nombres (Normaliza tus JSONs aquí)
  const map: Record<string, string> = {
    "Critical Rate": "CR",
    "Critical Damage": "CD",
    "Aggro": "Aggro",
    "Attack MP Recovery": "AMPR",
    "Motion Speed": "MotionSpeed",
    // Añade aquí correcciones si tus JSON tienen nombres inconsistentes
  };

  const finalKey = (map[cleanKey] || cleanKey) as keyof Status["base"];
  
  // 4. Asegurar que el valor sea número (tus JSON traen strings "-15")
  const numValue = Number(value);

  return { key: finalKey, value: numValue, isPercent };
}

// --- 2. Función interna para aplicar un objeto de stats al Status ---
function applyStatsObject(status: Status, statsObj: any) {
  if (!statsObj) return;

  // Soporte para Array [{key: "STR", value: 10}]
  if (Array.isArray(statsObj)) {
    statsObj.forEach((s: any) => {
      const { key, value, isPercent } = parseStat(s.key || s.stat, s.value);
      if (isNaN(value)) return;

      if (isPercent) {
        if (status.percent[key] !== undefined) status.percent[key] += value;
      } else {
        if (status.flat[key] !== undefined) status.flat[key] += value;
      }
    });
  } 
  // Soporte para Objeto {"MaxHP %": "-15"} (Tu formato de Xtals)
  else if (typeof statsObj === "object") {
    Object.entries(statsObj).forEach(([k, v]) => {
      const { key, value, isPercent } = parseStat(k, v as string | number);
      if (isNaN(value)) return;

      if (isPercent) {
        if (status.percent[key] !== undefined) status.percent[key] += value;
      } else {
        if (status.flat[key] !== undefined) status.flat[key] += value;
      }
    });
  }
}

// --- 3. Función Principal Exportada ---
export function applyEquipment(status: Status, equipment: any[]) {
  if (!equipment) return;

  for (const item of equipment) {
    if (!item) continue;

    // A. Aplicar stats del ITEM BASE (Arma, Armadura, etc.)
    // Busca en 'stats' (común) o 'base_stats' (a veces usado)
    const baseStats = item.stats || item.base_stats;
    applyStatsObject(status, baseStats);

    // B. Aplicar XTALS (Slots)
    // Asumimos que 'item.slot1' contiene el OBJETO del xtal (con propiedad .stats)
    // Si tu UI solo guarda el ID, necesitarías buscarlo en la lista de xtals aquí, 
    // pero es mejor guardar el objeto completo en el estado "selectedEquipment".
    
    if (item.slot1 && item.slot1.stats) {
      applyStatsObject(status, item.slot1.stats);
    }

    if (item.slot2 && item.slot2.stats) {
      applyStatsObject(status, item.slot2.stats);
    }
    
    // Si usas una estructura de array para crystas:
    if (item.crystas && Array.isArray(item.crystas)) {
        item.crystas.forEach((xtal: any) => {
            if (xtal && xtal.stats) applyStatsObject(status, xtal.stats);
        });
    }
  }
}