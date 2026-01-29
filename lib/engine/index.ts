import { CharacterInput, Status, DetailedStats } from "./types";
import { aggregateStats } from "./aggregator";
import { STAT_ID } from "./statIds";

const trunc = Math.trunc;
const floor = Math.floor;
const ceil = Math.ceil;
const max = Math.max;
const min = Math.min;

// ==========================================
// CONFIGURACIÓN DE MAESTRÍAS
// ==========================================
const MASTERY_BONUS_CONFIG: Record<string, { atk: boolean; matk: boolean }> = {
  "1h":    { atk: true,  matk: false },
  "2h":    { atk: true,  matk: false },
  "bow":   { atk: true,  matk: false },
  "bwg":   { atk: true,  matk: false },
  "knux":  { atk: true,  matk: false },
  "hb":    { atk: true,  matk: false },
  "kat":   { atk: true,  matk: false },
  "staff": { atk: false, matk: true }, // Staff solo da MATK%
  "md":    { atk: false, matk: true }, // MD solo da MATK%
  "barehand": { atk: false, matk: false }
};

// --- HELPERS BÁSICOS ---
function resSoftCap(resist: number): number {
  let final_res = 0;
  if (resist > 50) {
    const iteration = resist / 50;
    let temp_res = resist;
    for (let i = 0; i < iteration; i++) {
      if (temp_res <= 50) final_res += temp_res / Math.pow(2, i);
      else { final_res += 50 / Math.pow(2, i); temp_res -= 50; }
    }
  } else if (resist < -50) {
    const iteration = -resist / 50;
    let temp_res = resist;
    for (let i = 0; i < iteration; i++) {
      if (temp_res >= -50) final_res += temp_res / Math.pow(2, i);
      else { final_res -= 50 / Math.pow(2, i); temp_res += 50; }
    }
  } else {
    final_res = resist;
  }
  return Math.trunc(final_res);
}

const getItemBaseDef = (item: any): number => {
  if (!item) return 0;
  if (typeof item.base_def === "number") return item.base_def;
  if (typeof item.def === "number") return item.def;
  if (item.variants) {
    const variantKey = item.selectedVariant || "npc"; 
    let variant = item.variants[variantKey] || item.variants["drop"];
    if (!variant) { const keys = Object.keys(item.variants); if (keys.length > 0) variant = item.variants[keys[0]]; }
    if (variant && typeof variant.base_def === "number") return variant.base_def;
  }
  return 0;
};

const getItemStatValue = (item: any, statKey: string): number => {
    if (!item) return 0;
    let stats = item.stats;
    if (!stats && item.variants) {
        const variantKey = item.selectedVariant || "npc";
        let variant = item.variants[variantKey] || item.variants["drop"];
        if (!variant) { const keys = Object.keys(item.variants); if (keys.length > 0) variant = item.variants[keys[0]]; }
        if (variant) stats = variant.stats;
    }
    if (!stats) return 0;
    if (Array.isArray(stats)) {
        const found = stats.find((s: any) => {
            if (s.key) return s.key === statKey || s.key === statKey.toUpperCase();
            if (Array.isArray(s)) return s[0] === statKey;
            return false;
        });
        if (found) return Number(found.value ?? found[1] ?? 0);
    } else if (typeof stats === "object") {
        const val = stats[statKey] ?? stats[statKey.toUpperCase()];
        return Number(val || 0);
    }
    return 0;
};

