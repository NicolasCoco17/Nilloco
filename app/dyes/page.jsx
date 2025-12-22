//app/dye/page.jsx

"use client";
import { useState, useEffect, useRef } from "react";
import { TORAM_PALETTE } from "./constants"; 

export default function DyeSimulator() {
  const canvasRef = useRef(null);
  const [DATA, setDATA] = useState(null);
  const [type, setType] = useState("armor");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [gender, setGender] = useState("female"); 
  const [variant, setVariant] = useState("normal"); 
  const [selectedDyes, setSelectedDyes] = useState({ a: 0, b: 0, c: 0 });

  useEffect(() => {
    fetch("/dye-data.json")
      .then(res => res.json())
      .then(json => {
        setDATA(json);
        setSelectedItem(json.armor[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedItem) return;

    const render = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      let basePath = `${selectedItem.path}/${gender}`;
      if (variant !== "normal") basePath = `${basePath}/${variant}`;

      const load = (src) => new Promise(res => {
        const i = new Image(); i.src = src;
        i.onload = () => res(i); i.onerror = () => res(null);
      });

      const [base, dA, dB, dC] = await Promise.all([
        load(`${basePath}/base1.png`),
        load(`${basePath}/dye_a.png`),
        load(`${basePath}/dye_b.png`),
        load(`${basePath}/dye_c.png`),
      ]);

      ctx.clearRect(0, 0, 400, 600);
      
      // 1. DIBUJAR BASE
      if (base) {
        ctx.drawImage(base, 0, 0, 400, 600);
        const ambientLight = ctx.createRadialGradient(200, 180, 80, 200, 300, 500);
        ambientLight.addColorStop(0, "rgba(255, 255, 255, 0.04)"); 
        ambientLight.addColorStop(1, "rgba(0, 0, 0, 0.10)"); 
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = ambientLight;
        ctx.fillRect(0, 0, 400, 600);
        ctx.globalCompositeOperation = "source-over";
      }

      // 2. FUNCIÓN DE TINTE (ESTRUCTURA CORREGIDA)
      const apply = (img, dyeId, channel) => {
        if (!img || dyeId == 0) return;
        const color = TORAM_PALETTE.find(d => d.id == dyeId).hex;
        
        const tmp = document.createElement("canvas");
        tmp.width = 400; tmp.height = 600;
        const tCtx = tmp.getContext("2d");
        
        tCtx.drawImage(img, 0, 0, 400, 600);
        tCtx.globalCompositeOperation = "source-in";

        if (channel === 'a') {
          // 1️⃣ AJUSTE ROJO (A): Degradado más suave para no oscurecer tanto los pies
          const gradA = tCtx.createLinearGradient(0, 50, 0, 500);
          gradA.addColorStop(0, color);           
          gradA.addColorStop(0.7, color + "99");  
          gradA.addColorStop(1, color + "66");    // Cambiado de "44" a "66" para mantener el color vivo
          tCtx.fillStyle = gradA;
        } else {
          tCtx.fillStyle = color;
        }
        
        tCtx.fillRect(0, 0, 400, 600);

        if (channel === 'b') {
          ctx.globalAlpha = 0.85;
          ctx.globalCompositeOperation = "overlay"; 
          ctx.drawImage(tmp, 0, 0);
          ctx.globalAlpha = 0.25; 
          ctx.globalCompositeOperation = "screen"; 
          ctx.drawImage(tmp, 0, 0);
        } else if (channel === 'c') {
          // 2️⃣ AJUSTE VERDE (C): Look más mate y realista
          ctx.globalAlpha = 0.80; 
          ctx.globalCompositeOperation = "multiply"; 
          ctx.drawImage(tmp, 0, 0);
          
          ctx.globalAlpha = 0.30; // Bajado de 0.40 a 0.30 para quitar el efecto plástico
          ctx.globalCompositeOperation = "soft-light";
          ctx.drawImage(tmp, 0, 0);
        } else {
          ctx.globalAlpha = 0.88; 
          ctx.globalCompositeOperation = "multiply"; 
          ctx.drawImage(tmp, 0, 0);
        }
        
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
      };
      // 3. EJECUTAR TINTES
      apply(dA, selectedDyes.a, 'a');
      apply(dB, selectedDyes.b, 'b');
      apply(dC, selectedDyes.c, 'c');

      // 4. FOCO DE LUZ FINAL
      // 3️⃣ ILUMINACIÓN GLOBAL: Foco centrado en torso y menos contraste en pies
      const gradient = ctx.createRadialGradient(200, 200, 60, 200, 320, 480); 

      gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)"); // Luz frontal muy sutil
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.10)");       // Sombra más suave hacia afuera
            
      ctx.globalCompositeOperation = "soft-light"; 
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 600);
      ctx.globalCompositeOperation = "source-over";
    };

    render();
  }, [selectedItem, gender, variant, selectedDyes]);

  if (!DATA || !selectedItem) return <div className="text-white p-10">Cargando datos...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-center p-6 gap-10">
      <div className="relative border-4 border-[#3a2700] rounded-lg bg-[#151515] shadow-2xl">
        <canvas 
          ref={canvasRef} 
          width="400" 
          height="600" 
          className="w-[300px] h-[450px] md:w-[400px] md:h-[600px]"
          style={{ 
            filter: "saturate(1.1) contrast(1.05)", 
            imageRendering: "pixelated" 
          }} 
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {["male", "female"].map(g => (
            <button 
              key={g}
              onClick={() => setGender(g)}
              className={`w-10 h-10 rounded-full font-bold border-2 transition ${gender === g ? 'bg-[#f1c40f] border-white text-black' : 'bg-[#222] border-[#444] text-gray-500'}`}
            >
              {g === "male" ? "♂" : "♀"}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm bg-[#151515] p-6 rounded-2xl border border-[#222]">
        <h2 className="text-[#f1c40f] text-center font-bold mb-6 text-xl tracking-widest uppercase">Simulad or</h2>
        <div className="mb-6">
          <label className="text-[10px] text-gray-500 uppercase block mb-2">Equipment Model</label>
          <select 
            onChange={(e) => setSelectedItem(DATA[type].find(i => i.path === e.target.value))}
            className="w-full bg-black text-white p-3 border border-[#333] rounded-lg outline-none focus:border-[#f1c40f]"
          >
            {DATA[type].map(item => <option key={item.path} value={item.path}>{item.name}</option>)}
          </select>
        </div>

        <div className="mb-8">
          <label className="text-[10px] text-gray-500 uppercase block mb-2">Variant Style</label>
          <div className="flex gap-2">
            {["normal", "light", "heavy"].map(v => (
              <button 
                key={v} 
                onClick={() => setVariant(v)}
                className={`flex-1 py-2 rounded font-bold text-[11px] uppercase transition ${variant === v ? 'bg-[#f1c40f] text-black' : 'bg-[#222] text-gray-500 border border-[#333]'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#222]">
          {['a', 'b', 'c'].map(ch => (
            <div key={ch} className="flex items-center gap-4">
              <span className="text-[#f1c40f] font-black w-6 text-center">{ch.toUpperCase()}</span>
              <select
                value={selectedDyes[ch]}
                onChange={(e) => setSelectedDyes({...selectedDyes, [ch]: e.target.value})}
                className="flex-1 bg-black text-white p-2 border border-[#333] rounded-md outline-none"
                style={{ 
                  borderLeft: `12px solid ${TORAM_PALETTE.find(d => d.id == selectedDyes[ch])?.hex || '#333'}` 
                }}
              >
                {TORAM_PALETTE.map(d => (
                  <option 
                    key={d.id} 
                    value={d.id} 
                    style={{ 
                      backgroundColor: d.hex, 
                      color: (parseInt(d.hex.replace('#',''), 16) > 0xffffff / 1.5) ? 'black' : 'white' 
                    }}
                  >
                    Dye {d.id} {d.id === 0 ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}