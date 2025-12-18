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

  // 🔹 Cargar JSON
  useEffect(() => {
    fetch("/dye-data.json")
      .then(res => res.json())
      .then(json => {
        setDATA(json);
        setSelectedItem(json.armor[0]);
      });
  }, []);

  // 🔹 Reset de variante
  useEffect(() => {
    setVariant("normal");
  }, [selectedItem]);

  if (!DATA || !selectedItem) {
    return <div style={{ color: "white" }}>Cargando simulador...</div>;
  }

  // 🔹 Ruta de imagen
  const getImgPath = file => {
    if (type === "armor" && selectedItem.hasVariants) {
      return `${selectedItem.path}/${variant}/${file}`;
    }
    return `${selectedItem.path}/${file}`;
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
    opacity: 0.9
  });

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* VISOR */}
        <div style={styles.viewer}>
          <img src={getImgPath("base1.png")} style={styles.base} alt="base" />
          <div style={layerStyle(colors.a, "a.png")} />
          <div style={layerStyle(colors.b, "b.png")} />
          <div style={layerStyle(colors.c, "c.png")} />
        </div>

        {/* CONTROLES */}
        <div style={styles.controls}>
          <h2>Toram Dye Simulator</h2>

          <select
            value={type}
            onChange={e => {
              setType(e.target.value);
              setSelectedItem(DATA[e.target.value][0]);
            }}
            style={styles.select}
          >
            <option value="armor">Armaduras</option>
            <option value="arma">Armas</option>
          </select>

          <select
            value={selectedItem.path}
            onChange={e =>
              setSelectedItem(
                DATA[type].find(i => i.path === e.target.value)
              )
            }
            style={styles.select}
          >
            {DATA[type].map(item => (
              <option key={item.path} value={item.path}>
                {item.name}
              </option>
            ))}
          </select>

          {/* VARIANTES */}
          {selectedItem.hasVariants && (
            <div style={styles.variantBox}>
              {["normal", "light", "heavy"].map(v => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  style={{
                    ...styles.vBtn,
                    backgroundColor: variant === v ? "#555" : "#222"
                  }}
                >
                  {v[0].toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* COLORES */}
          {["a", "b", "c"].map(ch => (
            <div key={ch} style={styles.colorRow}>
              <span>Dye {ch.toUpperCase()}</span>
              <input
                type="color"
                value={colors[ch]}
                onChange={e =>
                  setColors({ ...colors, [ch]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "white",
    padding: "20px",
    fontFamily: "sans-serif"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px"
  },
  viewer: {
    position: "relative",
    width: "320px",
    height: "480px",
    background: "#000",
    border: "1px solid #333"
  },
  base: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  controls: {
    width: "280px",
    background: "#151515",
    padding: "20px",
    borderRadius: "10px"
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#222",
    color: "white",
    border: "1px solid #333"
  },
  variantBox: {
    display: "flex",
    gap: "5px",
    marginBottom: "15px"
  },
  vBtn: {
    flex: 1,
    padding: "8px",
    border: "1px solid #444",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px"
  },
  colorRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  }
};
