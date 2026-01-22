//app/types/xtal.ts

export type Xtal = {
  id: string;          // El script genera IDs tipo "xtal_nombre"
  name: string;
  level: number;       // Necesario para el orden 0, 1, 2...
  type: string[];      // Debe ser array para usar .includes()
  upgradeFor?: string | null;
  stats: Record<string, string>; // Las estadísticas que usará la calculadora
};