//lib/engine/initStatus.ts
import { Status, StatKey } from "./types";

const emptyStats: Record<StatKey, number> = {
  MaxHP: 0, MaxMP: 0,
  ATK: 0, MATK: 0,
  DEF: 0, MDEF: 0,
  ASPD: 0, CSPD: 0,
  HIT: 0, FLEE: 0,
  CR: 0, CD: 0, // Critical Rate / Damage
  Stability: 0,
  STR: 0, DEX: 0, INT: 0, AGI: 0, VIT: 0
};

export function initStatus(): Status {
  return {
    base: { ...emptyStats },
    flat: { ...emptyStats },
    percent: { ...emptyStats },
    final: { ...emptyStats },
  };
}