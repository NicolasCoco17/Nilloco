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

  // 1. Cargar el JSON de datos
  useEffect(() => {
    fetch("/dye-data.json")
      .then((res) => res.json())
      .then((json) => {
        setDATA(json);
        setSelectedItem(json.armor[0]);
      })
      .catch((err) => console.error("Error al cargar JSON:", err));
  }, []);

  // 2. Reset de variante al cambiar de item
  useEffect(() => {
    setVariant("normal");
  }, [selectedItem]);

  if (!DATA || !selectedItem) {
    return <div style={{ color: "white", padding: "20px" }}>Cargando simulador...</div>;
  }

  // 3. Lógica de rutas corregida
  const getImgPath = (file) => {
    // Si es armadura y NO es normal, entra a la carpeta de la variante
    // Si es normal o es un arma, usa la ruta base del item
    const folderPath = (type === "armor" && variant !== "normal")
      ? `${selectedItem.path}/${variant}`
      : selectedItem.path;
    
    return `${folderPath}/${file}`;
  };

  const layerStyle = (color, file) => ({
    position: "absolute",
    inset: 0,
    backgroundColor: color,
    mixBlendMode: "multiply",
    maskImage: `url('${getImgPath(file)}')`,
    WebkitMaskImage: `url('${getImgPath(file)}')`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    opacity: 0.9,
    transition: "background-color 0.2s ease"
  });

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* --- VISOR DE IMAGEN --- */}
        <div style={styles.viewer}>
          {/* Imagen Base (base1.png) */}
          <img 
            src={getImgPath("base1.png")} 
            style={styles.base} 
            alt="base"
            onError={(e) => (e.target.style.display = 'none')}
            onLoad={(e) => (e.target.style.display = 'block')}
          />
          {/* Capas de Tinte (dye_a, dye_b, dye_c) */}
          <div style={layerStyle(colors.a, "dye_a.png")} />
          <div style={layerStyle(colors.b, "dye_b.png")} />
          <div style={layerStyle(colors.c, "dye_c.png")} />
        </div>

        {/* --- PANEL DE CONTROL --- */}
        <div style={styles.controls}>
          <h2 style={styles.title}>Toram Dye Simulator</h2>

          <label style={styles.label}>Categoría</label>
          <select
            value={type}
            onChange={(e) => {
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
            onChange={(e) =>
              setSelectedItem(DATA[type].find((i) => i.path === e.target.value))
            }
            style={styles.select}
          >
            {DATA[type].map((item) => (
              <option key={item.path} value={item.path}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Botones de Variante (Solo si el JSON dice que tiene) */}
          {type === "armor" && selectedItem.hasVariants && (
            <div style={{ marginBottom: "20px" }}>
              <label style={styles.label}>Forma (N / L / H)</label>
              <div style={styles.variantBox}>
                {["normal", "light", "heavy"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    style={{
                      ...styles.vBtn,
                      backgroundColor: variant === v ? "#0070f3" : "#222",
                      borderColor: variant === v ? "#00a2ff" : "#444"
                    }}
                  >
                    {v === "normal" ? "Normal" : v === "light" ? "Ligero" : "Pesado"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selectores de Color */}
          <div style={styles.colorSection}>
            {["a", "b", "c"].map((ch) => (
              <div key={ch} style={styles.colorRow}>
                <span>Tinte {ch.toUpperCase()}</span>
                <input
                  type="color"
                  value={colors[ch]}
                  onChange={(e) =>
                    setColors({ ...colors, [ch]: e.target.value })
                  }
                  style={styles.picker}
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
  container: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", marginTop: "10px" },
  viewer: { position: "relative", width: "320px", height: "500px", background: "#000", border: "2px solid #333", borderRadius: "12px", overflow: "hidden" },
  base: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" },
  controls: { width: "300px", background: "#151515", padding: "25px", borderRadius: "15px", border: "1px solid #222", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  title: { fontSize: "1.4rem", marginBottom: "20px", textAlign: "center", color: "#fff" },
  label: { display: "block", fontSize: "11px", color: "#666", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" },
  select: { width: "100%", padding: "12px", marginBottom: "15px", background: "#222", color: "white", border: "1px solid #333", borderRadius: "8px", outline: "none" },
  variantBox: { display: "flex", gap: "5px" },
  vBtn: { flex: 1, padding: "10px 5px", border: "1px solid", color: "white", cursor: "pointer", borderRadius: "6px", fontSize: "12px", transition: "0.3s" },
  colorSection: { borderTop: "1px solid #333", paddingTop: "20px" },
  colorRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  picker: { border: "none", width: "45px", height: "30px", cursor: "pointer", background: "none" }
};
                            
