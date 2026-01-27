import { CharacterInput, Status, DetailedStats } from "./types";
import { aggregateStats } from "./aggregator";
import { STAT_ID } from "./statIds";

const trunc = Math.trunc;
const floor = Math.floor;
const ceil = Math.ceil;
const max = Math.max;
const min = Math.min;

// ... (MANTENER TUS FUNCIONES HELPER resSoftCap, getItemBaseDef, getItemStatValue IGUALES) ...

// --- 1. FUNCIÓN MATEMÁTICA (Soft Cap) ---
function resSoftCap(resist: number): number {
  let final_res = 0;
  if (resist > 50) {
    const iteration = resist / 50;
    let temp_res = resist;
    for (let i = 0; i < iteration; i++) {
      if (temp_res <= 50) {
        final_res += temp_res / Math.pow(2, i);
      } else {
        final_res += 50 / Math.pow(2, i);
        temp_res -= 50;
      }
    }
  } else if (resist < -50) {
    const iteration = -resist / 50;
    let temp_res = resist;
    for (let i = 0; i < iteration; i++) {
      if (temp_res >= -50) {
        final_res += temp_res * Math.pow(2, i);
      } else {
        final_res -= 50 * Math.pow(2, i);
        temp_res += 50;
      }
    }
  } else {
    final_res = resist;
  }
  return Math.trunc(final_res);
}

// --- 2. OBTENER DEFENSA BASE (Lee dentro de variants) ---
const getItemBaseDef = (item: any): number => {
  if (!item) return 0;
  
  // Si el item ya tiene base_def en la raíz (ej. procesado previamente)
  if (typeof item.base_def === "number") return item.base_def;
  if (typeof item.def === "number") return item.def;

  // Si está dentro de variants (Tu JSON usa esto: variants.npc.base_def o variants.drop.base_def)
  if (item.variants) {
    // Intenta usar la variante seleccionada, o 'npc', o 'drop', o la primera que encuentre
    const variantKey = item.selectedVariant || "npc"; 
    let variant = item.variants[variantKey] || item.variants["drop"];
    
    // Si no encuentra 'npc' ni 'drop', toma la primera disponible
    if (!variant) {
        const keys = Object.keys(item.variants);
        if (keys.length > 0) variant = item.variants[keys[0]];
    }

    if (variant && typeof variant.base_def === "number") {
      return variant.base_def;
    }
  }
  return 0;
};

// --- 3. OBTENER VALOR DE STAT (Soporta Arrays y Objetos) ---
const getItemStatValue = (item: any, statKey: string): number => {
    if (!item) return 0;

    // 1. Encontrar dónde están los stats
    let stats = item.stats;
    
    // Si no están en la raíz, buscar en variants (tu caso con Archer Quiver / Brigandine)
    if (!stats && item.variants) {
        const variantKey = item.selectedVariant || "npc";
        let variant = item.variants[variantKey] || item.variants["drop"];
        
        if (!variant) {
            const keys = Object.keys(item.variants);
            if (keys.length > 0) variant = item.variants[keys[0]];
        }
        if (variant) stats = variant.stats;
    }

    if (!stats) return 0;

    // 2. Leer el valor dependiendo de si es Array [] o Objeto {}
    
    // CASO ARRAY (Brigandine): [{ key: "ATK", value: 10 }] o ["ATK", 10]
    if (Array.isArray(stats)) {
        const found = stats.find((s: any) => {
            // Soporte para objetos {key, value}
            if (s.key) return s.key === statKey || s.key === statKey.toUpperCase();
            // Soporte para arrays simples ["ATK", 10]
            if (Array.isArray(s)) return s[0] === statKey;
            return false;
        });
        
        if (found) {
            return Number(found.value ?? found[1] ?? 0);
        }
    } 
    // CASO OBJETO (Archer Quiver): { "Accuracy%": 20 }
    else if (typeof stats === "object") {
        // Busca coincidencia exacta o mayúsculas
        const val = stats[statKey] ?? stats[statKey.toUpperCase()];
        return Number(val || 0);
    }

    return 0;
};
// ... (Copialas aquí tal cual las tenías) ...

