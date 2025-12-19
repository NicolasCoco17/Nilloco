import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// En ESM, __dirname no existe por defecto, se define así:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usamos process.cwd() para asegurar que las rutas sean correctas en Vercel
const DYES_PATH = path.join(process.cwd(), "public", "dyes");
const OUTPUT_FILE = path.join(process.cwd(), "public", "dye-data.json");

function getDirectories(srcpath) {
  if (!fs.existsSync(srcpath)) return [];
  return fs.readdirSync(srcpath).filter(file =>
    fs.statSync(path.join(srcpath, file)).isDirectory()
  );
}

const data = { armor: [], arma: [] };

// 🔹 Armaduras
const armorRoot = path.join(DYES_PATH, "armor");
const armors = getDirectories(armorRoot);

armors.forEach(folder => {
  const subFolders = getDirectories(path.join(armorRoot, folder));
  const hasVariants = subFolders.includes("light") || subFolders.includes("heavy");

  data.armor.push({
    name: folder.replace(/_/g, " "),
    path: `/dyes/armor/${folder}`,
    hasVariants
  });
});

// 🔹 Armas
const armaRoot = path.join(DYES_PATH, "arma");
const armaTypes = getDirectories(armaRoot);

armaTypes.forEach(type => {
  const items = getDirectories(path.join(armaRoot, type));
  items.forEach(item => {
    data.arma.push({
      name: `[${type.toUpperCase()}] ${item.replace(/_/g, " ")}`,
      path: `/dyes/arma/${type}/${item}`,
      hasVariants: false
    });
  });
});

try {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log("✅ dye-data.json generado correctamente");
} catch (error) {
  console.error("❌ Error al escribir dye-data.json:", error.message);
}