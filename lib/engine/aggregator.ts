import { CharacterInput } from "./types";
import { getStatIdFromName } from "./statIds";

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
  if (main === "1h") bitset |= RESTRICTION.ONE_HAND_SWORD;
  if (main === "2h") bitset |= RESTRICTION.TWO_HAND_SWORD;
  if (main === "bow") bitset |= RESTRICTION.BOW;
  if (main === "bwg") bitset |= RESTRICTION.BOWGUN;
  if (main === "staff") bitset |= RESTRICTION.STAFF;
  if (main === "md") bitset |= RESTRICTION.MAGIC_DEVICE;
  if (main === "knux") bitset |= RESTRICTION.KNUCKLE;
  if (main === "hb") bitset |= RESTRICTION.HALBERD;
  if (main === "kat") bitset |= RESTRICTION.KATANA;
  
  const sub = input.subWeaponType || "none";
  if (sub === "shield") bitset |= RESTRICTION.SHIELD;
  if (sub === "dagger") bitset |= RESTRICTION.DAGGER;
  if (sub === "arrow") bitset |= RESTRICTION.ARROW;
  if (sub === "md") bitset |= RESTRICTION.MAGIC_DEVICE;
  if (sub === "scroll") bitset |= RESTRICTION.SCROLL;
  if (main === "1h" && sub === "1h") bitset |= RESTRICTION.DUAL_SWORDS;
  
  bitset |= RESTRICTION.ARMOR; 
  if (input.armorType === "light") bitset |= RESTRICTION.LIGHT_ARMOR;
  if (input.armorType === "heavy") bitset |= RESTRICTION.HEAVY_ARMOR;

  // --- PARSEADOR DE CLAVES (KEY) ---
  // Limpia "Staff only:", "Shield only:", etc.
  const getCleanKeyIfAllowed = (rawKey: string): string | null => {
      let key = rawKey.toString();
      const lowerKey = key.toLowerCase();

      // STAFF
      if (lowerKey.includes("staff only")) {
          if (main !== "staff") return null;
          key = key.replace(/staff only[:\s]*/gi, "");
      }
      // SHIELD
      else if (lowerKey.includes("shield only")) {
          if (sub !== "shield") return null;
          key = key.replace(/shield only[:\s]*/gi, "");
      }
      // DAGGER
      else if (lowerKey.includes("dagger only")) {
          if (sub !== "dagger") return null;
          key = key.replace(/dagger only[:\s]*/gi, "");
      }
      // MD (Asumimos Main para stats ofensivos)
      else if (lowerKey.includes("magic device only") || lowerKey.includes("md only")) {
          if (main !== "md") return null; 
          key = key.replace(/(magic device|md) only[:\s]*/gi, "");
      }
      // KNUCKLE
      else if (lowerKey.includes("knuckle only") || lowerKey.includes("knux only")) {
          if (main !== "knux") return null;
          key = key.replace(/(knuckle|knux) only[:\s]*/gi, "");
      }
      // BOWGUN
      else if (lowerKey.includes("bowgun only")) {
          if (main !== "bwg") return null;
          key = key.replace(/bowgun only[:\s]*/gi, "");
      }
      // BOW (Sin bowgun)
      else if (lowerKey.includes("bow only")) {
          if (main !== "bow") return null;
          key = key.replace(/bow only[:\s]*/gi, "");
      }
      // KATANA
      else if (lowerKey.includes("katana only")) {
          if (main !== "kat") return null;
          key = key.replace(/katana only[:\s]*/gi, "");
      }
      // HALBERD
      else if (lowerKey.includes("halberd only")) {
          if (main !== "hb") return null;
          key = key.replace(/halberd only[:\s]*/gi, "");
      }

      return key.trim();
  };

  const add = (rawKey: string, val: any, appliedTo: number = 0) => {
    // 1. Restricción de hardware
    if (appliedTo !== 0 && !(appliedTo & bitset)) return;

    // 2. Limpieza de Clave (Key)
    const cleanKey = getCleanKeyIfAllowed(rawKey);
    if (!cleanKey) return; 

    // 3. PARSEO DE VALOR (Value) -- ¡AQUÍ ESTÁ LA CORRECCIÓN! --
    let num = Number(val);

    // Si no es un número directo (es NaN) y es texto (ej: "Motion Speed % 1")
    if (isNaN(num) && typeof val === 'string') {
        // Buscamos un número al final del string. 
        // Explicación Regex: Busca dígitos, opcionalmente negativos, opcionalmente con decimales, al final ($).
        const match = val.match(/([-\d.]+)$/);
        if (match) {
            num = Number(match[1]);
        }
    }

    // Si sigue siendo inválido o es 0, salimos
    if (isNaN(num) || num === 0) return;




    // 4. Normalización y Búsqueda de ID
    const normalizedKey = cleanKey.toLowerCase().replace(/\s/g, '');
    let id = 0;
    
    if (normalizedKey === "maxhp%") id = 18; 
    else if (normalizedKey === "maxhp") id = 17;
    else id = getStatIdFromName(normalizedKey);

    if (id > 0 && id < 350) {
      eq_stats[id] += num;
    }
  };
  
    // 2. PROCESAR ITEMS
    input.equipment.forEach(item => {
      if (!item) return;

    // Filtro estricto sub-armas
    if (item.type === "sub") {
        const allowedSubStats = ["1h","shield","dagger", "arrow","md", "knux","kat","scroll"];
        if (!allowedSubStats.includes(sub)) return; 
    }

    // Stats Base
    if (item.stats) {
      const list = Array.isArray(item.stats) ? item.stats : Object.entries(item.stats);
      list.forEach((entry: any) => {
        const k = entry.key || entry[0];
        const v = entry.value || entry[1];
        const r = entry.applied_to || 0;
        
        // Evitamos sumar DEF base como stat porcentual/plano, ya que se calcula aparte
        if (!((item.type === 'armor' || item.type === 'add' || item.type === 'shield') && k === 'DEF')) {
             add(k, v, r);
        }
      });
    }

    // Player Stats
    if (item.playerStats) {
      item.playerStats.forEach((s: any) => add(s.key, s.value, 0));
    }

    // Xtals
    const processXtalStats = (xtal: any) => {
        if (!xtal || !xtal.stats) return;
        const list = Array.isArray(xtal.stats) ? xtal.stats : Object.entries(xtal.stats);
        list.forEach((entry: any) => {
           const k = entry.key || entry[0];
           const v = entry.value || entry[1];
           const r = entry.applied_to || 0; 
           add(k, v, r);
        });
    };

    if (item.slot1) processXtalStats(item.slot1);
    if (item.slot2) processXtalStats(item.slot2);
    if (item.crystas && Array.isArray(item.crystas)) item.crystas.forEach(processXtalStats);
    if (item.xtals && !item.slot1 && !item.slot2) Object.values(item.xtals).forEach(processXtalStats);
  });

  // 3. Otros (Consumibles, etc) - Igual que antes
  if (input.consumables) {
    input.consumables.forEach(c => { if(c && c.stats) Object.entries(c.stats).forEach(([k, v]) => add(k, v)); });
  }
  if (input.avatars) input.avatars.forEach(a => add(a.key, a.value));
  if (input.buffland) input.buffland.forEach(b => add(b.key, b.value));
  if (input.registlets) {
    input.registlets.forEach(reg => {
      if (!reg || !reg.stat) return;
      const val = (typeof reg.perLevel === 'number') ? reg.perLevel * (reg.level || 1) : (reg.value || 0);
      add(reg.stat, val);
    });
  }

  return eq_stats;
}