export function calcCharacterStatus(input: CharacterInput): Status {
  const eq_stats = aggregateStats(input);
  
  const skills = input.skills || {};
  const getStat = (id: number) => eq_stats[id] || 0;

  // --- DATOS BÁSICOS ---
  const mainWeapon = input.equipment.find(e => e.type === "main");
  const subWeapon = input.equipment.find(e => e.type === "sub");
  
  const mainType = input.weaponType;
  const subType = input.subWeaponType || "none";
  const armorType = input.armorType || "normal";
  const isDual = mainType === "1h" && subType === "1h";
  const isShield = subType === "shield";
  const Lv = input.level;

  const normalizeRefine = (ref: any): number => {
    if (typeof ref === "number") return ref;
    if (typeof ref === "string") {
      const map: Record<string, number> = { "E": 10, "D": 11, "C": 12, "B": 13, "A": 14, "S": 15 };
      return map[ref.toUpperCase()] ?? (parseInt(ref) || 0);
    }
    return 0;
  };

  const mainRefine = normalizeRefine(mainWeapon?.refine);
  const subRefine = normalizeRefine(subWeapon?.refine);
  const armorRefine = normalizeRefine(input.equipment.find(e => e.type === "armor")?.refine);
  const addRefine = normalizeRefine(input.equipment.find(e => e.type === "add")?.refine);

  // --- SKILLS VALUES ---
  const godSpeedLvl = skills["God Speed"] || skills["Godspeed"] || 0;
  const bushidoLvl = skills["Bushido"] || 0;
  const twoHandedLvl = skills["Two-Handed"] || skills["Two Handed"] || 0;
  const ninjaSpiritLvl = skills["Ninja Spirit"] || 0;
  const quickAuraLvl = skills["Quick Aura"] || 0;
  
  const martialMasteryLvl = skills["Martial Mastery"] || 0;
  const shieldMasteryLvl = skills["Shield Mastery"] || 0;
  const forceShieldLvl = skills["Force Shield"] || 0;
  const magicalShieldLvl = skills["Magical Shield"] || 0;
  const hpBoostLvl = skills["HP Boost"] || 0;
  const mpBoostLvl = skills["MP Boost"] || 0;
  const attackUpLvl = skills["Attack Up"] || 0;
  const magicUpLvl = skills["Magic Up"] || 0;
  const defenseUpLvl = skills["Defense Up"] || 0;
  const defenseMasteryLvl = skills["Defense Mastery"] || 0;
  const swordConversionLvl = skills["Sword Conversion"] || 0;
  const dualSwordControlLvl = skills["Dual Sword Control"] || 0;
  const samuraiArcheryLvl = skills["Samurai Archery"] || 0;
  const hunterBowgunLvl = skills["Hunter Bowgun"] || 0;
  const frontlinerLvl = skills["Frontliner II"] || 0;

  const isTwoHandedActive = twoHandedLvl > 0 && (
    subType === "none" || 
    (subType === "scroll" && ninjaSpiritLvl === 10)
  );

  let godSpeedBonus = godSpeedLvl;
  if (godSpeedLvl >= 6) godSpeedBonus += (godSpeedLvl - 5);
  
  // ==========================================
  // 1. BASIC STATS
  // ==========================================
  const baseSTR = input.baseStats.STR;
  const baseINT = input.baseStats.INT;
  const baseVIT = input.baseStats.VIT;
  const baseAGI = input.baseStats.AGI;
  const baseDEX = input.baseStats.DEX;

  let CRT = 0, MTL = 0, TEC = 0;
  if (input.personal) {
    if (input.personal.type === "CRT") CRT = input.personal.value;
    if (input.personal.type === "MTL") MTL = input.personal.value;
    if (input.personal.type === "TEC") TEC = input.personal.value;
  }

  const STR = floor(baseSTR * (1 + (getStat(STAT_ID.STR_P) + getStat(213)) / 100) + (getStat(STAT_ID.STR) + getStat(212)));
  const INT = floor(baseINT * (1 + (getStat(STAT_ID.INT_P) + getStat(215)) / 100) + (getStat(STAT_ID.INT) + getStat(214)));
  const VIT = floor(baseVIT * (1 + (getStat(STAT_ID.VIT_P) + getStat(217)) / 100) + (getStat(STAT_ID.VIT) + getStat(216)));
  const AGI = floor(baseAGI * (1 + (getStat(STAT_ID.AGI_P) + getStat(219)) / 100) + (getStat(STAT_ID.AGI) + getStat(218) + godSpeedBonus));
  const DEX = floor(baseDEX * (1 + (getStat(STAT_ID.DEX_P) + getStat(221)) / 100) + (getStat(STAT_ID.DEX) + getStat(220)));

  // ==========================================
  // 2. WEAPON ATK & EQUIPMENT DEF
  // ==========================================
  const mainATK = Number(mainWeapon?.base_atk || 0);
  const mainStability = Number(mainWeapon?.stability || 0);
  const subATK = Number(subWeapon?.base_atk || 0); 
  const subStability = Number(subWeapon?.stability || 0);

  let weaponATKmodifier = 1;
  let weaponATKsubModifier = 1;

  weaponATKmodifier += (mainRefine * mainRefine) / 100;
  weaponATKmodifier += (getStat(STAT_ID.WEAPON_ATK_P) + getStat(278)) / 100;

  const masteryMap: Record<string, number> = {
      "1h": skills["Sword Mastery"], "2h": skills["Sword Mastery"],
      "bow": skills["Shot Mastery"], "bwg": skills["Shot Mastery"],
      "staff": skills["Magic Mastery"], "md": skills["Magic Mastery"],
      "knux": martialMasteryLvl,
      "hb": skills["Halberd Mastery"],
      "kat": bushidoLvl
  };

  if (isDual) {
     weaponATKmodifier += 0.03 * (skills["Dual Sword Mastery"] || 0);
     weaponATKsubModifier += 0.03 * (skills["Sword Mastery"] || 0);
     weaponATKsubModifier += (subRefine * subRefine) / 200;
     weaponATKsubModifier += (getStat(STAT_ID.WEAPON_ATK_P) + getStat(278)) / 100;
  } else if (masteryMap[mainType]) {
     weaponATKmodifier += 0.03 * (masteryMap[mainType] || 0);
  }
  if (isTwoHandedActive) weaponATKmodifier += twoHandedLvl / 100;

  let weaponATK = trunc(mainATK * weaponATKmodifier);
  let weaponATKsub = trunc(subATK * weaponATKsubModifier);
  
  weaponATK += getStat(STAT_ID.WEAPON_ATK) + getStat(277);
  weaponATK += mainRefine;
  weaponATKsub += subRefine;
  weaponATKsub += getStat(STAT_ID.WEAPON_ATK) + getStat(277);

  if (mainType === "barehand") weaponATK += 0.1 * (skills["Unarmed Mastery"] || 0) * Lv;
  if (mainType === "bow" && subType === "arrow") weaponATK += subATK;
  if (mainType === "bow" && subType === "kat") {
      weaponATK += min(mainATK * mainStability / 100, subATK) * 0.1 * samuraiArcheryLvl;
  }
  if (mainType === "bwg" && subType === "arrow") weaponATK += trunc(subATK / 2);

  // --- DEF BASE ---
  const itemBaseDEF = input.equipment.reduce((acc, item) => {
    if (["armor", "add", "special"].includes(item.type)) {
       return acc + getItemBaseDef(item);
    }
    return acc;
  }, 0);
  
  let equipmentDEF = itemBaseDEF; 
  if (isShield) equipmentDEF += subATK; 

  // ==========================================
  // 3. STATS SECUNDARIOS BASE
  // ==========================================
  let stability = mainStability;
  if (mainType === "1h") stability += (STR + DEX * 3) / 40;
  else if (mainType === "2h") stability += DEX * 0.1;
  else if (mainType === "bow") stability += (STR + DEX) / 20;
  else if (mainType === "bwg") stability += STR * 0.05;
  else if (mainType === "staff") stability += STR * 0.05;
  else if (mainType === "md") stability += DEX * 0.1;
  else if (mainType === "knux") stability += DEX * 0.025;
  else if (mainType === "hb") stability += (STR + DEX) / 20;
  else if (mainType === "kat") stability += (STR * 3 + DEX) / 40;
  else if (mainType === "barehand") stability = DEX / 3;

  if (subType === "arrow") stability += subStability;
  if (subType === "dagger") stability += subStability;
  if (mainType === "bow" && subType === "kat" && samuraiArcheryLvl > 0) stability += trunc(subStability / 4);
  if (mainType === "bwg" && subType === "arrow") stability += trunc(subStability / 2);

  stability += getStat(STAT_ID.STABILITY);
  if (isTwoHandedActive) {
      if (mainType === "kat") stability += twoHandedLvl;
      else stability += floor(twoHandedLvl / 2);
  }
  
  let stabilitysub = 0;
  if (isDual) {
      stabilitysub = floor(subStability / 2) + (STR * 3 + AGI * 2) / 50;
      stabilitysub += getStat(STAT_ID.STABILITY);
  }
  
  stability = min(max(1, stability), 100);
  stabilitysub = min(max(0, stabilitysub), 100);

  const baseHit = Lv + DEX;
  const baseCSPD = Lv + AGI * 1.16 + DEX * 2.94;
  const baseCR = trunc(25 + CRT / 3.4);

  // ==========================================
  // 4. DEF & MDEF 
  // ==========================================
  let baseDef = 0, baseMdef = 0;
  if (armorType === "light") {
    baseDef = trunc(Lv * 0.8 + VIT * 0.25 + equipmentDEF);
    baseMdef = trunc(Lv * 0.8 + INT * 0.25 + equipmentDEF); 
  } else if (armorType === "heavy") {
    baseDef = trunc(Lv * 1.2 + VIT * 2 + equipmentDEF);
    baseMdef = trunc(Lv * 1.2 + INT * 2 + equipmentDEF);
  } else if (armorType === "none") { 
    baseDef = trunc(Lv * 0.4 + VIT * 0.1 + equipmentDEF);
    baseMdef = trunc(Lv * 0.4 + INT * 0.1 + equipmentDEF);
  } else { 
    baseDef = Lv + VIT + equipmentDEF;
    baseMdef = Lv + INT + equipmentDEF; 
  }

  let defPct = (getStat(STAT_ID.DEF_P) + getStat(237)) / 100;
  let mdefPct = (getStat(STAT_ID.MDEF_P) + getStat(239)) / 100;

  if (subType === "arrow") { defPct -= 0.25; mdefPct -= 0.25; }
  if (isShield) {
      defPct += (2.5 + 0.5 * forceShieldLvl + floor(forceShieldLvl / 2) * 0.5) / 100;
      mdefPct += (2.5 + 0.5 * magicalShieldLvl + floor(magicalShieldLvl / 2) * 0.5) / 100;
  }

  let finalDEF = trunc(baseDef * (1 + defPct)) + getStat(STAT_ID.DEF) + getStat(236);
  if (isShield) finalDEF -= getItemStatValue(subWeapon, "DEF");
  if (isShield) finalDEF += 5 + floor(forceShieldLvl * 1.5);
  finalDEF += floor((defenseUpLvl + defenseMasteryLvl) * 2.5 / 100 * Lv);

  let finalMDEF = trunc(baseMdef * (1 + mdefPct)) + getStat(STAT_ID.MDEF) + getStat(238);
  if (isShield) finalMDEF += 5 + floor(magicalShieldLvl * 1.5);
  finalMDEF += floor((defenseUpLvl + defenseMasteryLvl) * 2.5 / 100 * Lv);

  // ==========================================
  // 5. HP & MP 
  // ==========================================
  
  // A. BASE HP (Fórmula estándar de Toram)
  const hpBase = trunc((VIT + 22.4) * Lv / 3 + 93);

  // B. PORCENTAJES (%)
  // getStat(STAT_ID.MAXHP_P) trae el total porcentual (ej: -10)
  const totalHpPercent = getStat(STAT_ID.MAXHP_P) + getStat(227) + (hpBoostLvl * 2);
  const hpMultiplier = 1 + (totalHpPercent / 100);

  // C. PLANOS (Flat)
  let totalHpFlat = getStat(STAT_ID.MAXHP) + getStat(226) + (hpBoostLvl * 100);
  
  // Sumar bonos de Skills Pasivas Planas
  totalHpFlat += bushidoLvl * 10;
  if (frontlinerLvl > 0) totalHpFlat += (10 * Lv) + (100 * frontlinerLvl);
  if (isShield) {
      totalHpFlat += (forceShieldLvl * 50);
      totalHpFlat += (magicalShieldLvl * 50);
  }

  // D. CÁLCULO FINAL HP
  // Usamos 'finalHP' porque es lo que usa el objeto de retorno al final
  let finalHP = trunc(hpBase * hpMultiplier) + totalHpFlat;
  
  if (finalHP > 99999) finalHP = 99999;

  // --- CÁLCULO DE MP ---
  // Definimos mpBase aquí
  const mpBase = trunc(100 + Lv + INT / 10 + max(TEC - 1, 0));
  
  let mpPct = 1 + (getStat(STAT_ID.MAXMP_P) + getStat(101)) / 100;
  let finalMP = trunc(mpBase * mpPct) + getStat(STAT_ID.MAXMP) + getStat(228) + (mpBoostLvl * 30);
  finalMP += bushidoLvl * 10;

  // ==========================================
  // 6. HIT, FLEE, CRIT
  // ==========================================
  let hitPct = 1 + (getStat(STAT_ID.ACCURACY_P) + getStat(243)) / 100;
  if (isDual) {
    hitPct = 0.4 + (0.05 + 0.03 * (skills["Dual Sword Mastery"] || 0)) + (0.05 + 0.03 * (dualSwordControlLvl || 0));
    hitPct += (getStat(STAT_ID.ACCURACY_P) + getStat(243)) / 100;
  } else if (isTwoHandedActive) hitPct += twoHandedLvl / 100;
  
  const HIT = trunc(baseHit * hitPct);
  let finalHIT = HIT + getStat(STAT_ID.ACCURACY) + getStat(242) + (skills["Accuracy Up"] || 0);
  finalHIT += bushidoLvl;

  let crPct = (getStat(STAT_ID.CRITICAL_RATE_P) + getStat(251)) / 100;
  let crBaseMod = 1;
  if (isDual) {
      crBaseMod = 0.4 + (0.05 + 0.03 * (skills["Dual Sword Mastery"] || 0)) + (0.05 + 0.03 * (dualSwordControlLvl || 0));
  }
  let finalCR = trunc(trunc(baseCR * crBaseMod) * (1 + crPct)); 
  if (!isDual) finalCR = trunc(trunc(baseCR) * (1 + crPct)); 

  finalCR += getStat(STAT_ID.CRITICAL_RATE) + getStat(250);
  finalCR += ceil(skills["Critical Up"] / 2 || 0);
  if (mainType === "hb") finalCR += ceil(skills["Critical Spear"] / 2 || 0);
  if (isTwoHandedActive) {
      if (mainType === "kat") finalCR += twoHandedLvl;
      else finalCR += ceil(twoHandedLvl / 2);
  }

  let baseFleeBase = 0;
  if (armorType === "light") baseFleeBase = trunc(Lv * 1.25 + AGI * 1.75 + 30);
  else if (armorType === "heavy") baseFleeBase = trunc(Lv * 0.5 + AGI * 0.75 - 15);
  else if (armorType === "none") baseFleeBase = trunc(Lv * 1.5 + AGI * 2 + 75);
  else baseFleeBase = Lv + AGI;
  
  let fleePct = (getStat(STAT_ID.DODGE_P) + getStat(245)) / 100;
  const FLEE = trunc(baseFleeBase * (1 + fleePct));
  let finalFLEE = FLEE + getStat(STAT_ID.DODGE) + (skills["Dodge Up"] || 0) + ninjaSpiritLvl;

  // ==========================================
  // 7. OTROS STATS
  // ==========================================
  let cspdPct = 1 + (getStat(STAT_ID.CSPD_P) + getStat(249)) / 100;
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) {
     cspdPct += (skills["Magic Warrior Mastery"] + max(skills["Magic Warrior Mastery"] - 5, 0)) / 100;
  }
  let finalCSPD = trunc(baseCSPD * cspdPct) + getStat(STAT_ID.CSPD);
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) finalCSPD += skills["Magic Warrior Mastery"] * 10;

  let baseAMPR = 10 + trunc(finalMP / 100);
  const amprMod = 1 + getStat(STAT_ID.ATTACK_MP_RECOVERY_P) / 100;
  let AMPR = trunc(baseAMPR * amprMod);
  if (mainType === "knux") AMPR += floor(skills["Aggravate"] / 2 || 0);
  if (mainType === "barehand") AMPR += floor(skills["Ultima Qi Charge"] / 2 || 0);
  AMPR += getStat(STAT_ID.ATTACK_MP_RECOVERY) + getStat(273);
  if (isDual) AMPR *= 2;

  // ==========================================
  // 8. CÁLCULO ATK / MATK / ASPD
  // ==========================================
  let calcATK = 0, calcMATK = 0, calcASPD = 0;
  let calcATKsub = 0; 

  if (isDual) {
      calcATK = Lv + STR + DEX * 2 + AGI + weaponATK;
      calcATKsub = Lv + STR + AGI * 3 + weaponATKsub;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 100 + Lv + AGI * 4 + (STR + AGI - 1) * 0.2;
  }
  else if (mainType === "1h") {
      calcATK = Lv + STR * 2 + DEX * 2 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 100 + Lv + AGI * 4 + (AGI + STR - 1) * 0.2;
  } 
  else if (mainType === "knux") {
      calcATK = Lv + AGI * 2 + DEX * 0.5 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK * 0.5;
      calcASPD = 120 + Lv + AGI * 4.6 + DEX * 0.1 + STR * 0.1;
  } 
  else if (mainType === "kat") {
      calcATK = Lv + STR * 1.5 + DEX * 2.5 + weaponATK;
      calcMATK = Lv + INT * 1.5 + DEX;
      calcASPD = 200 + Lv + AGI * 3.9 + STR * 0.3;
  } 
  else if (mainType === "staff") {
      calcATK = Lv + STR * 3 + INT + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
      calcASPD = 60.6 + Lv + INT * 0.2 + AGI * 1.8;
  } 
  else if (mainType === "md") {
      calcATK = Lv + INT * 2 + AGI * 2 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
      calcASPD = 90 + Lv + AGI * 4 + (INT - 1) * 0.2;
  } 
  else if (mainType === "bow") {
      calcATK = Lv + STR + DEX * 3 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 75 + Lv + AGI * 3.1 + (AGI + DEX * 2 - 1) * 0.1;
  } 
  else if (mainType === "bwg") {
      calcATK = Lv + DEX * 4 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 30 + Lv + AGI * 2.2 + DEX * 0.2;
  } 
  else if (mainType === "hb") {
      calcATK = Lv + STR * 2.5 + AGI * 1.5 + weaponATK;
      calcMATK = Lv + INT * 2 + DEX + AGI;
      calcASPD = 25 + Lv + AGI * 3.5 + STR * 0.2;
  } 
  else if (mainType === "2h") {
      calcATK = Lv + STR * 3 + DEX + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
      calcASPD = 50 + Lv + AGI * 2 + (AGI + STR - 1) * 0.2;
  } 
  else { 
      calcATK = Lv + STR + 1 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
      calcASPD = 1000 + Lv + AGI * 9.6;
  }

  let atkMod = 1;
  if (subType === "md") atkMod -= 0.15;
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) {
      atkMod += skills["Magic Warrior Mastery"] / 100;
      if (mainType === "1h") atkMod += 0.05;
  }
  
  const checkThreshold = (lvl: number) => (lvl >= 1 ? 0.01 : 0) + (lvl >= 3 ? 0.01 : 0) + (lvl >= 8 ? 0.01 : 0);
  if (masteryMap[mainType]) atkMod += checkThreshold(masteryMap[mainType]);
  if (isDual && skills["Sword Mastery"]) atkMod += checkThreshold(skills["Sword Mastery"]); 
  atkMod += (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;

  if (mainType === "bwg" && subType !== "none" && subType !== "arrow") {
      calcATK += trunc(mainATK * floor(hunterBowgunLvl * 1.5) * 5 / 300);
  }
  
  let finalATK = trunc(calcATK * atkMod);
  finalATK += getStat(STAT_ID.ATK) + getStat(229);
  finalATK += floor(attackUpLvl * 2.5 / 100 * Lv);
  
  let subAtkMod = 1; 
  if (isDual) {
     if (skills["Sword Mastery"]) subAtkMod += checkThreshold(skills["Sword Mastery"]);
     subAtkMod += (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;
  }
  let finalATKsub = trunc(calcATKsub * subAtkMod);

  let matkMod = 1;
  if (subType === "knux") matkMod -= 0.15;
  if (mainType === "staff" || mainType === "md") matkMod += checkThreshold(skills["Magic Mastery"]);
  matkMod += (getStat(STAT_ID.MATK_P) + getStat(232)) / 100;

  let finalMATK = trunc(calcMATK * matkMod);
  finalMATK += getStat(STAT_ID.MATK) + getStat(231);
  finalMATK += floor(magicUpLvl * 2.5 / 100 * Lv);
  
  if (swordConversionLvl > 0) {
      if (mainType === "1h" || mainType === "2h" || mainType === "bwg") {
          finalMATK += trunc((swordConversionLvl * swordConversionLvl) / 100 * weaponATK);
      } else if (mainType === "knux") {
          finalMATK += trunc((swordConversionLvl * swordConversionLvl) / 200 * weaponATK);
      }
  }

  let aspdMod = 1;
  if (armorType === "light") aspdMod += 0.5;
  if (armorType === "heavy") aspdMod -= 0.5;
  if (subType === "shield") aspdMod -= (0.5 - shieldMasteryLvl * 0.05);
  
  aspdMod += (getStat(STAT_ID.ASPD_P) + getStat(247)) / 100;
  if (mainType === "1h" || mainType === "2h") aspdMod += (skills["Quick Slash"] || 0) * 0.01;
  if (mainType === "knux") aspdMod += (skills["Martial Discipline"] || 0) / 100;
  if (quickAuraLvl > 0) aspdMod += (quickAuraLvl * 2.5) / 100;

  let finalASPD = floor(calcASPD * aspdMod);
  finalASPD += getStat(STAT_ID.ASPD) + getStat(246);
  if (mainType === "knux") finalASPD += (skills["Martial Discipline"] || 0) * 10;
  if (mainType === "1h" || mainType === "2h") finalASPD += (skills["Quick Slash"] || 0) * 10;
  if (isDual) finalASPD += 50 * dualSwordControlLvl; 
  if (quickAuraLvl > 0) finalASPD += quickAuraLvl * 50;
  
  const activeGSW = skills["Godspeed Wield"] || 0; 
  if (activeGSW > 0) finalASPD += activeGSW * 90;

  let MotionSpeed = getStat(STAT_ID.MOTION_SPEED) + getStat(276);
  if (activeGSW > 0) MotionSpeed += activeGSW * 3;
  if (finalASPD > 1000) MotionSpeed += trunc((finalASPD - 1000) / 180);
  MotionSpeed = min(MotionSpeed, 50);

  const resFire = resSoftCap(getStat(51) + getStat(262));
  const resWater = resSoftCap(getStat(52) + getStat(263));
  const resWind = resSoftCap(getStat(53) + getStat(264));
  const resEarth = resSoftCap(getStat(54) + getStat(265));
  const resLight = resSoftCap(getStat(55) + getStat(266));
  const resDark = resSoftCap(getStat(56) + getStat(267));
  const resNeutral = resSoftCap(getStat(75) + getStat(261));

  let skillPhysRes = 0;
  let skillMagRes = 0;
  if (isShield) {
      skillPhysRes += forceShieldLvl;
      skillMagRes += magicalShieldLvl;
  }
  const physRes = resSoftCap(getStat(STAT_ID.PHYSICAL_RESISTANCE) + getStat(240) + skillPhysRes);
  const magRes = resSoftCap(getStat(STAT_ID.MAGIC_RESISTANCE) + getStat(241) + skillMagRes);
  
  let godspeedUnsheatheBonus = 0;
  if (isDual) godspeedUnsheatheBonus = Math.floor(godSpeedLvl * 2.5);
  else godspeedUnsheatheBonus = Math.floor(godSpeedLvl * 1.5);

  let ATKcrit = finalATK;
  if (mainType === "kat" && isTwoHandedActive) {
      ATKcrit = Math.floor(finalATK * (1 + twoHandedLvl * 0.05));
  }

  let refineResistance = armorRefine + addRefine;
  if (isShield) refineResistance += subRefine;

  // ==========================================
  // 9. CÁLCULOS MÁGICOS (CRIT & CDMG)
  // ==========================================
  
  // 1. Calcular Daño Crítico Físico Final (Lo sacamos fuera del objeto final para reusarlo)
  // Base 150 + Stats Planos * Multiplicador %
  let finalCDMG = trunc((150 + getStat(STAT_ID.CRITICAL_DAMAGE) + getStat(252)) * (1 + (getStat(STAT_ID.CRITICAL_DAMAGE_P) + getStat(253))/100));
  // Softcap de CDMG: Si pasa de 300, el exceso se divide a la mitad (fórmula estándar)
  if (finalCDMG > 300) finalCDMG = 300 + ((finalCDMG - 300) / 2);

  // 2. Skill Spell Burst (Estallido Mágico)
  const spellBurstLvl = skills["Spell Burst"] || 0;

  // 3. Conversión de Rate Mágico
  // Por defecto es 0. Spell Burst da 2.5% por nivel.
  let mcrConversion = spellBurstLvl * 0.025; 
  
  // Bonus: Si es Bastón (Main) y Elemento Neutro (implícito), +25% conversión (Opcional, según tu referencia v4_7)
  // if (mainType === "staff" && /* check neutral */) mcrConversion += 0.25;

  // 4. Magic Crit Rate (Normal)
  const magicCritRate = floor(finalCR * mcrConversion);

  // 5. Magic Crit Rate (Con Weaken / Debilitar)
  // Weaken añade un 50% (0.5) extra de conversión física
  const magicCritRateWeaken = floor(finalCR * (mcrConversion + 0.5));

  // 6. Magic Critical Damage
  // Fórmula: 100 + (Físico - 100) * (0.5 + SpellBurst%)
  // Base conversión es 50% (0.5)
  const mcdConversion = 0.5 + (spellBurstLvl * 0.025);
  const magicCDMG = floor(100 + (finalCDMG - 100) * mcdConversion);

  const final: DetailedStats = {
    MaxHP: finalHP, 
    MaxMP: finalMP, 
    AMPR,
    DEF: finalDEF, 
    MDEF: finalMDEF, 
    FLEE: finalFLEE, 
    HIT: finalHIT,
    ASPD: finalASPD, 
    CSPD: finalCSPD, 
    MotionSpeed,
    ATK: finalATK, 
    MATK: finalMATK,
    CriticalRate: finalCR,
    CriticalDamage: finalCDMG,
    PhysicalResistance: physRes,
    MagicResistance: magRes,
    DTE_Neutral: 100 + getStat(STAT_ID.DTE_NEUTRAL),
    DTE_Fire: 100 + getStat(STAT_ID.DTE_FIRE),
    DTE_Water: 100 + getStat(STAT_ID.DTE_WATER),
    DTE_Wind: 100 + getStat(STAT_ID.DTE_WIND),
    DTE_Earth: 100 + getStat(STAT_ID.DTE_EARTH),
    DTE_Light: 100 + getStat(STAT_ID.DTE_LIGHT),
    DTE_Dark: 100 + getStat(STAT_ID.DTE_DARK),
    Unsheathe: 100 + getStat(STAT_ID.UNSHEATHE_ATTACK_P) + getStat(280) + godspeedUnsheatheBonus,
    UnsheatheFlat: getStat(STAT_ID.UNSHEATHE_ATTACK) + getStat(279),
    GuardRecharge: getStat(STAT_ID.GUARD_RECHARGE), 
    GuardPower: getStat(STAT_ID.GUARD_POWER), 
    EvasionRecharge: getStat(STAT_ID.EVASION_RECHARGE),
    AilmentResistance: Math.floor(MTL/3.4) + getStat(STAT_ID.AILMENT_RESISTANCE), 
    Aggro: 100 + getStat(STAT_ID.AGGRO),
    PhysicalBarrier: getStat(STAT_ID.PHYSICAL_BARRIER), 
    MagicBarrier: getStat(STAT_ID.MAGIC_BARRIER), 
    FractionalBarrier: getStat(STAT_ID.FRACTIONAL_BARRIER), 
    BarrierCooldown: getStat(STAT_ID.BARRIER_COOLDOWN),
    Reflect: getStat(STAT_ID.REFLECT), 
    RefineReduction: refineResistance,
    ATKcrit: ATKcrit, 
    Stability: stability, 
    SubATK: finalATKsub, 
    SubStability: stabilitysub, 
    PhysicalPierce: getStat(STAT_ID.PHYSICAL_PIERCE), Accuracy: finalHIT,
    MagicStability: trunc((stability + 100)/2), 
    MagicPierce: getStat(STAT_ID.MAGIC_PIERCE),
    MagicCriticalRate: magicCritRate, 
    MagicCriticalDamage: magicCDMG, 
    AdditionalMagic: 100 + getStat(STAT_ID.ADDITIONAL_MAGIC),MagicCriticalRateWeaken: magicCritRateWeaken,
    ShortRangeDmg: 100 + getStat(STAT_ID.SHORT_RANGE_DMG), LongRangeDmg: 100 + getStat(STAT_ID.LONG_RANGE_DMG), 
    Anticipate: getStat(STAT_ID.ANTICIPATE), GuardBreak: getStat(STAT_ID.GUARD_BREAK),
    Element: "Neutral", SubElement: "Neutral",
    RES_Neutral: resNeutral, RES_Fire: resFire, RES_Water: resWater, 
    RES_Wind: resWind, RES_Earth: resEarth, RES_Light: resLight, RES_Dark: resDark,
    NoFlinch: false, NoTumble: false, NoStun: false,
    AdditionalMelee: 0
  };

  return {
    base: {} as any, flat: {} as any, percent: {} as any,
    final: final,
    raw: eq_stats
  };
}