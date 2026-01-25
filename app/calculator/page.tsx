//app/calculator/page.tsx
"use client";

import { useState, useMemo } from "react";
import { WEAPON_TYPES, SUB_TYPES } from "@/lib/constants";
import { useToramData } from "@/hooks/useToramData";
import { calcCharacterStatus } from "@/lib/engine/index";
import { EquipmentSlot } from "@/components/calculator/EquipmentSlot";
import type { XtalSlotState } from "@/components/calculator/XtalSelect";
import { PASSIVE_SKILLS_DATA, AVATAR_STAT_LIST, BUFFLAND_STAT_LIST } from "@/lib/constants";
import { StatusDisplay } from "@/components/calculator/StatusDisplay";
import { DebugPanel } from "@/components/calculator/DebugPanel";

/* ======================
   TIPOS Y HELPERS
====================== */
type SimpleStat = { key: string; value: number };
const PERSONAL_STATS = ["NA", "CRT", "LUK", "TEC", "MTL"];

const formatBuffStats = (stats: SimpleStat[] | Record<string, number> = []) => {
  if (Array.isArray(stats)) {
    return stats.filter(s => s.value !== 0).map(s => `${s.key} +${s.value}`).join(" | ");
  } else {
    return Object.entries(stats).filter(([, v]) => v !== 0).map(([k, v]) => `${k} +${v}`).join(" | ");
  }
};