export function calcCharacterStatus(input: CharacterInput): Status {
  const eq_stats = aggregateStats(input);
  const skills = input.skills || {};
  const getStat = (id: number) => eq_stats[id] || 0;

  // --- CONFIGURACIÓN ---
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

  // --- SKILLS VARIAS ---
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
  const intimidatingPowerLvl = skills["Intimidating Power"] || 0;
  const increasedEnergyLvl = skills["Increased Energy"] || 0;

  const isTwoHandedActive = twoHandedLvl > 0 && (subType === "none" || (subType === "scroll" && ninjaSpiritLvl === 10));
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
      "knux": martialMasteryLvl, "hb": skills["Halberd Mastery"], "kat": bushidoLvl
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
  if (mainType === "bow" && subType === "kat") weaponATK += min(mainATK * mainStability / 100, subATK) * 0.1 * samuraiArcheryLvl;
  if (mainType === "bwg" && subType === "arrow") weaponATK += trunc(subATK / 2);

  const itemBaseDEF = input.equipment.reduce((acc, item) => {
    if (["armor", "add", "special"].includes(item.type)) return acc + getItemBaseDef(item);
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
  const hpBase = trunc((VIT + 22.4) * Lv / 3 + 93);
  const totalHpPercent = getStat(STAT_ID.MAXHP_P) + getStat(227) + (hpBoostLvl * 2);
  const hpMultiplier = 1 + (totalHpPercent / 100);
  let totalHpFlat = getStat(STAT_ID.MAXHP) + getStat(226) + (hpBoostLvl * 100);
  totalHpFlat += bushidoLvl * 10;
  if (frontlinerLvl > 0) totalHpFlat += (10 * Lv) + (100 * frontlinerLvl);
  if (isShield) { totalHpFlat += (forceShieldLvl * 50); totalHpFlat += (magicalShieldLvl * 50); }
  
  let finalHP = trunc(hpBase * hpMultiplier) + totalHpFlat;
  if (finalHP > 99999) finalHP = 99999;

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
  
  const flatHit = getStat(STAT_ID.ACCURACY) + getStat(242) + (skills["Accuracy Up"] || 0) + bushidoLvl;
  const HIT = trunc((baseHit + flatHit) * hitPct);
  let finalHIT = HIT; 

  let crPct = (getStat(STAT_ID.CRITICAL_RATE_P) + getStat(251)) / 100;
  let crBaseMod = 1;
  if (isDual) crBaseMod = 0.4 + (0.05 + 0.03 * (skills["Dual Sword Mastery"] || 0)) + (0.05 + 0.03 * (dualSwordControlLvl || 0));
  
  // Total CR = INT( INT(Base + CRT/3.4) * (1+%) ) + Flat
  let baseCrVal = trunc(baseCR * crBaseMod);
  if (!isDual) baseCrVal = trunc(baseCR);

  let finalCR = trunc(baseCrVal * (1 + crPct)); 

  // Sumar Flats
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
  // 7. OTROS STATS (AMPR CORREGIDO)
  // ==========================================
  let cspdPct = 1 + (getStat(STAT_ID.CSPD_P) + getStat(249)) / 100;
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) {
     cspdPct += (skills["Magic Warrior Mastery"] + max(skills["Magic Warrior Mastery"] - 5, 0)) / 100;
  }
  let finalCSPD = trunc(baseCSPD * cspdPct) + getStat(STAT_ID.CSPD);
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) finalCSPD += skills["Magic Warrior Mastery"] * 10;

  // AMPR: (Base * Multiplier) + Flat
  let baseAMPR = 10 + trunc(finalMP / 100);
  const amprMod = 1 + getStat(STAT_ID.ATTACK_MP_RECOVERY_P) / 100;
  let calculatedAMPR = trunc(baseAMPR * amprMod);

  let flatAMPR = getStat(STAT_ID.ATTACK_MP_RECOVERY) + getStat(273);
  if (mainType === "knux") flatAMPR += floor(skills["Aggravate"] / 2 || 0);
  if (mainType === "barehand") flatAMPR += floor(skills["Ultima Qi Charge"] / 2 || 0);
  
  let AMPR = calculatedAMPR + flatAMPR;
  if (isDual) AMPR *= 2;

  // ==========================================
  // 8. CÁLCULO ATK / MATK (CORREGIDO)
  // ==========================================
  
  // 1. Calcular Bases (Sin modificadores)
  let calcATK = 0, calcMATK = 0;
  let calcATKsub = 0; 

  if (isDual) {
      calcATK = Lv + STR + DEX * 2 + AGI + weaponATK;
      calcATKsub = Lv + STR + AGI * 3 + weaponATKsub;
      calcMATK = Lv + INT * 3 + DEX;
  }
  else if (mainType === "1h") {
      calcATK = Lv + STR * 2 + DEX * 2 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
  } 
  else if (mainType === "knux") {
      calcATK = Lv + AGI * 2 + DEX * 0.5 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK * 0.5;
  } 
  else if (mainType === "kat") {
      calcATK = Lv + STR * 1.5 + DEX * 2.5 + weaponATK;
      calcMATK = Lv + INT * 1.5 + DEX;
  } 
  else if (mainType === "staff") {
      calcATK = Lv + STR * 3 + INT + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
  } 
  else if (mainType === "md") {
      calcATK = Lv + INT * 2 + AGI * 2 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
  } 
  else if (mainType === "bow") {
      calcATK = Lv + STR + DEX * 3 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
  } 
  else if (mainType === "bwg") {
      calcATK = Lv + DEX * 4 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
  } 
  else if (mainType === "hb") {
      calcATK = Lv + STR * 2.5 + AGI * 1.5 + weaponATK;
      calcMATK = Lv + INT * 2 + DEX + AGI;
  } 
  else if (mainType === "2h") {
      calcATK = Lv + STR * 3 + DEX + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
  } 
  else { 
      calcATK = Lv + STR + 1 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
  }

  // --- ACUMULADORES DE MODIFICADORES ---
  let atkPct = 1; 
  let matkPct = 1;
  let atkFlat = 0;
  let matkFlat = 0;

  // A. Sumar Stats del Equipo (Xtals, Armor, etc.)
  atkPct += (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;
  matkPct += (getStat(STAT_ID.MATK_P) + getStat(232)) / 100;
  
  atkFlat += getStat(STAT_ID.ATK) + getStat(229);
  matkFlat += getStat(STAT_ID.MATK) + getStat(231);

  // B. Modificadores de Sub-Arma
  if (subType === "md") atkPct -= 0.15; // CORREGIDO: antes decía atkMod
  if (subType === "knux") matkPct -= 0.15;

  // C. SKILLS PASIVAS (Lógica Centralizada)
  
  // -- 1. Maestrías de Arma (Weapon Mastery) --
    const masteryBonus = (lvl: number) => (lvl >= 1 ? 0.01 : 0) + (lvl >= 3 ? 0.01 : 0) + (lvl >= 8 ? 0.01 : 0);
    const masteryLvl = masteryMap[mainType] || 0;
    const masteryConfig = MASTERY_BONUS_CONFIG[mainType]; 
    
    if (masteryLvl > 0 && masteryConfig) {
        const bonus = masteryBonus(masteryLvl);
        if (masteryConfig.atk) atkPct += bonus;
        if (masteryConfig.matk) matkPct += bonus;
    }
  
  // Dual Sword Mastery (Caso especial: suma ATK)
  if (isDual && skills["Sword Mastery"]) atkPct += masteryBonus(skills["Sword Mastery"]);

  // --- NUEVO PARA BOWTANA: BUSHIDO (SUB-KATANA) ---
  // Bushido da stats incluso si la Katana es Sub-arma
  if (subType === "kat" && skills["Bushido"] > 0) {
      // Bushido da ATK% (y MATK% si fuera main, pero en bowtana nos interesa el ATK)
      atkPct += masteryBonus(skills["Bushido"]);
  }
  
  // Dual Sword Mastery (Caso especial: suma ATK)
  if (isDual && skills["Sword Mastery"]) atkPct += masteryBonus(skills["Sword Mastery"]);

  // -- 2. Skills de Boost (Attack Up / Magic Up) --
  // Fórmula estándar: 2.5% aprox por nivel (LvChar * SkillLv / 40)
  if (attackUpLvl > 0) atkFlat += floor((attackUpLvl * Lv) / 40);
  if (magicUpLvl > 0) matkFlat += floor((magicUpLvl * Lv) / 40);

  // ATK + (LvCharacter * SkillLv / 40)
  if (intimidatingPowerLvl > 0) {
      atkFlat += floor((intimidatingPowerLvl * Lv) / 40);
  }

  // -- Increased Energy (Battle Skill) --
  // MATK + (LvCharacter * SkillLv / 40)
  if (increasedEnergyLvl > 0) {
      matkFlat += floor((increasedEnergyLvl * Lv) / 40);
  }

  // -- 3. Skills Específicas --
  // Magic Warrior Mastery (Magiblade)
    if (subType === "md" && skills["Magic Warrior Mastery"] > 0) {
      const mwmLvl = skills["Magic Warrior Mastery"];

      // 1. Corrección de Penalización de ATK
      // La penalización base por Sub-MD es -15% (definida arriba en el código).
      // Para "Otros": Reduce la penalización a -5%. Necesitamos sumar +10% (0.10).
      // Para "1h Sword": Nulifica la penalización (0%). Necesitamos sumar +15% (0.15).
      
      let recoveryPct = mwmLvl * 0.01; // Nivel 10 = +0.10 (+10%)
      if (mainType === "1h") {
          // Si es 1h, damos un 5% extra para llegar al +15% total a nivel 10
          // Nota: El bonus extra escala, asumiendo 0.5% por nivel extra si no es fijo
          recoveryPct += (mwmLvl * 0.005); 
      }
      atkPct += recoveryPct;

      // 2. Bonus de MATK Plano
      // Según tus datos: MATK +25 a Nivel 10 (2.5 por nivel)
      matkFlat += Math.floor(mwmLvl * 2.5);
  }
  
  // Sword Conversion (Blade Skill)
  if (swordConversionLvl > 0) {
      let conversionRate = 0;
      if (mainType === "1h" || mainType === "2h" || mainType === "bwg") conversionRate = 1;
      else if (mainType === "knux") conversionRate = 0.5;
      
      if (conversionRate > 0) {
          const bonus = trunc((swordConversionLvl * swordConversionLvl) / 100 * weaponATK * conversionRate);
          matkFlat += bonus;
      }
  }
  // Hunter Bowgun (Shot Skill)
  if (mainType === "bwg" && (subType === "none" || subType === "arrow")) {
      const hunterBonus = trunc(mainATK * floor(hunterBowgunLvl * 1.5) * 5 / 300);
      calcATK += hunterBonus; 
  }

  // ============================================
  // CÁLCULO FINAL (Base * % + Flat)
  // ============================================
  
  let finalATK = trunc(calcATK * atkPct) + atkFlat;
  let finalMATK = trunc(calcMATK * matkPct) + matkFlat;
  
  let subAtkMod = 1; 
  if (isDual) {
     if (skills["Sword Mastery"]) subAtkMod += masteryBonus(skills["Sword Mastery"]);
     subAtkMod += (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;
  }
  let finalATKsub = trunc(calcATKsub * subAtkMod);

  // ==========================================
  // 9. ASPD (CALCULO DE SNIPPET)
  // ==========================================
  let statASPD = 0;
  // Fórmulas específicas de Stats según tu texto
  if (mainType === "1h" || mainType === "kat") statASPD = STR * 0.2 + AGI * 4.2;
  else if (mainType === "2h") statASPD = STR * 0.2 + AGI * 2.1;
  else if (mainType === "bow") statASPD = DEX * 0.2 + AGI * 3.1; // Snippet dice 3.1 para Daga/Knux, 2.2 Arco? Revisar. Usaré valores estándar si duda.
  // Estandarizando según conocimiento general + snippet:
  if (mainType === "knux") statASPD = DEX * 0.2 + AGI * 4.6; // Knux suele ser el más rápido
  if (mainType === "staff" || mainType === "md") statASPD = INT * 0.2 + AGI * 1.8;
  if (mainType === "bow") statASPD = DEX * 0.2 + AGI * 3.1;
  if (mainType === "bwg") statASPD = DEX * 0.2 + AGI * 2.2;
  if (mainType === "hb") statASPD = STR * 0.2 + AGI * 3.5;
  if (mainType === "barehand") statASPD = AGI * 9.6;

  // Base constants
  let baseASPD_Constant = 0;
  if (mainType === "1h") baseASPD_Constant = 100;
  if (mainType === "knux") baseASPD_Constant = 120;
  if (mainType === "kat") baseASPD_Constant = 200;
  if (mainType === "staff") baseASPD_Constant = 60;
  if (mainType === "md") baseASPD_Constant = 90;
  if (mainType === "bow") baseASPD_Constant = 75;
  if (mainType === "bwg") baseASPD_Constant = 30;
  if (mainType === "hb") baseASPD_Constant = 25;
  if (mainType === "2h") baseASPD_Constant = 50;
  if (mainType === "barehand") baseASPD_Constant = 1000;

  let baseASPD = baseASPD_Constant + Lv + statASPD;
  
  let aspdMod = 1; // Base 100% implicit in formula below
  if (armorType === "light") aspdMod += 0.5;
  if (armorType === "heavy") aspdMod -= 0.5;
  if (subType === "shield") aspdMod -= (0.5 - shieldMasteryLvl * 0.05);
  
  let aspdPct = (getStat(STAT_ID.ASPD_P) + getStat(247)) / 100;
  if (mainType === "1h" || mainType === "2h") aspdPct += (skills["Quick Slash"] || 0) * 0.01;
  if (mainType === "knux") aspdPct += (skills["Martial Discipline"] || 0) / 100;
  if (quickAuraLvl > 0) aspdPct += (quickAuraLvl * 2.5) / 100;

  // Fórmula Snippet: INT( Base * (1 + %) ) + Flat
  // Ojo: aspdMod (Light Armor +50%) se comporta como porcentaje
  let totalASPD_Multiplier = 1 + aspdPct + (aspdMod - 1); 

  let flatASPD = getStat(STAT_ID.ASPD) + getStat(246);
  if (mainType === "knux") flatASPD += (skills["Martial Discipline"] || 0) * 10;
  if (mainType === "1h" || mainType === "2h") flatASPD += (skills["Quick Slash"] || 0) * 10;
  if (isDual) flatASPD += 50 * dualSwordControlLvl; 
  if (quickAuraLvl > 0) flatASPD += quickAuraLvl * 50;
  
  const activeGSW = skills["Godspeed Wield"] || 0; 
  if (activeGSW > 0) flatASPD += activeGSW * 90;

  let finalASPD = floor(baseASPD * totalASPD_Multiplier) + flatASPD;

  let MotionSpeed = getStat(STAT_ID.MOTION_SPEED) + getStat(276);
  if (activeGSW > 0) MotionSpeed += activeGSW * 3;
  if (finalASPD > 1000) MotionSpeed += trunc((finalASPD - 1000) / 180);
  MotionSpeed = min(MotionSpeed, 50);

  // ==========================================
  // 10. CALCULO ELEMENTO (CORREGIDO PARA LEER CUSTOM STATS)
  // ==========================================
  const getItemElement = (item: any): string => {
      if (!item) return "Neutral";
      
      const sources = [];
      // 1. Stats Base del Item
      if (item.stats) sources.push(item.stats);
      if (item.base_stats) sources.push(item.base_stats);
      
      // 2. Stats de Variantes (Drop/NPC)
      if (item.variants) {
          const vKey = item.selectedVariant || "npc";
          const variant = item.variants[vKey] || item.variants["drop"] || Object.values(item.variants)[0];
          if (variant && variant.stats) sources.push(variant.stats);
      }

      // 3. Stats Personalizados (Player/Custom Stats) -- ¡ESTO FALTABA!
      if (item.playerStats) {
          sources.push(item.playerStats);
      }

      let found = "Neutral";
      
      const checkList = (list: any) => {
          if (!list) return;
          const entries = Array.isArray(list) ? list : Object.entries(list);
          
          entries.forEach((s: any) => {
              // Manejo seguro de key/value
              const k = String(s.key || s[0] || "").toLowerCase().trim();
              const v = String(s.value || s[1] || "").toLowerCase().trim();
              
              // Chequeo por ID directo
              if (k === "62") found = "Fire";
              else if (k === "63") found = "Water";
              else if (k === "64") found = "Wind";
              else if (k === "65") found = "Earth";
              else if (k === "66") found = "Light";
              else if (k === "67") found = "Dark";

              // Chequeo por Texto (ej: "Fire Element")
              // Debe contener "element" y NO ser resistencia ni DTE
              if (k.includes("element") && !k.includes("resistance") && !k.includes("dte")) {
                  const target = (v === "1") ? k : v; // Si valor es 1, miramos la clave
                  
                  if (target.includes("fire")) found = "Fire";
                  else if (target.includes("water")) found = "Water";
                  else if (target.includes("wind")) found = "Wind";
                  else if (target.includes("earth")) found = "Earth";
                  else if (target.includes("light")) found = "Light";
                  else if (target.includes("dark")) found = "Dark";
              }
          });
      };

      sources.forEach(checkList);
      return found;
  };

  let elementStr = getItemElement(mainWeapon);
  if (elementStr === "Neutral") {
      if (getStat(62) > 0) elementStr = "Fire";
      else if (getStat(63) > 0) elementStr = "Water";
      else if (getStat(64) > 0) elementStr = "Wind";
      else if (getStat(65) > 0) elementStr = "Earth";
      else if (getStat(66) > 0) elementStr = "Light";
      else if (getStat(67) > 0) elementStr = "Dark";
  }
  let subElementStr = "Neutral";
  if (subWeapon) {
      subElementStr = getItemElement(subWeapon); 
      if (subType === "arrow" && subElementStr !== "Neutral") {
          elementStr = subElementStr; 
      }
  }

  // ==========================================
  // 11. CRITICAL DMG & MAGIC CRIT
  // ==========================================
  let baseCDMG = 150;
  if (AGI > STR) baseCDMG += floor((STR + AGI) / 10);
  else baseCDMG += floor(STR / 5);

  const flatCD = getStat(STAT_ID.CRITICAL_DAMAGE) + getStat(252);
  
  // --- CORRECCIÓN CRITICAL UP (CD %) ---
  let pctCD = (getStat(STAT_ID.CRITICAL_DAMAGE_P) + getStat(253)) / 100;
  
  // Critical Up da +0.5% CD por nivel (5% a lvl 10)
  if (skills["Critical Up"] > 0) {
      pctCD += (skills["Critical Up"] * 0.5) / 100;
  }
  // -------------------------------------

  // Fórmula: INT( Base * (1+%) ) + Flat
  let finalCDMG = trunc(baseCDMG * (1 + pctCD)) + flatCD;

  // Soft Cap
  if (finalCDMG > 300) finalCDMG = 300 + trunc((finalCDMG - 300) / 2);

  const spellBurstLvl = skills["Spell Burst"] || 0;

  // --- MAGIC CRIT RATE ---
  let mcr = 0;
  if (spellBurstLvl > 0) mcr += floor(finalCR * spellBurstLvl / 40);
  
  if (mainType === "staff" && elementStr === "Neutral") {
      mcr += floor(finalCR / 4);
  }

  const magicCritRate = mcr;
  const magicCritRateWeaken = mcr + floor(finalCR / 2);

  // --- MAGIC CRIT DMG ---
  const mcdConversion = (20 + spellBurstLvl) / 40;
  const magicCDMG = floor(100 + (max(100, finalCDMG) - 100) * mcdConversion);

  // ==========================================
  // 12. DTE & RESISTENCIAS FINALES
  // ==========================================
  let dteNeutral = 100 + getStat(STAT_ID.DTE_NEUTRAL);
  let dteFire    = 100 + getStat(STAT_ID.DTE_FIRE);
  let dteWater   = 100 + getStat(STAT_ID.DTE_WATER);
  let dteWind    = 100 + getStat(STAT_ID.DTE_WIND);
  let dteEarth   = 100 + getStat(STAT_ID.DTE_EARTH);
  let dteLight   = 100 + getStat(STAT_ID.DTE_LIGHT);
  let dteDark    = 100 + getStat(STAT_ID.DTE_DARK);

  if (elementStr === "Fire")  dteEarth += 25;
  if (elementStr === "Water") dteFire += 25;
  if (elementStr === "Wind")  dteWater += 25;
  if (elementStr === "Earth") dteWind += 25;
  if (elementStr === "Light") dteDark += 25;
  if (elementStr === "Dark")  dteLight += 25;

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

  // Cálculos previos para pasivas en el objeto final
  const camouflageLvl = skills["Camouflage"] || 0;     // Shot Skill (Aggro -%)
  const advGuardLvl = skills["Advanced Guard"] || 0;   // Knight Skill (Guard Power %)
  const advEvasionLvl = skills["Advanced Evasion"] || 0; // Assassin Skill (Evasion Recharge %)
  const shieldMasteryVal = skills["Shield Mastery"] || 0; // Guard Rate +1% per lvl

  // Cálculo de Aggro Base
  // Base 100% + Stats + Camouflage (-5% por nivel)
  let aggroVal = 100 + getStat(STAT_ID.AGGRO);
  aggroVal -= (camouflageLvl * 5); // Camouflage reduce 50% a lvl 10

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
    MagicCriticalDamage: magicCDMG,  
    MagicCriticalRate: magicCritRate,
    MagicCriticalRateWeaken: magicCritRateWeaken,

    PhysicalResistance: physRes,
    MagicResistance: magRes,

    Unsheathe: 100 + getStat(STAT_ID.UNSHEATHE_ATTACK_P) + getStat(280) + godspeedUnsheatheBonus,
    UnsheatheFlat: getStat(STAT_ID.UNSHEATHE_ATTACK) + getStat(279),
    
    // --- NUEVOS CÁLCULOS DE GUARDIA/EVASIÓN ---
    // Guard Recharge (Default 0% modifier)
    GuardRecharge: getStat(STAT_ID.GUARD_RECHARGE), 
    
    // Guard Power: Base + Stats + Advanced Guard (1% por nivel)
    GuardPower: getStat(STAT_ID.GUARD_POWER) + advGuardLvl, 
    
    // Evasion Recharge: Base + Stats + Advanced Evasion (1% por nivel)
    EvasionRecharge: getStat(STAT_ID.EVASION_RECHARGE) + advEvasionLvl,
    
    // -------------------------------------------

    AilmentResistance: Math.floor(MTL/3.4) + getStat(STAT_ID.AILMENT_RESISTANCE), 
    
    // Aggro Final
    Aggro: aggroVal,
    
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
    PhysicalPierce: getStat(STAT_ID.PHYSICAL_PIERCE), 
    Accuracy: finalHIT,
    MagicStability: trunc((stability + 100)/2), 
    MagicPierce: getStat(STAT_ID.MAGIC_PIERCE), 
    
    AdditionalMagic: getStat(STAT_ID.ADDITIONAL_MAGIC),     
    
    ShortRangeDmg: 100 + getStat(STAT_ID.SHORT_RANGE_DMG), 
    LongRangeDmg: 100 + getStat(STAT_ID.LONG_RANGE_DMG), 
    Anticipate: getStat(STAT_ID.ANTICIPATE), 
    GuardBreak: getStat(STAT_ID.GUARD_BREAK),
    
    Element: elementStr, 
    SubElement: subElementStr,

    DTE_Neutral: dteNeutral,
    DTE_Fire: dteFire,
    DTE_Water: dteWater,
    DTE_Wind: dteWind,
    DTE_Earth: dteEarth,
    DTE_Light: dteLight,
    DTE_Dark: dteDark,

    RES_Neutral: resNeutral, 
    RES_Fire: resFire, 
    RES_Water: resWater, 
    RES_Wind: resWind, 
    RES_Earth: resEarth, 
    RES_Light: resLight, 
    RES_Dark: resDark,

    NoFlinch: false, NoTumble: false, NoStun: false,
    AdditionalMelee: getStat(STAT_ID.ADDITIONAL_MELEE) 
  };

  return {
    base: {} as any, flat: {} as any, percent: {} as any,
    final: final,
    raw: eq_stats
  };
}