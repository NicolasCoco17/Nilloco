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
  // Weapons
  if (main === "1h") bitset |= RESTRICTION.ONE_HAND_SWORD;
  if (main === "2h") bitset |= RESTRICTION.TWO_HAND_SWORD;
  if (main === "bow") bitset |= RESTRICTION.BOW;
  if (main === "bwg") bitset |= RESTRICTION.BOWGUN;
  if (main === "staff") bitset |= RESTRICTION.STAFF;
  if (main === "md") bitset |= RESTRICTION.MAGIC_DEVICE;
  if (main === "knux") bitset |= RESTRICTION.KNUCKLE;
  if (main === "hb") bitset |= RESTRICTION.HALBERD;
  if (main === "kat") bitset |= RESTRICTION.KATANA;
  // Sub
  const sub = input.subWeaponType || "none";
  if (sub === "shield") bitset |= RESTRICTION.SHIELD;
  if (sub === "dagger") bitset |= RESTRICTION.DAGGER;
  if (sub === "arrow") bitset |= RESTRICTION.ARROW;
  if (sub === "md") bitset |= RESTRICTION.MAGIC_DEVICE;
  if (sub === "scroll") bitset |= RESTRICTION.SCROLL;
  if (main === "1h" && sub === "1h") bitset |= RESTRICTION.DUAL_SWORDS;
  // Armor
  if (input.armorType === "light") bitset |= RESTRICTION.LIGHT_ARMOR;
  if (input.armorType === "heavy") bitset |= RESTRICTION.HEAVY_ARMOR;
  if (input.armorType !== "normal") bitset |= RESTRICTION.ARMOR; // Normal armor tambien cuenta como Armor

  // Helper para sumar
  const add = (key: string, val: any, appliedTo: number = 0) => {
    // 1. Chequear restricción
    if (appliedTo !== 0 && !(appliedTo & bitset)) return;

    // 2. Obtener ID (usando el nuevo normalizador agresivo)
    const id = getStatIdFromName(key);
    if (id <= 0 || id >= 350) return;

    // 3. Convertir valor a número (por si viene string "10%")
    const num = Number(val);
    if (!isNaN(num) && num !== 0) {
      eq_stats[id] += num;
    }
  };

  // 2. EQUIPAMIENTO
  input.equipment.forEach(item => {
    if (!item) return;

    // A) Base Stats del Item (Drop/NPC)
    // Solo si NO estamos en modo player custom (o si queremos sumar ambos, depende de tu lógica)
    // Generalmente: Si es Custom, ignora los stats base del JSON.
    if (!item.isPlayerMode && item.stats) {
      const list = Array.isArray(item.stats) ? item.stats : Object.entries(item.stats);
      list.forEach((entry: any) => {
        // Soporte para formato array [{key, val}] u objeto [key, val]
        const k = entry.key || entry[0];
        const v = entry.value || entry[1];
        const r = entry.applied_to || 0;
        add(k, v, r);
      });
    }

    // B) Player Custom Stats
    if (item.playerStats) {
      item.playerStats.forEach((s: any) => add(s.key, s.value, 0));
    }

    // C) Xtals
    if (item.xtals) {
      Object.values(item.xtals).forEach((xtal: any) => {
        if (!xtal || !xtal.stats) return;
        const list = Array.isArray(xtal.stats) ? xtal.stats : Object.entries(xtal.stats);
        list.forEach((entry: any) => {
           const k = entry.key || entry[0];
           const v = entry.value || entry[1];
           // Algunos JSON de xtals tienen applied_to dentro
           const r = entry.applied_to || 0; 
           add(k, v, r);
        });
      });
    }
  });

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