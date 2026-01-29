// ==========================================
// STAT IDS
// ==========================================
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

  // AMPR
  ATTACK_MP_RECOVERY: 68,
  ATTACK_MP_RECOVERY_P: 165,

  // Max HP / MP
  MAXHP: 17,
  MAXHP_P: 18,
  MAXMP: 19,
  MAXMP_P: 101,

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

  // DTE
  DTE_FIRE: 45,
  DTE_WATER: 46,
  DTE_WIND: 47,
  DTE_EARTH: 48,
  DTE_LIGHT: 49,
  DTE_DARK: 50,
  DTE_NEUTRAL: 110,

  // Awakening
  ELEMENT_FIRE: 62,
  ELEMENT_WATER: 63,
  ELEMENT_WIND: 64,
  ELEMENT_EARTH: 65,
  ELEMENT_LIGHT: 66,
  ELEMENT_DARK: 67,

  // Other
  GUARD_POWER: 58,
  GUARD_RECHARGE: 59,
  EVASION_RECHARGE: 60,
  AGGRO: 61,

  SHORT_RANGE_DMG: 69,
  LONG_RANGE_DMG: 70,

  UNSHEATHE_ATTACK: 116,
  UNSHEATHE_ATTACK_P: 117,

  PHYSICAL_BARRIER: 124,
  MAGIC_BARRIER: 128,
  FRACTIONAL_BARRIER: 127,
  BARRIER_COOLDOWN: 141,
  REFLECT: 126,
  ANTICIPATE: 139,
  GUARD_BREAK: 140,

  ADDITIONAL_MELEE: 129,
  ADDITIONAL_MAGIC: 130,
} as const;

