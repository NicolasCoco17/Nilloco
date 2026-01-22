//lib/engine/types.ts

export type StatKey = "MaxHP" | "MaxMP" | "ATK" | "MATK" | "ASPD" | "CSPD" | "DEF" | "MDEF" | "HIT" | "FLEE" | "CR" | "CD" | "Stability" | "STR" | "DEX" | "INT" | "AGI" | "VIT";

// Definición simple para un bono de stat (usado en Avatares y Buffland)
export type SimpleStat = {
  key: string;   // Ej: "STR", "ATK %"
  value: number; // Ej: 10, 3
};

export type Registlet = {
  id: string;
  name: string;
  stat: string;
  value?: number;     // Opcional si usa perLevel
  perLevel?: number;  // <--- IMPORTANTE: Cambiar de boolean a number
  level: number;      // Nivel actual (input usuario)
  maxLevel?: number;
};

export type CharacterInput = {
  level: number;
  baseStats: { STR: number; INT: number; VIT: number; AGI: number; DEX: number };
  weaponType: string;
  subWeaponType?: string;   
  armorType?: "light" | "heavy" | "normal"; 
  equipment: any[];
  activeBuffs?: any[];
  skills?: Record<string, number>;
  registlets?: Registlet[];
  avatars?: SimpleStat[];
  buffland?: SimpleStat[];    
  consumables?: Consumable[];  
  personal?: {
  type: "CRT" | "TEC" | "LUK" | "MTL";
  value: number;
  };

};

// Definición para items consumibles (que pueden tener múltiples stats)
export type Consumable = {
  name?: string;
  stats: Record<string, number>; // Ej: { "MaxHP": 1000, "ATK %": 2 }
};

export type Status = {
  base: Record<StatKey, number>;
  flat: Record<StatKey, number>;
  percent: Record<StatKey, number>;
  final: DetailedStats; 
};

export type DetailedStats = {
  // Defensive
  MaxHP: number; MaxMP: number; AMPR: number;
  DEF: number; MDEF: number; FLEE: number;
  GuardRecharge: number; GuardPower: number; EvasionRecharge: number;
  PhysicalResistance: number; MagicResistance: number;
  AilmentResistance: number; Aggro: number;
  PhysicalBarrier: number; MagicBarrier: number; FractionalBarrier: number; BarrierCooldown: number;
  Reflect: number; RefineReduction: number;

  // Offensive Physical
  ATK: number; ATKcrit: number; Stability: number;
  SubATK: number; SubStability: number;
  ASPD: number; MotionSpeed: number;
  PhysicalPierce: number; Accuracy: number;
  CriticalRate: number; CriticalDamage: number;
  Unsheathe: number; UnsheatheFlat: number; AdditionalMelee: number;

  // Offensive Magic
  MATK: number; MagicStability: number; MagicPierce: number;
  CSPD: number;
  MagicCriticalRate: number; MagicCriticalDamage: number; AdditionalMagic: number; MagicCriticalRateWeaken: number;

  // Offensive General
  ShortRangeDmg: number; LongRangeDmg: number;
  Anticipate: number; GuardBreak: number;

  // Elements (DTE & Resistance)
  Element: string; SubElement: string;
  DTE_Neutral: number; DTE_Fire: number; DTE_Water: number; DTE_Wind: number; DTE_Earth: number; DTE_Light: number; DTE_Dark: number;
  RES_Neutral: number; RES_Fire: number; RES_Water: number; RES_Wind: number; RES_Earth: number; RES_Light: number; RES_Dark: number;
  
  // Interrupt
  NoFlinch: boolean; NoTumble: boolean; NoStun: boolean;
};