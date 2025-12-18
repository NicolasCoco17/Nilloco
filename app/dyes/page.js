"use client";
import { useState, useEffect } from "react";

export default function DyeSimulator() {
  const [DATA, setDATA] = useState(null);
  const [type, setType] = useState("armor");
  const [selectedItem, setSelectedItem] = useState(null);
  const [variant, setVariant] = useState("normal");
  const [colors, setColors] = useState({
    a: "#ffffff",
    b: "#ffffff",
    c: "#ffffff"
  });

  // 🔹 Cargar JSON desde public/dye-data.json
  useEffect(() => {
    fetch("/dye-data.json")
      .then(res => res.json())
      .then(json => {
        setDATA(json);
        setSelectedItem(json.armor[0]);
      })
      .catch(err => console.error("Error cargando el JSON:", err));
  }, []);

  // 🔹 Reset de variante al cambiar de ítem
  useEffect(() => {
    setVariant("normal");
  }, [selectedItem]);

  if (!DATA || !selectedItem) {
    return <div style={{ color: "white", padding: "20px" }}>Cargando simulador...</div>;
  }

  // 🔹 Ruta de imagen ajustada a tus nombres de archivo
  const getImgPath = (file) => {
    const folderPath = (type === "armor" && selectedItem.hasVariants)
      ? `${selectedItem.path}/${variant}`
      : selectedItem.path;
    
    return `${folderPath}/${file}`;
  };

  const layerStyle = (color, file) => ({
    position: "absolute",
    inset: 0,
    backgroundColor: color,
    mixBlendMode: "multiply",
    // Usamos dye_a.png, dye_b.png, dye_c.png
    maskImage: `url('${getImgPath(file)}')`,
    WebkitMaskImage: `url('${getImgPath(file)}')`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    opacity: 0.9
  });

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* VISOR */}
        <div style={styles.viewer}>
          {/* Usamos base1.png */}
          <img src={getImgPath("base1.png")} style={styles.base} alt="base" />
          <div style={layerStyle(colors.a, "dye_a.png")} />
          <div style={layerStyle(colors.b, "dye_b.png")} />
          <div style={layerStyle(colors.c, "dye_c.png")} />
        </div>

        {/* CONTROLES */}
        <div style={styles.controls}>
          <h2 style={{ marginBottom: "15px" }}>Toram Dye Simulator</h2>

          <label style={styles.label}>Categoría</label>
          <select
            value={type}
            onChange={e => {
              const newType = e.target.value;
              setType(newType);
              setSelectedItem(DATA[newType][0]);
            }}
            style={styles.select}
          >
            <option value="armor">Armaduras</option>
            <option value="arma">Armas</option>
          </select>

          <label style={styles.label}>Modelo</label>
          <select
            value={selectedItem.path}
            onChange={e =>
              setSelectedItem(DATA[type].find(i => i.path === e.target.value))
            }
            style={styles.select}
          >
            {DATA[type].map(item => (
              <option key={item.path} value={item.path}>
                {item.name}
              </option>
            ))}
          </select>

          {/* VARIANTES (Normal, Ligero, Pesado) */}
          {type === "armor" && selectedItem.hasVariants && (
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Variante</label>
              <div style={styles.variantBox}>
                {["normal", "light", "heavy"].map(v => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    style={{
                      ...styles.vBtn,
                      backgroundColor: variant === v ? "#0070f3" : "#222",
                      borderColor: variant === v ? "#00a2ff" : "#444"
                    }}
                  >
                    {v === "normal" ? "N" : v === "light" ? "L" : "H"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SELECTORES DE COLOR */}
          <div style={{ borderTop: "1px solid #333", paddingTop: "15px" }}>
            {["a", "b", "c"].map(ch => (
              <div key={ch} style={styles.colorRow}>
                <span style={{ fontSize: "14px" }}>Dye {ch.toUpperCase()}</span>
                <input
                  type="color"
                  value={colors[ch]}
                  onChange={e =>
                    setColors({ ...colors, [ch]: e.target.value })
                  }
                  style={styles.colorPicker}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: { minHeight: "100vh", background: "#0a0a0a", color: "white", padding: "20px", fontFamily: "sans-serif" },
  container: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", marginTop: "20px" },
  viewer: { position: "relative", width: "320px", height: "500px", background: "#000", border: "2px solid #333", borderRadius: "8px", overflow: "hidden" },
  base: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" },
  controls: { width: "300px", background: "#151515", padding: "20px", borderRadius: "12px", border: "1px solid #222" },
  label: { display: "block", fontSize: "12px", color: "#888", marginBottom: "5px", textTransform: "uppercase" },
  select: { width: "100%", padding: "10px", marginBottom: "15px", background: "#222", color: "white", border: "1px solid #333", borderRadius: "6px" },
  variantBox: { display: "flex", gap: "8px" },
  vBtn: { flex: 1, padding: "8px", border: "1px solid", color: "white", cursor: "pointer", borderRadius: "6px", transition: "0.2s" },
  colorRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  colorPicker: { border: "none", width: "40px", height: "40px", cursor: "pointer", background: "none" }
};
