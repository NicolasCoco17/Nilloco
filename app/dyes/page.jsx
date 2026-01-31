"use client";
import { useState, useEffect, useRef } from "react";
import { TORAM_PALETTE } from "./constants"; 

// --- COMPONENTE: Selector de Color ---
const DyePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDye = TORAM_PALETTE.find(d => d.id == value) || TORAM_PALETTE[0];

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-3">
        <span className="text-[#f1c40f] font-black w-6 text-center text-lg drop-shadow-md">{label}</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded p-2 hover:border-[#f1c40f] transition shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm border border-white/20 shadow-inner" style={{ backgroundColor: selectedDye.hex }} />
            <span className="text-gray-200 font-mono text-xs">
              {selectedDye.id === 0 ? "Original" : `Dye #${selectedDye.id}`}
            </span>
          </div>
          <span className="text-gray-500 text-[10px]">▼</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-10 right-0 mt-1 h-64 overflow-y-auto bg-[#151515] border border-[#444] rounded shadow-2xl z-50 grid grid-cols-1 divide-y divide-[#2a2a2a]">
            {TORAM_PALETTE.map((dye) => (
              <button
                key={dye.id}
                onClick={() => { onChange(dye.id); setIsOpen(false); }}
                className="flex items-center gap-3 p-2 hover:bg-[#333] transition text-left group"
              >
                <div className="w-4 h-4 rounded-sm border border-white/10 shadow-sm" style={{ backgroundColor: dye.hex }} />
                <span className={`font-mono text-xs ${dye.id === value ? 'text-[#f1c40f]' : 'text-gray-400 group-hover:text-white'}`}>
                  {dye.id === 0 ? "Original" : `ID ${dye.id}`}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function DyeSimulator() {
  const canvasRef = useRef(null);
  
  // Datos
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingError, setLoadingError] = useState(false);
  
  // Estados del Personaje
  const [gender, setGender] = useState("female"); 
  const [variant, setVariant] = useState("normal"); 
  const [selectedDyes, setSelectedDyes] = useState({ a: 0, b: 0, c: 0 });

  // 1. Cargar JSON
  useEffect(() => {
    fetch("/dye-data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Error loading JSON");
        return res.json();
      })
      .then((json) => {
        setData(json);
        if (json.armor && json.armor.length > 0) setSelectedItem(json.armor[0]);
      })
      .catch((err) => {
        console.error(err);
        setLoadingError(true);
      });
  }, []);

  // 2. MOTOR DE RENDERIZADO (Estilo Coryn / Toram Realista)
  useEffect(() => {
    if (!selectedItem) return;

    const render = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      // Construir rutas
      let basePath = `${selectedItem.path}/${gender}`;
      if (variant !== "normal") basePath = `${basePath}/${variant}`;

      const load = (src) => new Promise(res => {
        const i = new Image(); i.src = src;
        i.onload = () => res(i); i.onerror = () => res(null);
      });

      // Cargar texturas
      const [base, dA, dB, dC] = await Promise.all([
        load(`${basePath}/base1.png`),
        load(`${basePath}/dye_a.png`),
        load(`${basePath}/dye_b.png`),
        load(`${basePath}/dye_c.png`),
      ]);

      // Limpiar canvas
      ctx.clearRect(0, 0, 400, 600);
      
      // A. CAPA BASE (Piel)
      if (base) {
        ctx.drawImage(base, 0, 0, 400, 600);
      }

      // --- FUNCIÓN DE CAPAS MEJORADA ---
      // Esta función simula lo que hace Coryn con múltiples canvas y opacidad
      const applyLayer = (img, dyeId, intensity = 1.0) => {
        if (!img) return;

        const tmp = document.createElement("canvas");
        tmp.width = 400; tmp.height = 600;
        const tCtx = tmp.getContext("2d");
        
        const colorObj = TORAM_PALETTE.find(d => d.id == dyeId);
        // Color por defecto si no hay tinte
        const color = (dyeId !== 0 && colorObj) ? colorObj.hex : "#B0B0B0"; 

        // PASO 1: COLOR BASE
        tCtx.fillStyle = color;
        tCtx.fillRect(0, 0, 400, 600);

        // Recortar forma
        tCtx.globalCompositeOperation = "destination-in";
        tCtx.drawImage(img, 0, 0, 400, 600);

        if (dyeId !== 0) {
            // PASO 2: SOMBRAS (MULTIPLY) - AQUÍ ESTABA EL PROBLEMA
            // Bajamos de 0.8 a 0.35. 
            // Solo queremos oscurecer las grietas profundas, no toda la tela.
            tCtx.globalCompositeOperation = "multiply";
            tCtx.globalAlpha = 0.35; // <--- MUCHO MÁS BAJO (Antes 0.8)
            tCtx.drawImage(img, 0, 0, 400, 600);

            // PASO 3: BRILLO / RELIEVE (HARD-LIGHT)
            // Subimos de 0.4 a 0.7.
            // Esto hace que los blancos de la textura resalten más sobre el color.
            tCtx.globalCompositeOperation = "hard-light"; 
            tCtx.globalAlpha = 0.7; // <--- MÁS ALTO (Antes 0.4)
            tCtx.drawImage(img, 0, 0, 400, 600);
            
            // PASO 4 (OPCIONAL): TOQUE FINAL DE CONTRASTE (SOFT-LIGHT)
            // Ayuda a unificar el color sin oscurecer.
            tCtx.globalCompositeOperation = "soft-light";
            tCtx.globalAlpha = 0.4;
            tCtx.drawImage(img, 0, 0, 400, 600);

            // Restaurar Alpha
            tCtx.globalAlpha = 1.0;
        } else {
            // Original
            tCtx.globalCompositeOperation = "source-over";
            tCtx.drawImage(img, 0, 0, 400, 600);
        }

        // PINTAR
        ctx.globalAlpha = intensity; 
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(tmp, 0, 0);
        ctx.globalAlpha = 1.0; 
      };

      // --- APLICAR CAPAS EN ORDEN ---
      // Puedes ajustar la intensidad (0.0 - 1.0) si sientes que un color es muy fuerte
      applyLayer(dA, selectedDyes.a, 1.0); // Capa A
      applyLayer(dB, selectedDyes.b, 1.0); // Capa B
      applyLayer(dC, selectedDyes.c, 1.0); // Capa C

      // Sombra ambiental sutil (Vignette)
      const grad = ctx.createRadialGradient(200, 300, 150, 200, 300, 400);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,400,600);
    };

    render();
  }, [selectedItem, gender, variant, selectedDyes]);

  if (loadingError) return <div className="text-red-500 p-10">Error cargando datos. Revisa public/dye-data.json</div>;
  if (!data || !selectedItem) return <div className="text-[#f1c40f] p-10 animate-pulse">Cargando recursos...</div>;

  return (
    <main className="min-h-screen bg-[#101010] flex flex-col md:flex-row items-center justify-center p-6 gap-8 font-sans">
      
      {/* VISOR */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#3a2700] to-[#5a4000] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative border-2 border-[#444] rounded-lg bg-[#181818] shadow-2xl overflow-hidden">
          {/* Fondo cuadriculado estilo editor */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <canvas 
            ref={canvasRef} 
            width="400" 
            height="600" 
            className="w-[300px] h-[450px] md:w-[350px] md:h-[525px] object-contain"
            style={{ imageRendering: "pixelated" }} 
          />
          
          {/* Botones Flotantes Genero */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {["male", "female"].map(g => (
              <button 
                key={g}
                onClick={() => setGender(g)}
                className={`w-8 h-8 rounded shadow-lg border transition-all text-sm font-bold flex items-center justify-center
                  ${gender === g 
                    ? 'bg-[#f1c40f] border-[#f1c40f] text-black translate-x-1' 
                    : 'bg-[#222] border-[#444] text-gray-500 hover:text-gray-200 hover:border-gray-400'}`}
              >
                {g === "male" ? "M" : "F"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL DE CONTROL */}
      <div className="w-full max-w-sm bg-[#181818] p-6 rounded-xl border border-[#333] shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-[#333] pb-4">
          <h2 className="text-[#f1c40f] font-bold uppercase tracking-widest text-sm">
            Personalización
          </h2>
          <span className="text-xs text-gray-600">v2.0 Toram Style</span>
        </div>
        
        {/* Selector de Armadura */}
        <div className="mb-5">
          <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Modelo</label>
          <select 
            className="w-full bg-[#111] text-gray-200 text-sm p-3 rounded border border-[#333] outline-none focus:border-[#f1c40f] transition"
            onChange={(e) => setSelectedItem(data.armor.find(i => i.path === e.target.value))}
            value={selectedItem.path}
          >
            {data.armor.map(item => <option key={item.path} value={item.path}>{item.name}</option>)}
          </select>
        </div>

        {/* Variantes (Botones) */}
        <div className="mb-8">
          <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Apariencia</label>
          <div className="flex bg-[#111] p-1 rounded border border-[#333]">
            {["normal", "light", "heavy"].map(v => (
              <button 
                key={v} 
                onClick={() => setVariant(v)}
                className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold transition-colors
                  ${variant === v ? 'bg-[#f1c40f] text-black shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Tintes */}
        <div className="space-y-2">
          {['a', 'b', 'c'].map(ch => (
            <DyePicker 
              key={ch}
              label={ch.toUpperCase()}
              value={selectedDyes[ch]}
              onChange={(newVal) => setSelectedDyes(prev => ({ ...prev, [ch]: newVal }))}
            />
          ))}
        </div>
      </div>
    </main>
  );
}