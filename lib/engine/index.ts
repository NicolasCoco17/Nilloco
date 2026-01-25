import { CharacterInput, Status, DetailedStats } from "./types";
import { aggregateStats } from "./aggregator";
import { STAT_ID } from "./statIds";

const trunc = Math.trunc;
const floor = Math.floor;
const ceil = Math.ceil;
const max = Math.max;
const min = Math.min;

// --- HELPER: SOFT CAP FORMULA (Original de Coryn) ---
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
  return trunc(final_res);
}

export function calcCharacterStatus(input: CharacterInput): Status {
  // 1. Obtener stats acumulados
  const eq_stats = aggregateStats(input);
  const skills = input.skills || {};
  const getStat = (id: number) => eq_stats[id] || 0;

  // --- EXTRACCIÓN DE DATOS ---
  const mainWeapon = input.equipment.find(e => e.type === "main");
  const subWeapon = input.equipment.find(e => e.type === "sub");
  
  const mainType = input.weaponType;
  const subType = input.subWeaponType || "none";
  const armorType = input.armorType || "normal";
  const isDual = mainType === "1h" && subType === "1h";
  const isShield = subType === "shield";

  // --- REFINAMIENTO ---
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

  // --- SKILLS ---
  const godSpeedLvl = skills["God Speed"] || skills["Godspeed"] || 0;
  const bushidoLvl = skills["Bushido"] || 0;
  const twoHandedLvl = skills["Two-Handed"] || skills["Two Handed"] || 0;
  const ninjaSpiritLvl = skills["Ninja Spirit"] || 0;
  const quickAuraLvl = skills["Quick Aura"] || 0;
  const frontlinerLvl = skills["Frontliner II"] || 0;
  
  const martialMasteryLvl = skills["Martial Mastery"] || 0;
  const shieldMasteryLvl = skills["Shield Mastery"] || 0;
  const forceShieldLvl = skills["Force Shield"] || 0;
  const magicalShieldLvl = skills["Magical Shield"] || 0;
  const lightArmorMasteryLvl = skills["Light Armor Mastery"] || 0;
  const hpBoostLvl = skills["HP Boost"] || 0;
  const mpBoostLvl = skills["MP Boost"] || 0;
  const attackUpLvl = skills["Attack Up"] || 0;
  const magicUpLvl = skills["Magic Up"] || 0;
  const defenseUpLvl = skills["Defense Up"] || 0;
  const defenseMasteryLvl = skills["Defense Mastery"] || 0;

  const isTwoHandedActive = twoHandedLvl > 0 && (
    subType === "none" || 
    (subType === "scroll" && ninjaSpiritLvl === 10)
  );

  // ==========================================
  // 1. STAT BONUSES FROM SKILL (Pre-calc)
  // ==========================================
  let godSpeedBonus = godSpeedLvl;
  if (godSpeedLvl >= 6) godSpeedBonus += (godSpeedLvl - 5);
  
  // ==========================================
  // 2. BASIC STATS
  // ==========================================
  const Lv = input.level;
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

  // Formula: floor(Base * (1 + %) + Flat)
  const STR = floor(baseSTR * (1 + (getStat(STAT_ID.STR_P) + getStat(213)) / 100) + (getStat(STAT_ID.STR) + getStat(212)));
  const INT = floor(baseINT * (1 + (getStat(STAT_ID.INT_P) + getStat(215)) / 100) + (getStat(STAT_ID.INT) + getStat(214)));
  const VIT = floor(baseVIT * (1 + (getStat(STAT_ID.VIT_P) + getStat(217)) / 100) + (getStat(STAT_ID.VIT) + getStat(216)));
  // God Speed modifies eq_stats[9] (AGI Flat)
  const AGI = floor(baseAGI * (1 + (getStat(STAT_ID.AGI_P) + getStat(219)) / 100) + (getStat(STAT_ID.AGI) + getStat(218) + godSpeedBonus));
  const DEX = floor(baseDEX * (1 + (getStat(STAT_ID.DEX_P) + getStat(221)) / 100) + (getStat(STAT_ID.DEX) + getStat(220)));

  // ==========================================
  // 3. WEAPON ATK & EQUIPMENT DEF
  // ==========================================
  const mainATK = Number(mainWeapon?.base_atk || 0);
  const subATK = Number(subWeapon?.base_atk || 0); 

  // WEAPON ATK MODIFIER
  let weaponATKmodifier = 1;
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
  } else if (masteryMap[mainType]) {
     weaponATKmodifier += 0.03 * (masteryMap[mainType] || 0);
  }

  if (isTwoHandedActive) {
      weaponATKmodifier += twoHandedLvl / 100;
  }

  let weaponATK = trunc(mainATK * weaponATKmodifier);
  
  weaponATK += getStat(STAT_ID.WEAPON_ATK) + getStat(277);
  weaponATK += mainRefine;

  if (mainType === "barehand") weaponATK += 0.1 * (skills["Unarmed Mastery"] || 0) * Lv;

  // Sub Weapon additions
  if (mainType === "bow" && subType === "arrow") weaponATK += subATK;
  if (mainType === "bwg" && subType === "arrow") weaponATK += trunc(subATK / 2);

  // EQUIPMENT DEF (Armor + Add + Special + Shield Base DEF)
  const itemBaseDEF = input.equipment.reduce((acc, item) => acc + (Number(item.def) || 0), 0);
  let equipmentDEF = itemBaseDEF; 
  // IMPORTANT FROM SNIPPET: if(sub=="Shield") equipmentDEF += subATK;
  if (isShield) equipmentDEF += subATK;

  // ==========================================
  // 4. BASE SECONDARY STATS
  // ==========================================
  let stability = (mainWeapon?.stability || 0);
  if (subType === "arrow") stability += (subWeapon?.stability || 0);
  stability += getStat(STAT_ID.STABILITY);
  if (isTwoHandedActive) {
      if (mainType === "kat") stability += twoHandedLvl;
      else stability += floor(twoHandedLvl / 2);
  }
  stability = min(max(1, stability), 100);

  const baseHit = Lv + DEX;
  const baseCSPD = Lv + AGI * 1.16 + DEX * 2.94;
  let hpBase = trunc((VIT + 22.4) * Lv / 3 + 93);
  let mpBase = trunc(100 + Lv + INT / 10 + max(TEC - 1, 0));
  const baseCR = trunc(25 + CRT / 3.4);

  // ==========================================
  // 5. DEF, MDEF, FLEE (BASE FORMULAS)
  // ==========================================
  let baseDef = 0, baseMdef = 0, baseFlee = 0;
  
  if (armorType === "light") {
    baseDef = trunc(Lv * 0.8 + VIT * 0.25 + equipmentDEF);
    baseMdef = trunc(Lv * 0.8 + INT * 0.25 + equipmentDEF); 
    baseFlee = trunc(Lv * 1.25 + AGI * 1.75 + 30);
  } else if (armorType === "heavy") {
    baseDef = trunc(Lv * 1.2 + VIT * 2 + equipmentDEF);
    baseMdef = trunc(Lv * 1.2 + INT * 2 + equipmentDEF);
    baseFlee = trunc(Lv * 0.5 + AGI * 0.75 - 15);
  } else if (armorType === "none") { // Without Armor
    baseDef = trunc(Lv * 0.4 + VIT * 0.1 + equipmentDEF);
    baseMdef = trunc(Lv * 0.4 + INT * 0.1 + equipmentDEF);
    baseFlee = trunc(Lv * 1.5 + AGI * 2 + 75);
  } else { // Normal
    baseDef = Lv + VIT + equipmentDEF;
    baseMdef = Lv + INT + equipmentDEF; 
    baseFlee = Lv + AGI;
  }

  // ==========================================
  // 6. APPLY MODIFIERS (PERCENT)
  // ==========================================
  
  // HIT %
  let hitPct = 1 + (getStat(STAT_ID.ACCURACY_P) + getStat(243)) / 100;
  if (isTwoHandedActive) hitPct += twoHandedLvl / 100;
  // Strong Chase Attack omitted
  const HIT = trunc(baseHit * hitPct);

  // CSPD %
  let cspdPct = 1 + (getStat(STAT_ID.CSPD_P) + getStat(249)) / 100;
  if (subType === "md" && skills["Magic Warrior Mastery"] > 0) {
     cspdPct += (skills["Magic Warrior Mastery"] + max(skills["Magic Warrior Mastery"] - 5, 0)) / 100;
  }
  const CSPD = trunc(baseCSPD * cspdPct) + getStat(STAT_ID.CSPD);

  // HP %
  let hpPct = 1 + (getStat(STAT_ID.MAXHP_P) + getStat(227)) / 100;
  hpPct += hpBoostLvl * 0.02; // HP Boost Skill % adds here
  let MaxHP = trunc(hpBase * hpPct);

  // MP %
  let mpPct = 1 + (getStat(STAT_ID.MAXMP_P) + getStat(101)) / 100;
  let MaxMP = trunc(mpBase * mpPct);

  // Crit Rate %
  let crPct = (getStat(STAT_ID.CRITICAL_RATE_P) + getStat(251)) / 100;
  let CRatemodifier = 1 + crPct;
  const CR = trunc(baseCR * CRatemodifier);

  // DEF / MDEF %
  let defPct = (getStat(STAT_ID.DEF_P) + getStat(237)) / 100;
  let mdefPct = (getStat(STAT_ID.MDEF_P) + getStat(239)) / 100;

  // CORRECCIÓN 3: Penalización de Flecha
  if (subType === "arrow") {
      defPct -= 0.25;
      mdefPct -= 0.25;
  }

   // CORRECCIÓN 4: Escudo Modificadores (Force/Magical Shield)
  if (isShield) {
      // Fórmula exacta: (2.5 + 0.5*Lv + floor(Lv/2)*0.5) / 100
      const shieldDefMod = (2.5 + 0.5 * forceShieldLvl + floor(forceShieldLvl / 2) * 0.5) / 100;
      const shieldMdefMod = (2.5 + 0.5 * magicalShieldLvl + floor(magicalShieldLvl / 2) * 0.5) / 100;
      
      // Solo se suman si tienes la skill
      if (forceShieldLvl > 0) defPct += shieldDefMod;
      if (magicalShieldLvl > 0) mdefPct += shieldMdefMod;
  }

  // Light Armor Mastery DOES NOT ADD DEF% according to snippet.

  const DEF = trunc(baseDef * (1 + defPct));
  const MDEF = trunc(baseMdef * (1 + mdefPct));

  // FLEE %
  let fleePct = (getStat(STAT_ID.DODGE_P) + getStat(245)) / 100;
  const FLEE = trunc(baseFlee * (1 + fleePct));

  // ==========================================
  // 7. APPLY FLAT MODIFIERS (FINAL ADDITION)
  // ==========================================
  
  // HP Flats
  // From Snippet: MaxHP += eq_stats[17] + skill flats
  let finalHP = MaxHP;
  finalHP += getStat(STAT_ID.MAXHP) + getStat(226); 
  finalHP += hpBoostLvl * 100;
  finalHP += bushidoLvl * 10;
  if (frontlinerLvl > 0) finalHP += frontlinerLvl * 100 + Lv * 10;
  if (isShield) {
      finalHP += forceShieldLvl * 50;
      finalHP += magicalShieldLvl * 50;
  }
  if (finalHP > 99999) finalHP = 99999;

  // MP Flats
  let finalMP = MaxMP;
  finalMP += getStat(STAT_ID.MAXMP) + getStat(228); 
  finalMP += mpBoostLvl * 30;
  finalMP += bushidoLvl * 10;

  // HIT Flats
  let finalHIT = HIT;
  finalHIT += getStat(STAT_ID.ACCURACY) + getStat(242);
  finalHIT += bushidoLvl; 

  // Crit Rate Flats
  let finalCR = CR;
  finalCR += getStat(STAT_ID.CRITICAL_RATE) + getStat(250);
  finalCR += ceil(skills["Critical Up"] / 2 || 0);
  if (mainType === "hb") finalCR += ceil(skills["Critical Spear"] / 2 || 0);
  if (isTwoHandedActive) {
      if (mainType === "kat") finalCR += twoHandedLvl;
      else finalCR += ceil(twoHandedLvl / 2);
  }

  // DEF / MDEF Flats
  // Snippet: DEF += eq_stats[27] + 5 + floor(skill*1.5)
  const flatDefStat = getStat(STAT_ID.DEF) - itemBaseDEF; // Solo los bonos
  const flatMdefStat = getStat(STAT_ID.MDEF) - itemBaseDEF; // Solo los bonos (asumiendo que mdef base no existe en items como stat)

  let finalDEF = DEF + flatDefStat + getStat(236); 
  
  if (isShield && forceShieldLvl > 0) {
      finalDEF += 5 + floor(forceShieldLvl * 1.5);
  }
  
  // Fórmula exacta Skill: Math.floor(skill * 2.5) / 100 * Lv
  // Ojo: El floor se hace al coeficiente, no al resultado total.
  finalDEF += (floor(defenseUpLvl * 2.5) / 100) * Lv;
  finalDEF += (floor(defenseMasteryLvl * 2.5) / 100) * Lv;

  // MDEF Flats
  // Nota: getStat(STAT_ID.MDEF) generalmente no incluye la DEF base del equipo, así que no restamos itemBaseDEF
  // a menos que tu sistema convierta DEF base en MDEF stat. Asumimos que getStat(MDEF) son puros bonos.
  let finalMDEF = MDEF + getStat(STAT_ID.MDEF) + getStat(238);
  
  if (isShield && magicalShieldLvl > 0) {
      finalMDEF += 5 + floor(magicalShieldLvl * 1.5);
  }
  
  finalMDEF += (floor(defenseUpLvl * 2.5) / 100) * Lv;
  finalMDEF += (floor(defenseMasteryLvl * 2.5) / 100) * Lv;
  
  // Truncado final para visualización (Coryn lo hace al mostrar en HTML)
  finalDEF = trunc(finalDEF);
  finalMDEF = trunc(finalMDEF);

  // FLEE Flats
  let finalFLEE = FLEE + getStat(STAT_ID.DODGE);
  finalFLEE += skills["Dodge Up"] || 0;
  finalFLEE += ninjaSpiritLvl;

  // ==========================================
  // 8. AMPR (FROM SNIPPET: BASE -> % -> FLAT)
  // ==========================================
  // Base AMPR
  let baseAMPR = 10 + trunc(finalMP / 100);
  
  // AMPR % Modifier (eq_stats[165])
  const amprMod = 1 + getStat(STAT_ID.ATTACK_MP_RECOVERY_P) / 100;
  let AMPR = trunc(baseAMPR * amprMod);

  // AMPR Flats (eq_stats[68])
  // Skill Aggravate/Qi Charge are flats
  if (mainType === "knux") AMPR += floor(skills["Aggravate"] / 2 || 0);
  if (mainType === "barehand") AMPR += floor(skills["Ultima Qi Charge"] / 2 || 0);
  
  AMPR += getStat(STAT_ID.ATTACK_MP_RECOVERY) + getStat(273);
  
  if (isDual) AMPR *= 2;

  // ==========================================
  // 9. ATK / MATK / ASPD CALCULATIONS
  // ==========================================
  let calcATK = 0, calcMATK = 0, calcASPD = 0;

  if (mainType === "1h") {
      calcATK = Lv + STR * 2 + DEX * 2 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 100 + Lv + AGI * 4 + (AGI + STR - 1) * 0.2;
  } else if (mainType === "knux") {
      calcATK = Lv + AGI * 2 + DEX * 0.5 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK * 0.5;
      calcASPD = 120 + Lv + AGI * 4.6 + DEX * 0.1 + STR * 0.1;
  } else if (mainType === "kat") {
      calcATK = Lv + STR * 1.5 + DEX * 2.5 + weaponATK;
      calcMATK = Lv + INT * 1.5 + DEX;
      calcASPD = 200 + Lv + AGI * 3.9 + STR * 0.3;
  } else if (mainType === "staff") {
      calcATK = Lv + STR * 3 + INT + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
      calcASPD = 60.6 + Lv + INT * 0.2 + AGI * 1.8;
  } else if (mainType === "md") {
      calcATK = Lv + INT * 2 + AGI * 2 + weaponATK;
      calcMATK = Lv + INT * 4 + DEX + weaponATK;
      calcASPD = 90 + Lv + AGI * 4 + (INT - 1) * 0.2;
  } else if (mainType === "bow") {
      calcATK = Lv + STR + DEX * 3 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 75 + Lv + AGI * 3.1 + (AGI + DEX * 2 - 1) * 0.1;
  } else if (mainType === "bwg") {
      calcATK = Lv + DEX * 4 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX;
      calcASPD = 30 + Lv + AGI * 2.2 + DEX * 0.2;
  } else if (mainType === "hb") {
      calcATK = Lv + STR * 2.5 + AGI * 1.5 + weaponATK;
      calcMATK = Lv + INT * 2 + DEX + AGI;
      calcASPD = 25 + Lv + AGI * 3.5 + STR * 0.2;
  } else if (mainType === "2h") {
      calcATK = Lv + STR * 3 + DEX + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
      calcASPD = 50 + Lv + AGI * 2 + (AGI + STR - 1) * 0.2;
  } else { 
      calcATK = Lv + STR + 1 + weaponATK;
      calcMATK = Lv + INT * 3 + DEX + 1;
      calcASPD = 1000 + Lv + AGI * 9.6;
  }

  // ATK Modifiers (Thresholds 1, 3, 8 = +1% each)
  let atkMod = 1;
  if (subType === "md") atkMod -= 0.15;
  
  const checkThreshold = (lvl: number) => (lvl >= 1 ? 0.01 : 0) + (lvl >= 3 ? 0.01 : 0) + (lvl >= 8 ? 0.01 : 0);
  if (masteryMap[mainType]) atkMod += checkThreshold(masteryMap[mainType]);
  if (isDual && skills["Sword Mastery"]) atkMod += checkThreshold(skills["Sword Mastery"]);

  atkMod += (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;
  
  let finalATK = trunc(calcATK * atkMod);
  finalATK += getStat(STAT_ID.ATK) + getStat(229);
  finalATK += floor(attackUpLvl * 2.5 / 100 * Lv);

  // MATK Modifiers
  let matkMod = 1;
  if (subType === "knux") matkMod -= 0.15;
  if (mainType === "staff" || mainType === "md") matkMod += checkThreshold(skills["Magic Mastery"]);
  matkMod += (getStat(STAT_ID.MATK_P) + getStat(232)) / 100;

  let finalMATK = trunc(calcMATK * matkMod);
  finalMATK += getStat(STAT_ID.MATK) + getStat(231);
  finalMATK += floor(magicUpLvl * 2.5 / 100 * Lv);

  // ASPD Modifiers
  let aspdMod = 1;
  if (armorType === "light") aspdMod += 0.5;
  if (armorType === "heavy") aspdMod -= 0.5;
  if (subType === "shield") aspdMod -= (0.5 - shieldMasteryLvl * 0.05);
  
  aspdMod += (getStat(STAT_ID.ASPD_P) + getStat(247)) / 100;
  if (mainType === "1h" || mainType === "2h") aspdMod += (skills["Quick Slash"] || 0) * 0.01;
  if (mainType === "knux") aspdMod += (skills["Martial Discipline"] || 0) / 100;
  if (quickAuraLvl > 0) aspdMod += (quickAuraLvl * 2.5) / 100;

  let finalASPD = floor(calcASPD * aspdMod);
  
  // ASPD Flats
  finalASPD += getStat(STAT_ID.ASPD) + getStat(246);
  if (mainType === "knux") finalASPD += (skills["Martial Discipline"] || 0) * 10;
  if (mainType === "1h" || mainType === "2h") finalASPD += (skills["Quick Slash"] || 0) * 10;
  if (quickAuraLvl > 0) finalASPD += quickAuraLvl * 50;
  const activeGSW = skills["Godspeed Wield"] || 0; 
  if (activeGSW > 0) finalASPD += activeGSW * 90;


  // --- MOTION SPEED ---
  let MotionSpeed = getStat(STAT_ID.MOTION_SPEED) + getStat(276);
  if (activeGSW > 0) MotionSpeed += activeGSW * 3;
  if (finalASPD > 1000) MotionSpeed += trunc((finalASPD - 1000) / 180);
  MotionSpeed = min(MotionSpeed, 50);

  // --- RESISTANCES ---
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
  if (isDual) {
    godspeedUnsheatheBonus = Math.floor(godSpeedLvl * 2.5);
  } else {
    godspeedUnsheatheBonus = Math.floor(godSpeedLvl * 1.5);
  }

  let ATKcrit = finalATK;
  if (mainType === "kat" && isTwoHandedActive) {
      ATKcrit = Math.floor(finalATK * 1.5);
  }

  let refineResistance = armorRefine + addRefine;
  if (isShield) refineResistance += subRefine;

  let displaySubATK = 0;
  let displaySubStability = 0;
  if (isDual) {
     let subMod = 1 + (getStat(STAT_ID.ATK_P) + getStat(230)) / 100;
     let subWeaponATK_Disp = subATK + subRefine + getStat(STAT_ID.WEAPON_ATK) + getStat(277);
     displaySubATK = floor((Lv + STR + (AGI * 3) + subWeaponATK_Disp) * subMod);
     displaySubStability = floor((stability + (subWeapon?.stability || 0)) / 2);
  }

  const final: DetailedStats = {
    MaxHP: finalHP, 
    MaxMP: finalMP, 
    AMPR,
    DEF: finalDEF, 
    MDEF: finalMDEF, 
    FLEE: finalFLEE, 
    HIT: finalHIT,
    ASPD: finalASPD, 
    CSPD, 
    MotionSpeed,
    ATK: finalATK, 
    MATK: finalMATK,
    CriticalRate: finalCR,
    CriticalDamage: trunc((150 + getStat(STAT_ID.CRITICAL_DAMAGE) + getStat(252)) * (1 + (getStat(STAT_ID.CRITICAL_DAMAGE_P) + getStat(253))/100)),
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
    SubATK: displaySubATK, 
    SubStability: displaySubStability,
    PhysicalPierce: getStat(STAT_ID.PHYSICAL_PIERCE), Accuracy: finalHIT,
    MagicStability: trunc((stability + 100)/2), 
    MagicPierce: getStat(STAT_ID.MAGIC_PIERCE), 
    MagicCriticalRate: 0, MagicCriticalDamage: 0, AdditionalMagic: 0, MagicCriticalRateWeaken: 0,
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