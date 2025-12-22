// data/armas/formulas.ts

export type FormulaArma = {
  id: string;
  label: string;
  potMin: number;
  usaElemento: boolean;
  usaDte: boolean;
};

export const FORMULAS_ARMAS: FormulaArma[] = [
  // ==========================================
  // ATK + STR/AGI (Ele + DTE)
  // ==========================================
  { id: "atk14_str10_ele_dte21", label: "Ele DTE21% ATK14% STR10%", potMin: 110, usaElemento: true, usaDte: true },
  { id: "atk14_str10_ele_dte22", label: "Ele DTE22% ATK14% STR10%", potMin: 118, usaElemento: true, usaDte: true },
  { id: "atk14_str10_ele_dte23", label: "Ele DTE23% ATK14% STR10%", potMin: 128, usaElemento: true, usaDte: true },
  
  { id: "atk14_agi10_ele_dte21", label: "Ele DTE21% ATK14% AGI10%", potMin: 110, usaElemento: true, usaDte: true },
  { id: "atk14_agi10_ele_dte22", label: "Ele DTE22% ATK14% AGI10%", potMin: 118, usaElemento: true, usaDte: true },
  { id: "atk14_agi10_ele_dte23", label: "Ele DTE23% ATK14% AGI10%", potMin: 128, usaElemento: true, usaDte: true },

  // ==========================================
  // MATK + INT / CD / CR (Ele + DTE)
  // ==========================================
  { id: "matk15_cd23_ele_dte23", label: "Ele DTE23% MATK15% CD23", potMin: 125, usaElemento: true, usaDte: true },
  { id: "matk10_cd20_cr30_ele_dte23", label: "Ele DTE23% MATK10% CD20 CR30", potMin: 130, usaElemento: true, usaDte: true },
  { id: "matk10_cd23_cr30_ele_dte21", label: "Ele DTE21% MATK10% CD23 CR30", potMin: 128, usaElemento: true, usaDte: true },
  { id: "matk10_cd21_cr30_ele_dte22", label: "Ele DTE22% MATK10% CD21 CR30", potMin: 126, usaElemento: true, usaDte: true },
  
  { id: "matk12_int10_ele_dte23", label: "Ele DTE23% MATK12% INT10%", potMin: 118, usaElemento: true, usaDte: true },
  { id: "matk11_int10_ele_dte23", label: "Ele DTE23% MATK11% INT10%", potMin: 112, usaElemento: true, usaDte: true },
  { id: "matk13_int10_ele_dte21", label: "Ele DTE21% MATK13% INT10%", potMin: 118, usaElemento: true, usaDte: true },
  { id: "matk13_int10_ele_dte22", label: "Ele DTE22% MATK13% INT10%", potMin: 123, usaElemento: true, usaDte: true },

  // ==========================================
  // MATK + CD (Ele + DTE)
  // ==========================================
  { id: "cd21_matk14_ele_dte22", label: "Ele DTE22% CD21 MATK14%", potMin: 114, usaElemento: true, usaDte: true },
  { id: "cd20_matk14_ele_dte23", label: "Ele DTE23% CD20 MATK14%", potMin: 117, usaElemento: true, usaDte: true },
  { id: "cd23_matk14_ele_dte21", label: "Ele DTE21% CD23 MATK14%", potMin: 115, usaElemento: true, usaDte: true },
  { id: "cd20_matk15_ele_dte21", label: "Ele DTE21% CD20 MATK15%", potMin: 117, usaElemento: true, usaDte: true },

  // ==========================================
  // CD builds (Ele + DTE)
  // ==========================================
  { id: "cd10_cd21_cr21_ele_dte21", label: "Ele DTE21% CD10% CD21 CR21", potMin: 118, usaElemento: true, usaDte: true },
  { id: "cd10_cd21_cr21_ele_dte23", label: "Ele DTE23% CD10% CD21 CR21", potMin: 127, usaElemento: true, usaDte: true },
  { id: "cd12_cd23_ele_dte23", label: "Ele DTE23% CD12% CD23", potMin: 115, usaElemento: true, usaDte: true },

  // ==========================================
  // ATK + STAT + CD (Neutrales: Sin Ele/Dte)
  // ==========================================
  // Variante 119
  { id: "atk10_str10_cd10_cd22_cr30", label: "ATK10% STR10% CD10% CD22 CR30", potMin: 119, usaElemento: false, usaDte: false },
  { id: "atk10_dex10_cd10_cd22_cr30", label: "ATK10% DEX10% CD10% CD22 CR30", potMin: 119, usaElemento: false, usaDte: false },
  { id: "atk10_agi10_cd10_cd22_cr30", label: "ATK10% AGI10% CD10% CD22 CR30", potMin: 119, usaElemento: false, usaDte: false },
  
  // Variante 116 (CD11%)
  { id: "atk15_str10_cd11_cd22", label: "ATK15% STR10% CD11% CD22", potMin: 116, usaElemento: false, usaDte: false },
  { id: "atk15_dex10_cd11_cd22", label: "ATK15% DEX10% CD11% CD22", potMin: 116, usaElemento: false, usaDte: false },
  { id: "atk15_agi10_cd11_cd22", label: "ATK15% AGI10% CD11% CD22", potMin: 116, usaElemento: false, usaDte: false },

  // Variante 122 (CD23)
  { id: "atk15_str10_cd11_cd23", label: "ATK15% STR10% CD11% CD23", potMin: 122, usaElemento: false, usaDte: false },
  { id: "atk15_dex10_cd11_cd23", label: "ATK15% DEX10% CD11% CD23", potMin: 122, usaElemento: false, usaDte: false },
  { id: "atk15_agi10_cd11_cd23", label: "ATK15% AGI10% CD11% CD23", potMin: 122, usaElemento: false, usaDte: false },

  // Variante 130
  { id: "atk15_str10_cd12_cd21", label: "ATK15% STR10% CD12% CD21", potMin: 130, usaElemento: false, usaDte: false },
  { id: "atk15_dex10_cd12_cd21", label: "ATK15% DEX10% CD12% CD21", potMin: 130, usaElemento: false, usaDte: false },
  { id: "atk15_agi10_cd12_cd21", label: "ATK15% AGI10% CD12% CD21", potMin: 130, usaElemento: false, usaDte: false },

  // Variante MATK 119
  { id: "matk10_int10_cd10_cd22_cr30", label: "MATK10% INT10% CD10% CD22 CR30", potMin: 119, usaElemento: false, usaDte: false },

  // ==========================================
  // DTE (Sin Elemento)
  // ==========================================
  // Variante 125
  { id: "dte23_atk15_str10_cd23", label: "DTE23% ATK15% STR10% CD23", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte23_atk15_dex10_cd23", label: "DTE23% ATK15% DEX10% CD23", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte23_atk15_agi10_cd23", label: "DTE23% ATK15% AGI10% CD23", potMin: 125, usaElemento: false, usaDte: true },

  // Variante 110
  { id: "dte23_atk14_str10_cd23", label: "DTE23% ATK14% STR10% CD23", potMin: 110, usaElemento: false, usaDte: true },
  { id: "dte23_atk14_dex10_cd23", label: "DTE23% ATK14% DEX10% CD23", potMin: 110, usaElemento: false, usaDte: true },
  { id: "dte23_atk14_agi10_cd23", label: "DTE23% ATK14% AGI10% CD23", potMin: 110, usaElemento: false, usaDte: true },

  // Variante 125 (CR30)
  { id: "dte21_atk10_str10_cd21_cr30", label: "DTE21% ATK10% STR10% CD21 CR30", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte21_atk10_dex10_cd21_cr30", label: "DTE21% ATK10% DEX10% CD21 CR30", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte21_atk10_agi10_cd21_cr30", label: "DTE21% ATK10% AGI10% CD21 CR30", potMin: 125, usaElemento: false, usaDte: true },

  // Variante 118 (CR21)
  { id: "dte23_atk10_str10_cd20_cr21", label: "DTE23% ATK10% STR10% CD20 CR21", potMin: 118, usaElemento: false, usaDte: true },
  { id: "dte23_atk10_dex10_cd20_cr21", label: "DTE23% ATK10% DEX10% CD20 CR21", potMin: 118, usaElemento: false, usaDte: true },
  { id: "dte23_atk10_agi10_cd20_cr21", label: "DTE23% ATK10% AGI10% CD20 CR21", potMin: 118, usaElemento: false, usaDte: true },

  // Variante 116 (CR21 / CD23)
  { id: "dte21_atk10_str10_cd23_cr21", label: "DTE21% ATK10% STR10% CD23 CR21", potMin: 116, usaElemento: false, usaDte: true },
  { id: "dte21_atk10_dex10_cd23_cr21", label: "DTE21% ATK10% DEX10% CD23 CR21", potMin: 116, usaElemento: false, usaDte: true },
  { id: "dte21_atk10_agi10_cd23_cr21", label: "DTE21% ATK10% AGI10% CD23 CR21", potMin: 116, usaElemento: false, usaDte: true },

  // Variante 125 (CR21 / CD23)
  { id: "dte23_atk10_str10_cd23_cr21", label: "DTE23% ATK10% STR10% CD23 CR21", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte23_atk10_dex10_cd23_cr21", label: "DTE23% ATK10% DEX10% CD23 CR21", potMin: 125, usaElemento: false, usaDte: true },
  { id: "dte23_atk10_agi10_cd23_cr21", label: "DTE23% ATK10% AGI10% CD23 CR21", potMin: 125, usaElemento: false, usaDte: true },

];