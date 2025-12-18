import fs from "fs";
import path from "path";

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
const armors = getDirectories(path.join(DYES_PATH, "armor"));
armors.forEach(folder => {
  const subFolders = getDirectories(path.join(DYES_PATH, "armor", folder));
  const hasVariants = subFolders.includes("light") || subFolders.includes("heavy");

  data.armor.push({
    name: folder.replace(/_/g, " "),
    path: `/dyes/armor/${folder}`,
    hasVariants
  });
});

// 🔹 Armas
const armaTypes = getDirectories(path.join(DYES_PATH, "arma"));
armaTypes.forEach(type => {
  const items = getDirectories(path.join(DYES_PATH, "arma", type));
  items.forEach(item => {
    data.arma.push({
      name: `[${type.toUpperCase()}] ${item.replace(/_/g, " ")}`,
      path: `/dyes/arma/${type}/${item}`,
      hasVariants: false
    });
  });
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
console.log("✅ dye-data.json generado correctamente");