// ==========================================
// ALIAS MAP 
// ==========================================
const STAT_ALIASES: Record<string, number> = {
  // === BÁSICOS ===
  str: 3, strp: 4, strpct: 4,
  int: 5, intp: 6, intpct: 6,
  vit: 7, vitp: 8, vitpct: 8,
  agi: 9, agip: 10, agipct: 10,
  dex: 11, dexp: 12, dexpct: 12,

  // === HP / MP / REGEN ===
  maxhp: 17, hp: 17,
  maxhpp: 18, maxhppct: 18, hppct: 18, // Corregido (sin duplicados)
  
  maxmp: 19, mp: 19,
  maxmpp: 101, mppct: 101, // Corregido (sin duplicados)

  naturalhpregen: 13, 
  naturalhpregenp: 14, naturalhpregenpct: 14, 

  naturalmpregen: 15, 
  naturalmpregenp: 16, naturalmpregenpct: 16, 

  // === AMPR ===
  attackmprecovery: 68, ampr: 68,
  attackmprecoveryp: 165, attackmprecoverypct: 165, amprp: 165, amprpct: 165,

  // === ATAQUE ===
  atk: 20, atkp: 21, atkpct: 21,
  matk: 22, matkp: 23, matkpct: 23,

  weaponatk: 73, watk: 73,
  weaponatkp: 74, weaponatkpct: 74, watkp: 74, watkpct: 74,

  // === CRÍTICOS & ESTABILIDAD ===
  criticalrate: 41, critrate: 41, flatcrit: 41,
  criticalratep: 42, criticalratepct: 42, critratep: 42, critratepct: 42,

  criticaldamage: 43, critdamage: 43, cdmg: 43,
  criticaldamagep: 44, criticaldamagepct: 44, critdamagep: 44, critdamagepct: 44, cdmgp: 44, cdmgpct: 44,

  stability: 24, 
  stabilityp: 24, stabilitypct: 24,

  // === SPEED / HIT / FLEE ===
  aspd: 37, aspdp: 38, aspdpct: 38,
  cspd: 39, cspdp: 40, cspdpct: 40,

  accuracy: 33, hit: 33,
  accuracyp: 34, accuracypct: 34, hitp: 34, hitpct: 34,

  dodge: 35, flee: 35,
  dodgep: 36, dodgepct: 36, fleep: 36, fleepct: 36,

  motionspeed: 71, 
  motionspeedp: 71, motionspeedpct: 71,

  // === DEFENSA ===
  def: 27, defp: 28, defpct: 28,
  mdef: 29, mdefp: 30, mdefpct: 30,

  // === RESISTENCIAS ===
  physicalresistance: 31, physres: 31,
  physicalresistancep: 31, physicalresistancepct: 31, physresp: 31, physrespct: 31,

  magicresistance: 32, magres: 32,
  magicresistancep: 32, magicresistancepct: 32, magresp: 32, magrespct: 32,

  ailmentresistance: 57, ailment: 57,
  ailmentresistancep: 57, ailmentresistancepct: 57, ailmentp: 57, ailmentpct: 57,

  neutralresistance: 75, neutralresistancep: 75, neutralresistancepct: 75,
  fireresistance: 51, fireresistancep: 51, fireresistancepct: 51,
  waterresistance: 52, waterresistancep: 52, waterresistancepct: 52,
  windresistance: 53, windresistancep: 53, windresistancepct: 53,
  earthresistance: 54, earthresistancep: 54, earthresistancepct: 54,
  lightresistance: 55, lightresistancep: 55, lightresistancepct: 55,
  darkresistance: 56, darkresistancep: 56, darkresistancepct: 56,

  // === DTE ===
  strongeragainstfire: 45, dtefire: 45,
  strongeragainstfirep: 45, strongeragainstfirepct: 45,

  strongeragainstwater: 46, dtewater: 46,
  strongeragainstwaterp: 46, strongeragainstwaterpct: 46,

  strongeragainstwind: 47, dtewind: 47,
  strongeragainstwindp: 47, strongeragainstwindpct: 47,

  strongeragainstearth: 48, dteearth: 48,
  strongeragainstearthp: 48, strongeragainstearthpct: 48,

  strongeragainstlight: 49, dtelight: 49,
  strongeragainstlightp: 49, strongeragainstlightpct: 49,

  strongeragainstdark: 50, dtedark: 50,
  strongeragainstdarkp: 50, strongeragainstdarkpct: 50,

  strongeragainstneutral: 110, dteneutral: 110,
  strongeragainstneutralp: 110, strongeragainstneutralpct: 110,

  // === OTROS ===
  aggro: 61,
  aggrop: 61, aggropct: 61,

  guardpower: 58, guardpowerp: 58, guardpowerpct: 58,
  guardrecharge: 59, guardrechargep: 59, guardrechargepct: 59,
  evasionrecharge: 60, evasionrechargep: 60, evasionrechargepct: 60,

  physicalpierce: 25, ppierce: 25,
  physicalpiercep: 25, physicalpiercepct: 25, ppiercep: 25,

  magicpierce: 26, mpierce: 26,
  magicpiercep: 26, magicpiercepct: 26, mpiercep: 26,

  shortrangedamage: 69, srd: 69,
  shortrangedamagep: 69, shortrangedamagepct: 69,

  longrangedamage: 70, lrd: 70,
  longrangedamagep: 70, longrangedamagepct: 70,

  unsheatheattack: 116, unsheathe: 116,
  unsheatheattackp: 117, unsheatheattackpct: 117, unsheathep: 117, unsheathepct: 117,

  physicalbarrier: 124,
  magicbarrier: 128,
  fractionalbarrier: 127, fractionalbarrierp: 127, fractionalbarrierpct: 127,

  barriercooldown: 141, barriercooldownp: 141, barriercooldownpct: 141,

  reflect: 126, reflectp: 126, reflectpct: 126,

  anticipate: 139, anticipatep: 139, anticipatepct: 139,

  guardbreak: 140, guardbreakp: 140, guardbreakpct: 140,

  additionalmelee: 129, additionalmeleep: 129, additionalmeleepct: 129,

  additionalmagic: 130, additionalmagicp: 130, additionalmagicpct: 130,

  // === ELEMENTOS (AWAKENING) ===
  elementfire: 62,
  elementwater: 63,
  elementwind: 64,
  elementearth: 65,
  elementlight: 66,
  elementdark: 67,
};

// ==========================================
// NORMALIZADOR
// ==========================================
function normalizeStatName(name: string): string {
  const lower = name.toLowerCase();
  const isPercent = lower.includes("%");

  let n = lower.replace(/[^a-z0-9]/g, "");

  if (isPercent && !n.endsWith("p")) {
    n += "p";
  }

  return n;
}

// ==========================================
// GET STAT ID
// ==========================================
export function getStatIdFromName(name: string): number {
  if (!name) return 0;
  const key = normalizeStatName(name);
  return STAT_ALIASES[key] ?? 0;
}
