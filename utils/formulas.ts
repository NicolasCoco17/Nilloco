// utils/formulas.ts
import { FormulaArma } from "@/data/formulas/armas";

type FiltroFormulasParams = {
  pot: number;
  elemento: string;
  dte: string;
};

export function filtrarFormulasArma(
  formulas: FormulaArma[],
  { pot }: FiltroFormulasParams
) {
  return formulas.filter(f => {
    // Solo filtramos por POT. 
    // Si el POT del usuario es menor al mínimo de la fórmula, no se muestra.
    if (pot < f.potMin) return false;
    return true;
  });
}