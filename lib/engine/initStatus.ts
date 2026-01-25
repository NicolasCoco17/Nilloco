//lib/engine/initStatus.ts

import { Status, StatKey, DetailedStats } from "./types";

// Stats básicos para input (base, flat, percent)
const emptyStats: Record<StatKey, number> = {
  MaxHP: 0, MaxMP: 0,
  ATK: 0, MATK: 0,
  DEF: 0, MDEF: 0,
  ASPD: 0, CSPD: 0,
  HIT: 0, FLEE: 0,
  CR: 0, CD: 0, 
  Stability: 0,
  STR: 0, DEX: 0, INT: 0, AGI: 0, VIT: 0
};

// Stats detallados para el resultado final (inicializados en 0, strings vacíos o false)
const emptyDetailedStats: DetailedStats = {
  // Defensive
  MaxHP: 0, MaxMP: 0, AMPR: 0,
  DEF: 0, MDEF: 0, FLEE: 0,
  GuardRecharge: 0, GuardPower: 0, EvasionRecharge: 0,
  PhysicalResistance: 0, MagicResistance: 0,
  AilmentResistance: 0, Aggro: 0,
  PhysicalBarrier: 0, MagicBarrier: 0, FractionalBarrier: 0, BarrierCooldown: 0,
  Reflect: 0, RefineReduction: 0, HIT: 0,

  // Offensive Physical
  ATK: 0, ATKcrit: 0, Stability: 0,
  SubATK: 0, SubStability: 0,
  ASPD: 0, MotionSpeed: 0,
  PhysicalPierce: 0, Accuracy: 0,
  CriticalRate: 0, CriticalDamage: 0,
  Unsheathe: 0, UnsheatheFlat: 0, AdditionalMelee: 0,

  // Offensive Magic
  MATK: 0, MagicStability: 0, MagicPierce: 0,
  CSPD: 0,
  MagicCriticalRate: 0, MagicCriticalDamage: 0, AdditionalMagic: 0, MagicCriticalRateWeaken: 0,

  // Offensive General
  ShortRangeDmg: 0, LongRangeDmg: 0,
  Anticipate: 0, GuardBreak: 0,

  // Elements
  Element: "Neutral", SubElement: "Neutral",
  DTE_Neutral: 0, DTE_Fire: 0, DTE_Water: 0, DTE_Wind: 0, DTE_Earth: 0, DTE_Light: 0, DTE_Dark: 0,
  RES_Neutral: 0, RES_Fire: 0, RES_Water: 0, RES_Wind: 0, RES_Earth: 0, RES_Light: 0, RES_Dark: 0,

  // Interrupt
  NoFlinch: false, NoTumble: false, NoStun: false,
};

export function initStatus(): Status {
  return {
    base: { ...emptyStats },
    flat: { ...emptyStats },
    percent: { ...emptyStats },
    final: { ...emptyDetailedStats }, // <--- Aquí usamos el objeto completo
  };
}
