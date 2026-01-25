import { STAT_ID } from "@/lib/engine/statIds";
import { useState } from "react";

// Invertimos el diccionario para buscar Nombre por ID
// Ej: { 21: "ATK_P", 3: "STR", ... }
const ID_TO_NAME: Record<number, string> = {};
Object.entries(STAT_ID).forEach(([key, value]) => {
  ID_TO_NAME[value] = key;
});

export function DebugPanel({ rawStats }: { rawStats: number[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!rawStats || rawStats.length === 0) return null;

  // Filtramos solo los stats que no sean 0
  const activeStats = rawStats
    .map((val, id) => ({ id, val, name: ID_TO_NAME[id] || `UNKNOWN_ID_${id}` }))
    .filter((s) => s.val !== 0);

  return (
    <div style={styles.container}>
      <button onClick={() => setIsOpen(!isOpen)} style={styles.btn}>
        {isOpen ? "Cerrar Debug" : "🐞 Ver Stats Sumados (Debug)"}
      </button>

      {isOpen && (
        <div style={styles.panel}>
          <h4 style={{ borderBottom: '1px solid #444', paddingBottom: '5px', marginBottom: '10px' }}>
            Stats Acumulados (Raw)
          </h4>
          <div style={styles.grid}>
            {activeStats.map((s) => (
              <div key={s.id} style={styles.row}>
                <span style={styles.name} title={`ID: ${s.id}`}>{s.name}</span>
                <span style={styles.val}>{s.val}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:'10px', color:'#888', marginTop:'10px'}}>
            * Estos son los valores SUMADOS de todo tu equipo, xtals, skills y comida, 
            antes de calcular el daño final.
          </p>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: 9999,
  },
  btn: {
    background: '#d63031',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  panel: {
    background: 'rgba(0, 0, 0, 0.95)',
    color: '#00ff88',
    padding: '15px',
    borderRadius: '8px',
    width: '300px',
    maxHeight: '500px',
    overflowY: 'auto',
    marginTop: '10px',
    border: '1px solid #444',
    fontFamily: 'monospace',
    fontSize: '12px'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dotted #333'
  },
  name: {
    color: '#fff'
  },
  val: {
    color: '#fab1a0',
    fontWeight: 'bold'
  }
};