export default function CalculatorPage() {
  /* ======================
     1. ESTADOS
  ====================== */
  const [level, setLevel] = useState(1);
  const [baseStats, setBaseStats] = useState({ STR: 1, INT: 1, VIT: 1, AGI: 1, DEX: 1 });
  const [personalStatType, setPersonalStatType] = useState("NA");
  const [personalStatValue, setPersonalStatValue] = useState(0);

  const [mainType, setMainType] = useState(WEAPON_TYPES[0]);
  const [subType, setSubType] = useState(SUB_TYPES[0]);
  const [skills, setSkills] = useState<Record<string, number>>({});

  // Equipo
  const [weapon, setWeapon] = useState<any>(null);
  const [weaponRefine, setWeaponRefine] = useState("S");
  const [weaponXtals, setWeaponXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });

  const [subWeapon, setSubWeapon] = useState<any>(null);
  const [subRefine, setSubRefine] = useState("0");

  const [armor, setArmor] = useState<any>(null);
  const [armorRefine, setArmorRefine] = useState("S");
  const [armorXtals, setArmorXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });
  const [armorType, setArmorType] = useState<"normal" | "light" | "heavy">("normal");

  const [additional, setAdditional] = useState<any>(null);
  const [addRefine, setAddRefine] = useState("S");
  const [addXtals, setAddXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });

  const [special, setSpecial] = useState<any>(null);
  const [specialRefine, setSpecialRefine] = useState("0"); // Se usa internamente pero no se muestra
  const [specialXtals, setSpecialXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });

  // Extras
  const [avatars, setAvatars] = useState(Array.from({ length: 9 }, () => ({ key: "", value: 0 })));
  const [buffland, setBuffland] = useState(Array.from({ length: 5 }, () => ({ key: "", value: 0 })));
  const [foods, setFoods] = useState(Array(10).fill(null));
  const [activeRegistlets, setActiveRegistlets] = useState<{ id: string; level: number }[]>(Array.from({ length: 10 }, () => ({ id: "", level: 1 })));

  /* ======================
     2. DATA HOOK
  ====================== */
  const { 
      weapons, subWeapons, armors, additionals, specials, xtals,
      registletsList, bufflandList, consumablesList 
  } = useToramData(mainType.id, subType.id);  

  // LISTAS DE XTALS COMBINADAS
    const weaponXtalList = useMemo(() => [...xtals.weapons, ...xtals.normal], [xtals]);
    const armorXtalList = useMemo(() => [...xtals.armors, ...xtals.normal], [xtals]);
    const addXtalList = useMemo(() => [...xtals.add, ...xtals.normal], [xtals]);
    const ringXtalList = useMemo(() => [...xtals.ring, ...xtals.normal], [xtals]);

  /* ======================
     3. CÁLCULO
  ====================== */
  const finalStats = useMemo(() => {
    // Helper para buscar xtal
    const findXtal = (id: string, list: any[]) => {
      if (!id || id === "-1") return null;
      return list.find(x => String(x.id) === String(id)) || null;
    };

    // Arrays limpios
    const avatarStats = avatars.filter(a => a.key && a.value !== 0);
    const bufflandStats = buffland.filter(b => b.key && b.value !== 0);
    
    // Comidas
    const activeFoodsData = foods.filter(f => f && f.id).map(f => consumablesList.find((c: any) => c.id === f.id)).filter(Boolean);
    const consumableStats = [{ 
      name: "Active Foods", 
      stats: activeFoodsData.reduce((acc: any, curr: any) => {
        if(!curr.stats) return acc;
        Object.entries(curr.stats).forEach(([k, v]) => acc[k] = (acc[k] || 0) + Number(v));
        return acc;
      }, {} as Record<string, number>)
    }];

    // Registlets
    const registletsInput = activeRegistlets
      .map(ar => {
         const def = registletsList.find((r:any) => r.id === ar.id);
         return def ? { ...def, level: ar.level } : null;
      }).filter(Boolean);

    // Personal Stat
    let personalInput = undefined;
    if (personalStatType !== "NA") {
        personalInput = { type: personalStatType as any, value: personalStatValue };
    }

    // Construcción de equipo
    const equipList = [
      { 
        ...weapon, refine: weaponRefine, type: "main", stability: weapon?.stability ?? weapon?.base_stability,
        xtals: { x1: findXtal(weaponXtals.x1, weaponXtalList), x2: findXtal(weaponXtals.x2, weaponXtalList) }
      },
      { 
        ...subWeapon, refine: subRefine, type: "sub", stability: weapon?.stability ?? weapon?.base_stability,
      },
      { 
        ...armor, refine: armorRefine, type: "armor",
        xtals: { x1: findXtal(armorXtals.x1, armorXtalList), x2: findXtal(armorXtals.x2, armorXtalList) }
      },
      { 
        ...additional, refine: addRefine, type: "add",
        xtals: { x1: findXtal(addXtals.x1, addXtalList), x2: findXtal(addXtals.x2, addXtalList) }
      },
      { 
        ...special, refine: specialRefine, type: "special",
        xtals: { x1: findXtal(specialXtals.x1, ringXtalList), x2: findXtal(specialXtals.x2, ringXtalList) }
      },
    ].filter(item => item && (item.id || item.uid));

    return calcCharacterStatus({
      level, baseStats,
      weaponType: mainType.id, subWeaponType: subType.id, armorType,
      equipment: equipList,
      registlets: registletsInput,
      skills,
      avatars: avatarStats,
      consumables: consumableStats,
      buffland: bufflandStats,
      personal: personalInput, 
    });
  }, [
    level, baseStats, personalStatType, personalStatValue, mainType, subType, armorType,
    weapon, weaponRefine, weaponXtals, subWeapon, subRefine,
    armor, armorRefine, armorXtals, additional, addRefine, addXtals,
    special, specialRefine, specialXtals,
    skills, avatars, foods, buffland, activeRegistlets, 
    registletsList, consumablesList, xtals
  ]);

  // COMBINAR LISTAS PARA RENDER (Memoizado para no recalcular en cada render)
  const combinedWeaponXtals = useMemo(() => [...xtals.weapons, ...xtals.normal], [xtals]);
  const combinedArmorXtals = useMemo(() => [...xtals.armors, ...xtals.normal], [xtals]);
  const combinedAddXtals = useMemo(() => [...xtals.add, ...xtals.normal], [xtals]);
  const combinedRingXtals = useMemo(() => [...xtals.ring, ...xtals.normal], [xtals]);

  const statKeys = Object.keys(baseStats) as Array<keyof typeof baseStats>;

  // Guardar en el navegador
  const saveBuildLocal = () => {
    const buildData = {
      level,
      baseStats,
      personalStatType,
      personalStatValue,
      mainType,
      subType,
      skills,
      // Equipo
      weapon, weaponRefine, weaponXtals,
      subWeapon, subRefine,
      armor, armorRefine, armorXtals, armorType,
      additional, addRefine, addXtals,
      special, specialRefine, specialXtals,
      // Extras
      avatars,
      buffland,
      foods,
      activeRegistlets
    };

    try {
      localStorage.setItem("toram_build_test", JSON.stringify(buildData));
      alert("✅ Build guardada localmente.");
    } catch (e) {
      console.error(e);
      alert("❌ Error al guardar (posiblemente límite de espacio).");
    }
  };

  // Cargar desde el navegador
  const loadBuildLocal = () => {
    const saved = localStorage.getItem("toram_build_test");
    if (!saved) {
      alert("⚠️ No hay build guardada.");
      return;
    }

    try {
      const data = JSON.parse(saved);
      
      // Restaurar estados uno por uno (con validación básica)
      if (data.level) setLevel(data.level);
      if (data.baseStats) setBaseStats(data.baseStats);
      if (data.personalStatType) setPersonalStatType(data.personalStatType);
      if (data.personalStatValue !== undefined) setPersonalStatValue(data.personalStatValue);
      
      if (data.mainType) setMainType(data.mainType);
      if (data.subType) setSubType(data.subType);
      if (data.skills) setSkills(data.skills);

      // Equipo (Es importante restaurar el objeto completo o null)
      setWeapon(data.weapon || null);
      if (data.weaponRefine) setWeaponRefine(data.weaponRefine);
      if (data.weaponXtals) setWeaponXtals(data.weaponXtals);

      setSubWeapon(data.subWeapon || null);
      if (data.subRefine) setSubRefine(data.subRefine);

      setArmor(data.armor || null);
      if (data.armorRefine) setArmorRefine(data.armorRefine);
      if (data.armorXtals) setArmorXtals(data.armorXtals);
      if (data.armorType) setArmorType(data.armorType);

      setAdditional(data.additional || null);
      if (data.addRefine) setAddRefine(data.addRefine);
      if (data.addXtals) setAddXtals(data.addXtals);

      setSpecial(data.special || null);
      if (data.specialRefine) setSpecialRefine(data.specialRefine);
      if (data.specialXtals) setSpecialXtals(data.specialXtals);

      // Extras
      if (data.avatars) setAvatars(data.avatars);
      if (data.buffland) setBuffland(data.buffland);
      if (data.foods) setFoods(data.foods);
      if (data.activeRegistlets) setActiveRegistlets(data.activeRegistlets);

      alert("✅ Build cargada correctamente.");
    } catch (e) {
      console.error(e);
      alert("❌ Error al leer los datos guardados.");
    }
  };

  // Limpiar
  const clearBuildLocal = () => {
      if(confirm("¿Estás seguro de borrar los datos guardados?")) {
          localStorage.removeItem("toram_build_test");
          alert("🗑️ Datos borrados.");
      }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Toram Calculator <span style={{fontSize:'0.5em', color:'#666'}}>v3.1 Final</span></h1>
        {/* --- TOOLBAR DE TEST --- */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={saveBuildLocal}
            style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            💾 Guardar Build
          </button>
          
          <button 
            onClick={loadBuildLocal}
            style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📂 Cargar Build
          </button>

          <button 
            onClick={clearBuildLocal}
            style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🗑️ Borrar
          </button>
        </div>
      < div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* COLUMNA 1 */}
        <div>
          {/* LEVEL & BASE STATS ... (Igual que antes) */}
          <div style={styles.card}>
            <div style={styles.section}>
              <span style={styles.label}>Level</span>
              <input type="number" style={{...styles.miniInput, fontSize:'1.5em', height:'50px'}} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
            </div>
            <div style={styles.section}>
              <span style={styles.label}>Base Stats</span>
              <div style={{display:'flex', gap:'5px'}}>
                {statKeys.map((key) => (
                  <div key={key} style={{textAlign:'center'}}>
                    <span style={{fontSize:'10px', color:'#888'}}>{key}</span>
                    <input type="number" style={styles.miniInput} value={baseStats[key]} onChange={(e) => setBaseStats(prev => ({...prev, [key]: Number(e.target.value)}))} />
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.section}>
              <span style={styles.label}>Personal Stat</span>
              <div style={styles.compactRow}>
                <select style={styles.select} value={personalStatType} onChange={(e) => setPersonalStatType(e.target.value)}>
                  {PERSONAL_STATS.map(s => <option key={s} value={s}>{s === "NA" ? "-" : s}</option>)}
                </select>
                <input type="number" style={{...styles.miniInput, opacity: personalStatType === "NA" ? 0.5 : 1}} value={personalStatValue} onChange={(e) => setPersonalStatValue(Number(e.target.value))} disabled={personalStatType === "NA"} />
              </div>
            </div>
          </div>

          {/* SKILLS ... (Igual) */}
          <div style={{ ...styles.card, marginTop: '20px' }}>
            <h3 style={{color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px'}}>Passive Skills</h3>
            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
              <div style={styles.skillGrid}>
                {PASSIVE_SKILLS_DATA.map(skill => (
                  <div key={skill.id} style={styles.skillCard}>
                    <div style={styles.skillHeader}>
                      <img src={skill.img} alt={skill.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <span style={styles.skillName} title={skill.name}>{skill.name}</span>
                    </div>
                    <select className="form-control" style={styles.select ?? styles.miniInput} value={skills[skill.id] || 0} onChange={(e) => setSkills(prev => ({ ...prev, [skill.id]: Number(e.target.value) }))}>
                      {[...Array(11)].map((_, v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REGISTLETS */}
          <div style={{...styles.card, marginTop:'20px'}}>
              <h3 style={styles.label}>Registlets</h3>
              {activeRegistlets.map((reg, idx) => (
                <div key={idx} style={styles.compactRow}>
                    <select style={{...styles.select, flex: 2}} value={reg.id} onChange={(e) => { const newRegs = [...activeRegistlets]; newRegs[idx].id = e.target.value; setActiveRegistlets(newRegs); }}>
                      <option value="">-- None --</option>
                      {registletsList.map((r:any) => <option key={r.id} value={r.id}>{r.name} ({r.stat})</option>)}
                    </select>
                    <input type="number" min="1" max="100" placeholder="Lv" style={{...styles.miniInput, width:'60px'}} value={reg.level} onChange={(e) => { const newRegs = [...activeRegistlets]; newRegs[idx].level = Number(e.target.value); setActiveRegistlets(newRegs); }} />
                </div>
              ))}
          </div>
        </div>

        {/* COLUMNA 2: EQUIPO (AQUÍ ESTÁ LA CORRECCIÓN DE XTALS) */}
        <div>
          <div style={styles.card}>
            <div style={styles.section}>
              <span style={styles.label}>Main Weapon</span>
              <select style={styles.select} value={mainType.id} onChange={(e) => setMainType(WEAPON_TYPES.find((t: any) => t.id === e.target.value) || WEAPON_TYPES[0])}>
                {WEAPON_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <div style={{marginTop:'10px'}}>
                 <EquipmentSlot 
                    label="" category="weapon"
                    items={weapons} selectedItem={weapon} onSelect={setWeapon}
                    refineValue={weaponRefine} onRefineChange={setWeaponRefine}
                    xtalList={combinedWeaponXtals} xtals={weaponXtals} setXtals={setWeaponXtals}
                 />
              </div>
            </div>

            <div style={styles.section}>
              <span style={styles.label}>Sub Weapon</span>
              <select style={styles.select} value={subType.id} onChange={(e) => setSubType(SUB_TYPES.find((t: any) => t.id === e.target.value) || SUB_TYPES[0])}>
                {SUB_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <div style={{marginTop:'10px'}}>
                <EquipmentSlot 
                  label="" category="weapon"
                  items={subWeapons} selectedItem={subWeapon} onSelect={setSubWeapon}
                  refineValue={subRefine} onRefineChange={setSubRefine}
                  xtalList={[]} xtals={{x1:'-1', x2:'-1'}} setXtals={() => {}}
                  hasSlots={subType.id === "shield"} 
                />
              </div>
            </div>

            <div style={styles.section}>
              <span style={styles.label}>Armor</span>
              <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                {['light', 'normal', 'heavy'].map(type => (
                  <button key={type} style={{...styles.miniInput, background: armorType===type ? '#00ccff' : '#0f0f0f', color: armorType===type?'#000':'#fff', textTransform: 'capitalize'}} onClick={() => setArmorType(type as any)}>{type}</button>
                ))}
              </div>
              <EquipmentSlot 
                label="" category="armor"
                items={armors} selectedItem={armor} onSelect={setArmor}
                refineValue={armorRefine} onRefineChange={setArmorRefine}
                xtalList={combinedArmorXtals} xtals={armorXtals} setXtals={setArmorXtals}
              />
            </div>

            <div style={styles.section}>
              <span style={styles.label}>Additional Gear</span>
              <EquipmentSlot 
                label="" category="add"
                items={additionals} selectedItem={additional} onSelect={setAdditional}
                refineValue={addRefine} onRefineChange={setAddRefine}
                xtalList={combinedAddXtals} xtals={addXtals} setXtals={setAddXtals}
              />
            </div>

            <div style={styles.section}>
              <span style={styles.label}>Special Gear</span>
              <EquipmentSlot 
                label="" category="ring"
                items={specials} selectedItem={special} onSelect={setSpecial}
                refineValue={specialRefine}
                /* onRefineChange={setSpecialRefine}  <-- COMENTADO PARA OCULTAR REFINE */
                xtalList={combinedRingXtals} xtals={specialXtals} setXtals={setSpecialXtals}
              />
            </div>
          </div>
        </div>

        {/* COLUMNA 3 */}
        <div>
          {/* AVATARS */}
          <div style={styles.card}>
            <h3>Avatars</h3>
            {[{ title: "Accessory", start: 0 }, { title: "Top", start: 3 }, { title: "Bottom", start: 6 }].map(group => (
              <div key={group.title} style={{ marginBottom: '10px' }}>
                <b style={{ color: '#ccc', fontSize: '0.8em', display:'block', marginBottom:'4px' }}>{group.title}</b>
                {avatars.slice(group.start, group.start + 3).map((item, i) => (
                    <CustomStatRow key={group.start + i} item={item} idx={group.start + i} setter={setAvatars} options={AVATAR_STAT_LIST} />
                ))}
              </div>
            ))}
          </div>

         {/* CONSUMABLES */}
        <div style={styles.card}>
          <h3>Consumables</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {foods.map((slot, idx) => {
              const def = slot?.id ? consumablesList.find((c:any) => c.id === slot.id) : null;
              const safeStats = def ? def.stats : {};
              return (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
                  <select style={styles.select} value={slot?.id || ""} onChange={(e) => { const id = e.target.value; setFoods(prev => { const next = [...prev]; next[idx] = id ? { id } : null; return next; }); }}>
                    <option value="">-- none --</option>
                    {consumablesList.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div style={{ fontSize: "0.75em", color: "#00ff88", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {formatBuffStats(safeStats)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BUFFLAND */}
        <div style={styles.card}>
          <h3>Buffland</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {buffland.map((slot, idx) => {
              const foodInfo = bufflandList.find((b: any) => b.stat === slot.key);
              return (
                <div key={idx} style={styles.compactRow}>
                  <select style={{ ...styles.select, flex: 2 }} value={slot.key} onChange={(e) => { const newStat = e.target.value; setBuffland(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], key: newStat }; return copy; }); }}>
                    <option value="">-- Select Stat --</option>
                    {BUFFLAND_STAT_LIST.map((stat) => <option key={stat} value={stat}>{stat}</option>)}
                  </select>
                  <div style={{ flex: 2, fontSize: '0.8em', color: '#00ff88', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                    {foodInfo ? foodInfo.nombre : "---"}
                  </div>
                  <input type="number" style={{ ...styles.miniInput, flex: 1 }} value={slot.value} onChange={(e) => { setBuffland(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], value: Number(e.target.value) }; return copy; }); }} />
                </div>
              );
            })}
          </div>
        </div>

          {/* RESULTADOS */}
          <div style={{ position:'sticky', top:'20px' }}>
            <StatusDisplay stats={finalStats.final} />
          </div>

           {/* DEBUG PANEL FLOTANTE */}
          {/* TypeScript se quejará de que 'raw' no existe en finalStats si no actualizaste types.ts, 
              puedes usar (finalStats as any).raw para evitar el error rápido */}
          <DebugPanel rawStats={(finalStats as any).raw} />
        </div>
      </div>
    </div>
  );
}

function CustomStatRow({ item, idx, setter, options }: any) {
  return (
    <div style={styles.compactRow}>
      <select 
        style={{...styles.select, flex:2}}
        value={item.key}
        onChange={(e) => setter((prev:any[]) => {
           const copy = [...prev]; 
           copy[idx].key = e.target.value; 
           if (e.target.value === "") copy[idx].value = 0; 
           return copy;
        })}
      >
        <option value="">-- none --</option>
        {options.map((o:string) => <option key={o} value={o}>{o}</option>)}
      </select>
      
      <input 
        type="number" 
        value={item.value}
        onChange={(e) => setter((prev:any[]) => {
           const copy = [...prev]; copy[idx].value = Number(e.target.value); return copy;
        })}
        disabled={!item.key} 
        // Un solo bloque style con todo combinado
        style={{
            ...styles.miniInput, 
            flex:1, 
            opacity: !item.key ? 0.5 : 1,
            cursor: !item.key ? 'not-allowed' : 'text'
        }}
      />
    </div>
  )
}

const styles: any = {
  container: { background: '#050505', minHeight: '100vh', padding: '20px', color: '#e0e0e0', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  card: { width: '100%', background: '#121212', padding: '15px', borderRadius: '16px', boxSizing: 'border-box', border: '1px solid #222', marginBottom: '15px' },
  title: { textAlign: 'center', color: '#00ccff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '2em', marginBottom: '20px' },
  section: { marginBottom: '15px', padding: '10px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #222' },
  compactRow: { display: 'flex', gap: '8px', alignItems: 'center', width: '100%', marginBottom: '8px' },
  label: { fontSize: '0.8rem', color: '#00ccff', fontWeight: 'bold', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' },
  miniInput: { width: '100%', background: '#0f0f0f', border: '1px solid #444', color: '#00ff88', height: '34px', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', outline: 'none' },
  select: { width: '100%', padding: '0 8px', height: '34px', background: '#0f0f0f', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' },
  skillGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" },
  skillCard: { background: "#111", border: "1px solid #333", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px", justifyContent: 'space-between' },
  skillHeader: { display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8em" },
  skillName: { fontWeight: "600", lineHeight: "1.1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ddd" },
};