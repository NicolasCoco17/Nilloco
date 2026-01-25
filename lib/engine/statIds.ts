export const STAT_ID = {
  // Básicos
  STR: 3, STR_P: 4,
  INT: 5, INT_P: 6,
  VIT: 7, VIT_P: 8,
  AGI: 9, AGI_P: 10,
  DEX: 11, DEX_P: 12,

  // Regen
  NATURAL_HP_REGEN: 13, NATURAL_HP_REGEN_P: 14,
  NATURAL_MP_REGEN: 15, NATURAL_MP_REGEN_P: 16,
  
  // AMPR (Aquí faltaba el porcentual)
  ATTACK_MP_RECOVERY: 68, 
  ATTACK_MP_RECOVERY_P: 165, // <--- AGREGADO

  // Max HP / MP
  MAXHP: 17, MAXHP_P: 18,
  MAXMP: 19, 
  MAXMP_P: 101, // <--- AGREGADO

  // Atk/Matk
  ATK: 20, ATK_P: 21,
  MATK: 22, MATK_P: 23,
  WEAPON_ATK: 73, WEAPON_ATK_P: 74,

  // Stability/Pierce
  STABILITY: 24,
  PHYSICAL_PIERCE: 25,
  MAGIC_PIERCE: 26,

  // Defense
  DEF: 27, DEF_P: 28,
  MDEF: 29, MDEF_P: 30,
  PHYSICAL_RESISTANCE: 31,
  MAGIC_RESISTANCE: 32,
  
  // Resistance Elements
  RES_FIRE: 51, 
  RES_WATER: 52, 
  RES_WIND: 53, 
  RES_EARTH: 54, 
  RES_LIGHT: 55, 
  RES_DARK: 56, 
  RES_NEUTRAL: 75,
  
  AILMENT_RESISTANCE: 57,

  // Hit/Flee/Speed
  ACCURACY: 33, ACCURACY_P: 34,
  DODGE: 35, DODGE_P: 36,
  ASPD: 37, ASPD_P: 38,
  CSPD: 39, CSPD_P: 40,
  MOTION_SPEED: 71,

  // Crit
  CRITICAL_RATE: 41, CRITICAL_RATE_P: 42,
  CRITICAL_DAMAGE: 43, CRITICAL_DAMAGE_P: 44,

  // DTE (Stronger Against)
  DTE_FIRE: 45, DTE_WATER: 46, DTE_WIND: 47, DTE_EARTH: 48, DTE_LIGHT: 49, DTE_DARK: 50, DTE_NEUTRAL: 110,

  // Elements (Awakening)
  ELEMENT_FIRE: 62, ELEMENT_WATER: 63, ELEMENT_WIND: 64, ELEMENT_EARTH: 65, ELEMENT_LIGHT: 66, ELEMENT_DARK: 67,

  // Special Properties
  GUARD_POWER: 58, GUARD_RECHARGE: 59,
  EVASION_RECHARGE: 60,
  AGGRO: 61,
  
  // Dmg
  SHORT_RANGE_DMG: 69,
  LONG_RANGE_DMG: 70,
  
  // Unsheathe
  UNSHEATHE_ATTACK: 116, 
  UNSHEATHE_ATTACK_P: 117,

  EXP_GAIN: 95,
  DROP_RATE: 96,

  // Barrier / Guard
  PHYSICAL_BARRIER: 124,
  MAGIC_BARRIER: 128,
  FRACTIONAL_BARRIER: 127,
  BARRIER_COOLDOWN: 141,
  REFLECT: 126,
  ANTICIPATE: 139,
  GUARD_BREAK: 140,
  
  // Additional Dmg
  ADDITIONAL_MELEE: 129,
  ADDITIONAL_MAGIC: 130,

  // Reductions
  RED_DMG_PLAYER: 170,
  RED_DMG_FOE: 171,
  RED_DMG_FLOOR: 173,
  RED_DMG_CHARGE: 174,
  RED_DMG_BULLET: 176,
  RED_DMG_BOWLING: 177,
  RED_DMG_METEOR: 180,
  RED_DMG_STRAIGHT: 187,
  RED_VORTEX: 316,
  RED_EXPLOSION: 317,

  // --- ASPD AVANZADO (CAPAS) ---
  ASPD_EQUIP: 1001,   // Equipo + pasivas (multiplicable)
  ASPD_FINAL: 1002,   // Consumibles, registlets (no multiplicable)

};

