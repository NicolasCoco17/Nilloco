//agregrator
import { CharacterInput } from "./types";
import { getStatIdFromName, STAT_ID } from "./statIds";

const RESTRICTION = {
  SHIELD: 1, KNUCKLE: 2, MAGIC_DEVICE: 4, STAFF: 8, BOWGUN: 16, BOW: 32,
  TWO_HAND_SWORD: 64, ONE_HAND_SWORD: 128, ARMOR: 256, SPECIAL: 512,
  ADDITIONAL: 1024, HALBERD: 2048, KATANA: 8192, HEAVY_ARMOR: 16384,
  LIGHT_ARMOR: 32768, DAGGER: 65536, DUAL_SWORDS: 131072, ARROW: 262144, SCROLL: 524288
};

export function aggregateStats(input: CharacterInput): number[] {
  const eq_stats = new Array(350).fill(0);
  
  // 1. Bitset (Restricciones)
  let bitset = 0;
  const main = input.weaponType;
  
  // Weapons Main
  if (main === "1h") bitset |= RESTRICTION.ONE_HAND_SWORD;
  if (main === "2h") bitset |= RESTRICTION.TWO_HAND_SWORD;
  if (main === "bow") bitset |= RESTRICTION.BOW;
  if (main === "bwg") bitset |= RESTRICTION.BOWGUN;
  if (main === "staff") bitset |= RESTRICTION.STAFF;
  if (main === "md") bitset |= RESTRICTION.MAGIC_DEVICE;
  if (main === "knux") bitset |= RESTRICTION.KNUCKLE;
  if (main === "hb") bitset |= RESTRICTION.HALBERD;
  if (main === "kat") bitset |= RESTRICTION.KATANA;
  
  // Sub Weapons
  const sub = input.subWeaponType || "none";
  if (sub === "shield") bitset |= RESTRICTION.SHIELD;
  if (sub === "dagger") bitset |= RESTRICTION.DAGGER;
  if (sub === "arrow") bitset |= RESTRICTION.ARROW;
  if (sub === "md") bitset |= RESTRICTION.MAGIC_DEVICE; // Ojo: Solo para restricciones, no aplica stats
  if (sub === "scroll") bitset |= RESTRICTION.SCROLL;
  if (main === "1h" && sub === "1h") bitset |= RESTRICTION.DUAL_SWORDS;
  
  // Armor
  // CORRECCIÓN: Siempre activar ARMOR si hay una equipada, además del peso.
  bitset |= RESTRICTION.ARMOR; 
  if (input.armorType === "light") bitset |= RESTRICTION.LIGHT_ARMOR;
  if (input.armorType === "heavy") bitset |= RESTRICTION.HEAVY_ARMOR;

  // Helper para sumar (Versión Corregida)
  const add = (key: string, val: any, appliedTo: number = 0) => {
    // 1. Chequear restricción de equipo (si aplica)
    if (appliedTo !== 0 && !(appliedTo & bitset)) return;

    // --- FIX 1: CONVERTIR STRING A NÚMERO ---
    // Tu JSON trae "-15", esto lo convierte a -15 (número real)
    const num = Number(val);
    
    // Si no es número válido o es 0, salimos
    if (isNaN(num) || num === 0) return;

    // --- FIX 2: NORMALIZAR CLAVE ---
    // Convierte "MaxHP %" -> "maxhp%" (Minúsculas y sin espacios)
    const cleanKey = key.toString().toLowerCase().replace(/\s/g, '');

    // 3. Obtener el ID correcto
    let id = 0;

    // Interceptamos manualmente los casos críticos de HP para asegurar que no fallen
    if (cleanKey === "maxhp%") {
        id = 18; // ID de STAT_ID.MAXHP_P
    } else if (cleanKey === "maxhp") {
        id = 17; // ID de STAT_ID.MAXHP
    } else {
        // Para el resto (ATK, MATK, etc), usamos la función de búsqueda
        id = getStatIdFromName(cleanKey);
    }

    // 4. Sumar al array final
    if (id > 0 && id < 350) {
      eq_stats[id] += num;
    }
  };
  
  // 2. EQUIPAMIENTO
  input.equipment.forEach(item => {
    if (!item) return;

    // --- CORRECCIÓN CRÍTICA: FILTRO DE SUB-ARMA ---
    // En Toram, si la sub-arma es Espada, MD, Knux o Katana, 
    // sus stats NO se suman al personaje (excepto casos raros de pasivas).
    // Solo Daga, Escudo, Flecha y Scroll pasan stats.
    if (item.type === "sub") {
        const allowedSubStats = ["shield", "dagger", "arrow", "scroll"];
        if (!allowedSubStats.includes(sub)) {
            return; // SALTAMOS este ítem, no sumamos sus stats
        }
    }
    // ------------------------------------------------

    // A) Base Stats del Item (Drop/NPC)
    if (!item.isPlayerMode && item.stats) {
      const list = Array.isArray(item.stats) ? item.stats : Object.entries(item.stats);
      list.forEach((entry: any) => {
        const k = entry.key || entry[0];
        const v = entry.value || entry[1];
        const r = entry.applied_to || 0;
        
        // --- PREVENCIÓN DE DOBLE DEFENSA ---
        // Si tu JSON incluye la Defensa Base como un stat "DEF", ignóralo aquí
        // si el ítem es Armor o Additional, porque eso ya se sumó en `calcCharacterStatus` como base.
        if ((item.type === 'armor' || item.type === 'add' || item.type === 'shield') && k === 'DEF') {
             // Asumiendo que 'v' es igual a item.def, lo ignoramos para no sumarlo como bono plano.
             // Si 'v' es un bono verde (ej: DEF+10 en una armadura de 100 base), sí pasalo.
             // Esto depende de tu estructura de datos.
        }

        add(k, v, r);
      });
    }

    // B) Player Custom Stats
    if (item.playerStats) {
      item.playerStats.forEach((s: any) => add(s.key, s.value, 0));
    }

     // C) Xtals (Soporte para Slot1, Slot2 y Arrays antiguos)
    const processXtalStats = (xtal: any) => {
        if (!xtal || !xtal.stats) return;

        // Normalizar si es Array u Objeto
        const list = Array.isArray(xtal.stats) ? xtal.stats : Object.entries(xtal.stats);
        
        list.forEach((entry: any) => {
           // Soporte para estructura {key: "STR", value: 10} o ["STR", 10]
           const k = entry.key || entry[0];
           const v = entry.value || entry[1];
           const r = entry.applied_to || 0; 
           
           // IMPORTANTE: Aquí NO filtramos defensa base porque los Xtals 
           // dan stats "planos" (DEF+10), no defensa base de equipo.
           add(k, v, r);
        });
    };

    // 1. Verificar Slot 1
    if (item.slot1) processXtalStats(item.slot1);

    // 2. Verificar Slot 2
    if (item.slot2) processXtalStats(item.slot2);

    // 3. Verificar array "crystas" (si usas ese formato en el futuro)
    if (item.crystas && Array.isArray(item.crystas)) {
        item.crystas.forEach(processXtalStats);
    }

    // 4. Verificar objeto "xtals" (Legacy/Formato antiguo)
    if (item.xtals && !item.slot1 && !item.slot2) {
      Object.values(item.xtals).forEach(processXtalStats);
    }
  });

  // ... (El resto: Consumibles, Avatares, Buffland, Registlets sigue igual) ...
  // ... Copia tu código existente para las secciones 3 a 6 ...

  // 3. CONSUMIBLES
  if (input.consumables) {
    input.consumables.forEach(c => {
      if(c && c.stats) Object.entries(c.stats).forEach(([k, v]) => add(k, v));
    });
  }

  // 4. AVATARES
  if (input.avatars) {
    input.avatars.forEach(a => add(a.key, a.value));
  }

  // 5. BUFFLAND
  if (input.buffland) {
    input.buffland.forEach(b => add(b.key, b.value));
  }

  // 6. REGISTLETS
  if (input.registlets) {
    input.registlets.forEach(reg => {
      if (!reg || !reg.stat) return;
      const lvl = reg.level || 1;
      let val = 0;
      if (typeof reg.perLevel === 'number') val = reg.perLevel * lvl;
      else if (typeof reg.value === 'number') val = reg.value;
      
      add(reg.stat, val);
    });
  }

  return eq_stats;
}