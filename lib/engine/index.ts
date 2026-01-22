import { CharacterInput, Status, DetailedStats } from "./types";
import { aggregateStats } from "./aggregator";
import { STAT_ID } from "./statIds";

export function calcCharacterStatus(input: CharacterInput): Status {
  // 1. Obtener array de stats acumulados
  const eq_stats = aggregateStats(input);
  const skills = input.skills || {};
  const getStat = (id: number) => eq_stats[id] || 0;

  // Datos Básicos
  const Lv = input.level;
  const baseSTR = input.baseStats.STR;
  const baseINT = input.baseStats.INT;
  const baseVIT = input.baseStats.VIT;
  const baseAGI = input.baseStats.AGI;
  const baseDEX = input.baseStats.DEX;

  // --- SKILLS QUE AFECTAN STATS BASE (Godspeed) ---
  let skillAGI = 0;
  if (skills["God Speed"] > 0) {
      // Godspeed: +15 AGI (Lv10)
      skillAGI += Math.floor(skills["God Speed"] * 1.5);
  }

  // --- FÓRMULAS DE STATS BASE ---
  const STR = Math.floor(baseSTR * (1 + (getStat(4) + getStat(213)) / 100) + (getStat(3) + getStat(212)));
  const INT = Math.floor(baseINT * (1 + (getStat(6) + getStat(215)) / 100) + (getStat(5) + getStat(214)));
  const VIT = Math.floor(baseVIT * (1 + (getStat(8) + getStat(217)) / 100) + (getStat(7) + getStat(216)));
  // Sumamos skillAGI aquí para que afecte ASPD, FLEE y CDMG
  const AGI = Math.floor(baseAGI * (1 + (getStat(10) + getStat(219)) / 100) + (getStat(9) + getStat(218) + skillAGI));
  const DEX = Math.floor(baseDEX * (1 + (getStat(12) + getStat(221)) / 100) + (getStat(11) + getStat(220)));

  // Personal Stat
  let CRT = 0, LUK = 0, MTL = 0, TEC = 0;
  if (input.personal) {
    if (input.personal.type === "CRT") CRT = input.personal.value;
    if (input.personal.type === "LUK") LUK = input.personal.value;
    if (input.personal.type === "MTL") MTL = input.personal.value;
    if (input.personal.type === "TEC") TEC = input.personal.value;
  }

  // --- REFINAMIENTO Y ARMAS ---
  const mainWeapon = input.equipment.find(e => e.type === "main");
  const subWeapon = input.equipment.find(e => e.type === "sub");
  const armorEquip = input.equipment.find(e => e.type === "armor");
  const addEquip = input.equipment.find(e => e.type === "add");
  const shieldEquip = (input.subWeaponType === "shield") ? subWeapon : null;
  
  function normalizeRefine(ref: any): number {
    if (typeof ref === "number") return ref;
    if (typeof ref === "string") {
      const map: Record<string, number> = { "E": 10, "D": 11, "C": 12, "B": 13, "A": 14, "S": 15 };
      return map[ref.toUpperCase()] ?? (parseInt(ref) || 0);
    }
    return 0;
  }

  const mainRefine = normalizeRefine(mainWeapon?.refine);
  const subRefine = normalizeRefine(subWeapon?.refine);
  const armorRefine = normalizeRefine(armorEquip?.refine);
  const addRefine = normalizeRefine(addEquip?.refine);
  const shieldRefine = normalizeRefine(shieldEquip?.refine);

  // Weapon ATK Base (con fórmula de Refine^2)
  const baseWATK = Number(mainWeapon?.base_atk || 0);
  const refineBonusPct = (mainRefine * mainRefine) / 100; 
  
  let wAtkMod = 1 + refineBonusPct + getStat(STAT_ID.WEAPON_ATK_P)/100;
  let wAtkFlat = mainRefine + getStat(STAT_ID.WEAPON_ATK);
  
  // Refine Resistance
  const refineReduction = armorRefine + addRefine + (shieldRefine || 0);

  // --- MODIFICADORES DE WEAPON ATK (Mastery Skills) ---
  const mainType = input.weaponType;
  const subType = input.subWeaponType || "none";

  const masteryBonus = (lvl: number) => lvl * 0.3; 
  let atkPctSkill = 0;
  let matkPctSkill = 0;

  if(mainType === "1h" || mainType === "2h") {
      const mastery = skills["Sword Mastery"] || 0;
      atkPctSkill += mastery * 0.3; 
      wAtkMod += mastery * 0.03; 
  }
  if(mainType === "bow" || mainType === "bwg") {
      const mastery = skills["Shot Mastery"] || 0;
      atkPctSkill += mastery * 0.3;
      wAtkMod += mastery * 0.03;
  }
  if(mainType === "knux") {
      const mastery = skills["Martial Mastery"] || 0;
      atkPctSkill += mastery * 0.3;
      wAtkMod += mastery * 0.03;
  }
  if(mainType === "hb") {
      const mastery = skills["Halberd Mastery"] || 0;
      atkPctSkill += mastery * 0.3;
      wAtkMod += mastery * 0.03;
  }
  if(mainType === "kat") {
      const mastery = skills["Bushido"] || 0;
      atkPctSkill += mastery * 0.3;
      wAtkMod += mastery * 0.03;
  }
  if(mainType === "staff" || mainType === "md") {
      const mastery = skills["Magic Mastery"] || 0;
      matkPctSkill += mastery * 0.3;
      wAtkMod += mastery * 0.03;
  }

  // Two Handed
  if (mainType !== "barehand" && (subType === "none" || (subType === "scroll" && (skills["Ninja Spirit"] || 0) === 10))) {
      const th = skills["Two Handed"] || 0;
      wAtkMod += th / 100;
  }

  // Samurai Archery
  if (mainType === "bow" && subType === "kat") {
      const samLvl = skills["Samurai Archery"] || 0;
      if (samLvl > 0) {
          const bonus = Math.min(100, baseWATK * 0.6);
          wAtkFlat += bonus; 
      }
  }

  // Unarmed Mastery
  if (mainType === "barehand") {
      const uaLvl = skills["Unarmed Mastery"] || 0;
      wAtkFlat += (uaLvl * Lv) / 10; 
  }

  // CÁLCULO FINAL DE WEAPON ATK
  let weaponATK = Math.floor(baseWATK * wAtkMod) + wAtkFlat;
  let subATK = (subWeapon?.base_atk || 0) + subRefine;

  // --- CÁLCULO STATS PRINCIPALES ---
  let ATK = 0, MATK = 0, ASPD = 0;
  let stability = (mainWeapon?.stability || 0);
  
  if (mainType === "1h") {
    ATK = Lv + STR * 2 + DEX * 2 + weaponATK;
    MATK = Lv + INT * 3 + DEX;
    ASPD = 100 + Lv + AGI * 4 + (AGI + STR - 1) * 0.2;
    stability += (STR + DEX * 3) / 40;
  } else if (mainType === "2h") {
    ATK = Lv + STR * 3 + DEX + weaponATK;
    MATK = Lv + INT * 3 + DEX + 1;
    ASPD = 50 + Lv + AGI * 2 + (AGI + STR - 1) * 0.2;
    stability += DEX * 0.1;
  } else if (mainType === "bow") {
    ATK = Lv + STR + DEX * 3 + weaponATK;
    MATK = Lv + INT * 3 + DEX;
    ASPD = 75 + Lv + AGI * 3.1 + (AGI + DEX * 2 - 1) * 0.1;
    stability += (STR + DEX) / 20;
  } else if (mainType === "bwg") {
    ATK = Lv + DEX * 4 + weaponATK;
    MATK = Lv + INT * 3 + DEX;
    ASPD = 30 + Lv + AGI * 2.2 + DEX * 0.2;
    stability += STR * 0.05;
  } else if (mainType === "staff") {
    ATK = Lv + STR * 3 + INT + weaponATK;
    MATK = Lv + INT * 4 + DEX + weaponATK;
    ASPD = 60.6 + Lv + INT * 0.2 + AGI * 1.8;
    stability += STR * 0.05;
  } else if (mainType === "md") {
    ATK = Lv + INT * 2 + AGI * 2 + weaponATK;
    MATK = Lv + INT * 4 + DEX + weaponATK;
    ASPD = 90 + Lv + AGI * 4 + (INT - 1) * 0.2;
    stability += DEX * 0.1;
  } else if (mainType === "knux") {
    ATK = Lv + AGI * 2 + DEX * 0.5 + weaponATK;
    MATK = Lv + INT * 4 + DEX + weaponATK * 0.5;
    ASPD = 120 + Lv + AGI * 4.6 + DEX * 0.1 + STR * 0.1;
    stability += DEX * 0.025;
  } else if (mainType === "hb") {
    ATK = Lv + STR * 2.5 + AGI * 1.5 + weaponATK;
    MATK = Lv + INT * 2 + DEX + AGI;
    ASPD = 25 + Lv + AGI * 3.5 + STR * 0.2;
    stability += (STR + DEX) / 20;
  } else if (mainType === "kat") {
    ATK = Lv + STR * 1.5 + DEX * 2.5 + weaponATK;
    MATK = Lv + INT * 1.5 + DEX;
    ASPD = 200 + Lv + AGI * 3.9 + STR * 0.3;
    stability += (STR * 3 + DEX) / 40;
  } else { 
    ATK = Lv + STR + 1 + weaponATK;
    MATK = Lv + INT * 3 + DEX + 1;
    ASPD = 1000 + Lv + AGI * 9.6;
    stability = 0;
  }

  // Modificadores Finales ATK/MATK
  const atkUpVal = Math.floor((skills["Attack Up"] || 0) * 2.5 * Lv / 100);
  const matkUpVal = Math.floor((skills["Magic Up"] || 0) * 2.5 * Lv / 100);
  const intimVal = Math.floor((skills["Intimidating Power"] || 0) * 2.5 * Lv / 100);
  const incEngVal = Math.floor((skills["Increased Energy"] || 0) * 2.5 * Lv / 100);

  ATK = Math.floor((ATK + atkUpVal + intimVal + getStat(STAT_ID.ATK)) * (1 + (getStat(STAT_ID.ATK_P) + atkPctSkill)/100));
  MATK = Math.floor((MATK + matkUpVal + incEngVal + getStat(STAT_ID.MATK)) * (1 + (getStat(STAT_ID.MATK_P) + matkPctSkill)/100));

  // --- CÁLCULO HP/MP/DEF/MDEF/FLEE ---
  const hpBoost = skills["HP Boost"] || 0;
  let hpSkillFlat = hpBoost * 100; 
  let hpSkillPct = hpBoost * 2;

  const mpBoost = skills["MP Boost"] || 0;
  let mpSkillFlat = mpBoost * 30;

  let defSkillPct = 0;
  let mdefSkillPct = 0;
  let physResSkill = 0;
  let magResSkill = 0;
  let accSkillFlat = 0; // Para Bushido
  let accSkillPct = 0;  // Para Dual Sword Control

  // Force Shield (Shield only)
  if (subType === "shield") {
      const fs = skills["Force Shield"] || 0;
      hpSkillFlat += fs * 50;
      defSkillPct += fs * 1;
      physResSkill += fs * 1;

      const ms = skills["Magical Shield"] || 0;
      hpSkillFlat += ms * 50;
      mdefSkillPct += ms * 1;
      magResSkill += ms * 1;
  }

  // Bushido (Katana only)
  if (mainType === "kat") {
      const bushido = skills["Bushido"] || 0;
      hpSkillFlat += bushido * 10;
      mpSkillFlat += bushido * 10;
      accSkillFlat += bushido * 10; // Accuracy +10
  }

  // Frontliner II
  if (skills["Frontliner II"] > 0) {
      hpSkillFlat += 3000; 
  }

  // --- CÁLCULO HP/MP ---
  let MaxHP = Math.floor((VIT + 22.4) * Lv / 3 + 93);
  MaxHP = Math.floor((MaxHP + hpSkillFlat + getStat(STAT_ID.MAXHP)) * (1 + (getStat(STAT_ID.MAXHP_P) + hpSkillPct)/100));
  
  let MaxMP = Math.floor(100 + Lv + INT / 10 + Math.max(TEC-1, 0));
  MaxMP = Math.floor((MaxMP + mpSkillFlat + getStat(STAT_ID.MAXMP)) * (1 + (getStat(101) + mpBoost)/100)); 

  // --- CÁLCULO DEF/MDEF/FLEE ---
  // Calculo inicial
  const equipmentDEF = getStat(STAT_ID.DEF);
  const equipmentMDEF = getStat(STAT_ID.MDEF);
  const equipmentFLEE = getStat(STAT_ID.DODGE);

  let DEF = 0, MDEF = 0, FLEE = 0;
  
  const armorType = input.armorType ?? "normal";
  if (armorType === "light") {
    DEF = Math.floor(Lv * 0.8 + VIT * 0.25 + equipmentDEF);
    MDEF = Math.floor(Lv * 0.8 + INT * 0.25 + equipmentMDEF);
    FLEE = Math.floor(Lv * 1.25 + AGI * 1.75 + 30 + equipmentFLEE);
    ASPD = Math.floor(ASPD * 1.5);
  } else if (armorType === "heavy") {
    DEF = Math.floor(Lv * 1.2 + VIT * 2 + equipmentDEF);
    MDEF = Math.floor(Lv * 1.2 + INT * 2 + equipmentMDEF);
    FLEE = Math.floor(Lv * 0.5 + AGI * 0.75 - 15 + equipmentFLEE);
    ASPD = Math.floor(ASPD * 0.5);
  } else { // Normal or None
    DEF = Lv + VIT + equipmentDEF;
    MDEF = Lv + INT + equipmentMDEF;
    FLEE = Lv + AGI + equipmentFLEE;
    if (armorType !== "normal") ASPD = Math.floor(ASPD * 1.5 + 1000); 
  }

  // Aplicar bonos % de skills a DEF/MDEF
  DEF = Math.floor(DEF * (1 + (getStat(STAT_ID.DEF_P) + defSkillPct)/100));
  MDEF = Math.floor(MDEF * (1 + (getStat(STAT_ID.MDEF_P) + mdefSkillPct)/100));

  // --- SKILLS DE VELOCIDAD (ASPD) ---
  let aspdSkillFlat = 0;
  let aspdSkillPct = 0;

  // Quick Aura
  const qaLvl = skills["Quick Aura"] || 0;
  if (qaLvl > 0) {
      aspdSkillFlat += 250 + (25 * qaLvl);
      aspdSkillPct += 2.5 * qaLvl;
  }

  // Quick Slash (1h/2h)
  if (mainType === "1h" || mainType === "2h") {
      const qsLvl = skills["Quick Slash"] || 0;
      aspdSkillFlat += 10 * qsLvl;
      aspdSkillPct += 1 * qsLvl;
  }

  // Martial Discipline (Knux)
  if (mainType === "knux") {
      const mdLvl = skills["Martial Discipline"] || 0;
      aspdSkillFlat += 10 * mdLvl;
      aspdSkillPct += 1 * mdLvl;
  }

  // Dual Sword Control (ASPD +500)
  if (mainType === "1h" && subType === "1h") {
      const dsc = skills["Dual Sword Control"] || 0;
      aspdSkillFlat += 50 * dsc; 
  }

  // Fórmula Final ASPD: (Base + Flat) * (1 + %)
  const aspdEquipFlat = getStat(STAT_ID.ASPD);
  const aspdEquipPct = getStat(STAT_ID.ASPD_P);
  ASPD = Math.floor((ASPD + aspdSkillFlat + aspdEquipFlat) * (1 + (aspdEquipPct + aspdSkillPct)/100));
  
  // --- CÁLCULO DE MOTION SPEED ---
  let MotionSpeed = getStat(STAT_ID.MOTION_SPEED);
  if (ASPD > 1000) {
      MotionSpeed += Math.floor((ASPD - 1000) / 180);
  }
  MotionSpeed = Math.min(MotionSpeed, 50);

  // --- CRITICAL ---
  let CR = Math.floor(25 + CRT / 3.4);
  const critUp = skills["Critical UP"] || 0;
  const critFlatSkill = Math.ceil(critUp / 2); 
  const critPctSkill = Math.ceil(critUp / 2); 

  let critSpearFlat = 0;
  let critSpearPct = 0;
  if (mainType === "hb") {
      const cs = skills["Critical Spear"] || 0;
      critSpearFlat += Math.ceil(cs / 2);
      critSpearPct += Math.ceil(cs / 2);
  }

  let thCritFlat = 0;
  if (mainType !== "barehand" && (subType === "none" || (subType === "scroll" && (skills["Ninja Spirit"] || 0) === 10))) {
      const th = skills["Two Handed"] || 0;
      thCritFlat += th; // +10 Crit
  }

  let dsCritPct = 0;
  if (mainType === "1h" && subType === "1h") {
      const dsc = skills["Dual Sword Control"] || 0;
      dsCritPct += 3.5 * dsc; // +35% Crit Rate
      accSkillPct += 3.5 * dsc; // +35% Accuracy
  }

  CR = Math.floor((CR + critFlatSkill + critSpearFlat + thCritFlat + getStat(STAT_ID.CRITICAL_RATE)) * (1 + (getStat(STAT_ID.CRITICAL_RATE_P) + critPctSkill + critSpearPct + dsCritPct)/100));
  
  let CD = 150; 
  if (AGI > STR) CD = Math.floor(150 + (STR + AGI) / 10);
  else CD = Math.floor(150 + STR / 5);
  CD = Math.floor((CD + getStat(STAT_ID.CRITICAL_DAMAGE)) * (1 + getStat(STAT_ID.CRITICAL_DAMAGE_P)/100));

  // --- ACCURACY ---
  // Base Hit = Lv + DEX
  let Accuracy = Math.floor((Lv + DEX + accSkillFlat + getStat(STAT_ID.ACCURACY)) * (1 + (getStat(STAT_ID.ACCURACY_P) + accSkillPct)/100));

  // --- UNSHEATHE ---
  // Godspeed: +25% Unsheathe (Lv10)
  const godspeedUnsheathe = Math.floor((skills["God Speed"] || 0) * 2.5);
  const Unsheathe = 100 + getStat(STAT_ID.UNSHEATHE_ATTACK_P) + godspeedUnsheathe;

  // --- ELEMENTOS ---
  let element = "Neutral";
  if (getStat(STAT_ID.ELEMENT_FIRE)) element = "Fire";
  if (getStat(STAT_ID.ELEMENT_WATER)) element = "Water";
  if (getStat(STAT_ID.ELEMENT_WIND)) element = "Wind";
  if (getStat(STAT_ID.ELEMENT_EARTH)) element = "Earth";
  if (getStat(STAT_ID.ELEMENT_LIGHT)) element = "Light";
  if (getStat(STAT_ID.ELEMENT_DARK)) element = "Dark";

  // --- CÁLCULOS DE MAGIA ---
  const spellBurstLevel = skills["Spell Burst"] || 0;
  let mcRateConversion = spellBurstLevel * 0.025;
  if (mainType === "staff" && element === "Neutral") {
    mcRateConversion += 0.25;
  }
  const magicCR = Math.floor(CR * mcRateConversion);
  const magicCRWeaken = Math.floor(CR * (mcRateConversion + 0.5));
  const mcDamageConversion = 0.5 + (spellBurstLevel * 0.025);
  const magicCD = Math.floor(100 + ((CD - 100) * mcDamageConversion));

  // --- OBJETO DETALLADO FINAL ---
  const final: DetailedStats = {
    // Defensive
    MaxHP, MaxMP, 
    AMPR: Math.floor((10 + MaxMP/100) * (1 + getStat(STAT_ID.ATTACK_MP_RECOVERY)/100)),
    DEF: Math.floor(DEF), MDEF: Math.floor(MDEF), FLEE: Math.floor(FLEE),
    GuardRecharge: getStat(STAT_ID.GUARD_RECHARGE),
    GuardPower: getStat(STAT_ID.GUARD_POWER),
    EvasionRecharge: getStat(STAT_ID.EVASION_RECHARGE),
    PhysicalResistance: getStat(STAT_ID.PHYSICAL_RESISTANCE) + physResSkill,
    MagicResistance: getStat(STAT_ID.MAGIC_RESISTANCE) + magResSkill,
    AilmentResistance: Math.floor(MTL/3.4) + getStat(STAT_ID.AILMENT_RESISTANCE),
    Aggro: 100 + getStat(STAT_ID.AGGRO),
    PhysicalBarrier: getStat(STAT_ID.PHYSICAL_BARRIER),
    MagicBarrier: getStat(STAT_ID.MAGIC_BARRIER),
    FractionalBarrier: getStat(STAT_ID.FRACTIONAL_BARRIER),
    BarrierCooldown: getStat(STAT_ID.BARRIER_COOLDOWN),
    Reflect: getStat(STAT_ID.REFLECT),
    RefineReduction: refineReduction, 

    // Offensive Physical
    ATK, ATKcrit: ATK, 
    Stability: Math.min(Math.floor(stability + getStat(STAT_ID.STABILITY)), 100),
    SubATK: subATK, 
    SubStability: 0, 
    ASPD, MotionSpeed: MotionSpeed,
    PhysicalPierce: getStat(STAT_ID.PHYSICAL_PIERCE),
    Accuracy: Accuracy,
    CriticalRate: CR,
    CriticalDamage: CD,
    Unsheathe: Unsheathe,
    UnsheatheFlat: getStat(STAT_ID.UNSHEATHE_ATTACK),
    AdditionalMelee: getStat(STAT_ID.ADDITIONAL_MELEE),

    // Offensive Magic
    MATK, 
    MagicStability: Math.floor((stability + 100)/2), 
    MagicPierce: getStat(STAT_ID.MAGIC_PIERCE),
    CSPD: Math.floor((Lv + AGI*1.16 + DEX*2.94 + getStat(STAT_ID.CSPD)) * (1 + getStat(STAT_ID.CSPD_P)/100)),
    
    MagicCriticalRate: magicCR,
    MagicCriticalRateWeaken: magicCRWeaken,
    MagicCriticalDamage: magicCD,
    AdditionalMagic: getStat(STAT_ID.ADDITIONAL_MAGIC),

    // Offensive General
    ShortRangeDmg: 100 + getStat(STAT_ID.SHORT_RANGE_DMG),
    LongRangeDmg: 100 + getStat(STAT_ID.LONG_RANGE_DMG),
    Anticipate: getStat(STAT_ID.ANTICIPATE),
    GuardBreak: getStat(STAT_ID.GUARD_BREAK),

    // Elements
    Element: element, SubElement: "Neutral",
    DTE_Neutral: 100 + getStat(STAT_ID.DTE_NEUTRAL),
    DTE_Fire: 100 + getStat(STAT_ID.DTE_FIRE),
    DTE_Water: 100 + getStat(STAT_ID.DTE_WATER),
    DTE_Wind: 100 + getStat(STAT_ID.DTE_WIND),
    DTE_Earth: 100 + getStat(STAT_ID.DTE_EARTH),
    DTE_Light: 100 + getStat(STAT_ID.DTE_LIGHT),
    DTE_Dark: 100 + getStat(STAT_ID.DTE_DARK),
    RES_Neutral: getStat(STAT_ID.RES_NEUTRAL),
    RES_Fire: getStat(STAT_ID.RES_FIRE),
    RES_Water: getStat(STAT_ID.RES_WATER),
    RES_Wind: getStat(STAT_ID.RES_WIND),
    RES_Earth: getStat(STAT_ID.RES_EARTH),
    RES_Light: getStat(STAT_ID.RES_LIGHT),
    RES_Dark: getStat(STAT_ID.RES_DARK),

    // Interrupt
    NoFlinch: false, NoTumble: false, NoStun: false, 
  };

  return {
    base: {} as any, flat: {} as any, percent: {} as any, 
    final: final
  };
}