export function getStatIdFromName(name: string): number {
  if (!name) return 0;
  
  const lower = name.toLowerCase();
  // 1. Detectar si es porcentaje ANTES de borrar el símbolo
  const isPercent = lower.includes("%");

  // 2. Limpiar string (deja solo letras y números)
  let n = lower.replace(/[^a-z0-9]/g, "");

  // 3. Si era porcentaje, agregar "pct" si no lo tiene
  if (isPercent && !n.endsWith("pct") && !n.endsWith("p")) {
    n += "pct";
  }

  switch (n) {
    // === BÁSICOS ===
    case "str": return 3; 
    case "strpct": case "strp": return 4;
    case "int": return 5; 
    case "intpct": case "intp": return 6;
    case "vit": return 7; 
    case "vitpct": case "vitp": return 8;
    case "agi": return 9; 
    case "agipct": case "agip": return 10;
    case "dex": return 11; 
    case "dexpct": case "dexp": return 12;

    // === HP / MP / REGEN ===
    case "maxhp": case "hp": return 17; 
    case "maxhppct": case "maxhpp": case "hppct": return 18;

    case "maxmp": case "mp": return 19; 
    case "maxmppct": case "mppct": return 101; // ID 101 para %

    case "naturalhpregen": return 13; 
    case "naturalhpregenpct": return 14;
    case "naturalmpregen": return 15; 
    case "naturalmpregenpct": return 16;
    
    // AMPR
    case "attackmprecovery": case "ampr": return 68;
    case "attackmprecoverypct": case "amprpct": return 165; // ID 165 para %

    // === ATAQUE ===
    case "atk": return 20; 
    case "atkpct": case "atkp": return 21;
    case "matk": return 22; 
    case "matkpct": case "matkp": return 23;
    case "weaponatk": case "watk": return 73;
    case "weaponatkpct": case "watkpct": return 74; 

    // === CRÍTICOS & ESTABILIDAD ===
    case "criticalrate": case "critrate": case "flatcrit": return 41;
    case "criticalratepct": case "critratepct": case "criticalratep": return 42; 
    case "criticaldamage": case "critdamage": case "cdmg": return 43;
    case "criticaldamagepct": case "critdamagepct": return 44; 
    case "stability": case "stabilitypct": return 24; 

    // === SPEED / HIT / FLEE ===
    case "aspd": return 37; 
    case "aspdpct": return 38;
    case "cspd": return 39; 
    case "cspdpct": return 40;
    case "accuracy": case "hit": return 33; 
    case "accuracypct": case "hitpct": return 34;
    case "dodge": case "flee": return 35; 
    case "dodgepct": case "fleepct": return 36;
    case "motionspeed": case "motionspeedpct": return 71;

    // === DEFENSA ===
    case "def": return 27; 
    case "defpct": return 28;
    case "mdef": return 29; 
    case "mdefpct": return 30;
    
    // Resistencias (Normalizadas)
    case "physicalresistance": case "physres": return 31;
    case "physicalresistancepct": case "physrespct": return 31; // ID Unico
    
    case "magicresistance": case "magres": return 32;
    case "magicresistancepct": case "magrespct": return 32;

    case "ailmentresistance": case "ailment": return 57;
    case "ailmentresistancepct": case "ailmentpct": return 57;

    case "neutralresistance": case "neutralresistancepct": return 75;
    case "fireresistance": case "fireresistancepct": return 51;
    case "waterresistance": case "waterresistancepct": return 52;
    case "windresistance": case "windresistancepct": return 53;
    case "earthresistance": case "earthresistancepct": return 54;
    case "lightresistance": case "lightresistancepct": return 55;
    case "darkresistance": case "darkresistancepct": return 56;

    // === ELEMENTOS (DTE) ===
    case "strongeragainstfire": case "strongeragainstfirepct": return 45;
    case "strongeragainstwater": case "strongeragainstwaterpct": return 46;
    case "strongeragainstwind": case "strongeragainstwindpct": return 47;
    case "strongeragainstearth": case "strongeragainstearthpct": return 48;
    case "strongeragainstlight": case "strongeragainstlightpct": return 49;
    case "strongeragainstdark": case "strongeragainstdarkpct": return 50;
    case "strongeragainstneutral": case "strongeragainstneutralpct": return 110;

    // === OTROS ===
    case "aggro": case "aggropct": return 61;
    case "guardpower": case "guardpowerpct": return 58;
    case "guardrecharge": case "guardrechargepct": return 59;
    case "evasionrecharge": case "evasionrechargepct": return 60;
    case "physicalpierce": case "physicalpiercepct": return 25;
    case "magicpierce": case "magicpiercepct": return 26;
    case "shortrangedamage": case "shortrangedamagepct": return 69;
    case "longrangedamage": case "longrangedamagepct": return 70;
    case "unsheatheattack": return 116;
    case "unsheatheattackpct": return 117;
    
    case "physicalbarrier": return 124;
    case "magicbarrier": return 128;
    case "fractionalbarrier": case "fractionalbarrierpct": return 127;
    case "barriercooldown": case "barriercooldownpct": return 141;
    case "reflect": case "reflectpct": return 126;
    case "anticipate": case "anticipatepct": return 139;
    case "guardbreak": case "guardbreakpct": return 140;
    
    case "additionalmelee": case "additionalmeleepct": return 129;
    case "additionalmagic": case "additionalmagicpct": return 130;
  }
  return 0;
}