// app/calculator/page.tsx
"use client";

import { useState, useMemo } from "react";
import { WEAPON_TYPES, SUB_TYPES } from "@/lib/constants";
import { useToramData } from "@/hooks/useToramData";
import { calcCharacterStatus } from "@/lib/engine/index";
import { EquipmentSlot } from "@/components/calculator/EquipmentSlot";
import type { XtalSlotState } from "@/components/calculator/XtalSelect";
import { PASSIVE_SKILLS_DATA, AVATAR_STAT_LIST, BUFFLAND_STAT_LIST } from "@/lib/constants";
import { StatusDisplay } from "@/components/calculator/StatusDisplay";

/* ======================
   CONSTANTES TEMPORALES
====================== */
const ACTIVE_SKILLS_DATA = [
  { id: "God Speed", name: "Godspeed Wield", img: "/icons/skill_gsw.png" },
  { id: "War Cry", name: "War Cry", img: "/icons/skill_warcry.png" },
  { id: "Kairiki Ranshin", name: "Kairiki Ranshin", img: "/icons/skill_kairiki.png" },
  { id: "Brave Aura", name: "Brave Aura", img: "/icons/skill_brave.png" },
  { id: "Quick Aura", name: "Quick Aura", img: "/icons/skill_quick.png" },
  { id: "Decoy Shot", name: "Decoy Shot", img: "/icons/skill_decoy.png" },
];

/* ======================
   HELPERS
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
  /* --- ESTADOS --- */
  const [level, setLevel] = useState(1);
  const [baseStats, setBaseStats] = useState({ STR: 1, INT: 1, VIT: 1, AGI: 1, DEX: 1 });
  const [personalStatType, setPersonalStatType] = useState("NA");
  const [personalStatValue, setPersonalStatValue] = useState(0);

  const [mainType, setMainType] = useState(WEAPON_TYPES[0]);
  const [subType, setSubType] = useState(SUB_TYPES[0]);
  
  const [passiveSkills, setPassiveSkills] = useState<Record<string, number>>({});
  const [activeSkills, setActiveSkills] = useState<Record<string, number>>({});

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
  const [specialRefine, setSpecialRefine] = useState("0");
  const [specialXtals, setSpecialXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });

  const [avatars, setAvatars] = useState(Array.from({ length: 9 }, () => ({ key: "", value: 0 })));
  const [buffland, setBuffland] = useState(Array.from({ length: 5 }, () => ({ key: "", value: 0 })));
  const [foods, setFoods] = useState(Array(10).fill(null));
  const [activeRegistlets, setActiveRegistlets] = useState<{ id: string; level: number }[]>(Array.from({ length: 10 }, () => ({ id: "", level: 1 })));

  /* --- DATA HOOK --- */
  const { 
      weapons, subWeapons, armors, additionals, specials, xtals,
      registletsList, bufflandList, consumablesList 
  } = useToramData(mainType.id, subType.id);  

  const weaponXtalList = useMemo(() => [...xtals.weapons, ...xtals.normal], [xtals]);
  const armorXtalList = useMemo(() => [...xtals.armors, ...xtals.normal], [xtals]);
  const addXtalList = useMemo(() => [...xtals.add, ...xtals.normal], [xtals]);
  const ringXtalList = useMemo(() => [...xtals.ring, ...xtals.normal], [xtals]);

  /* --- CÁLCULO --- */
  const finalStats = useMemo(() => {
    const findXtal = (id: string, list: any[]) => {
      if (!id || id === "-1") return null;
      return list.find(x => String(x.id) === String(id)) || null;
    };

    const avatarStats = avatars.filter(a => a.key && a.value !== 0);
    const bufflandStats = buffland.filter(b => b.key && b.value !== 0);
    
    const activeFoodsData = foods.filter(f => f && f.id).map(f => consumablesList.find((c: any) => c.id === f.id)).filter(Boolean);
    const consumableStats = [{ 
      name: "Active Foods", 
      stats: activeFoodsData.reduce((acc: any, curr: any) => {
        if(!curr.stats) return acc;
        Object.entries(curr.stats).forEach(([k, v]) => acc[k] = (acc[k] || 0) + Number(v));
        return acc;
      }, {} as Record<string, number>)
    }];

    const registletsInput = activeRegistlets
      .map(ar => {
         const def = registletsList.find((r:any) => r.id === ar.id);
         return def ? { ...def, level: ar.level } : null;
      }).filter(Boolean);

    let personalInput = undefined;
    if (personalStatType !== "NA") {
        personalInput = { type: personalStatType as any, value: personalStatValue };
    }

    const combinedSkills = { ...passiveSkills, ...activeSkills };

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
      skills: combinedSkills,
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
    passiveSkills, activeSkills, avatars, foods, buffland, activeRegistlets, 
    registletsList, consumablesList, xtals
  ]);

  const combinedWeaponXtals = useMemo(() => [...xtals.weapons, ...xtals.normal], [xtals]);
  const combinedArmorXtals = useMemo(() => [...xtals.armors, ...xtals.normal], [xtals]);
  const combinedAddXtals = useMemo(() => [...xtals.add, ...xtals.normal], [xtals]);
  const combinedRingXtals = useMemo(() => [...xtals.ring, ...xtals.normal], [xtals]);
  const statKeys = Object.keys(baseStats) as Array<keyof typeof baseStats>;

  /* --- LOCAL STORAGE --- */
  const saveBuildLocal = () => {
    const buildData = {
      level, baseStats, personalStatType, personalStatValue,
      mainType, subType, passiveSkills, activeSkills,
      weapon, weaponRefine, weaponXtals,
      subWeapon, subRefine,
      armor, armorRefine, armorXtals, armorType,
      additional, addRefine, addXtals,
      special, specialRefine, specialXtals,
      avatars, buffland, foods, activeRegistlets
    };
    try {
      localStorage.setItem("toram_build_test", JSON.stringify(buildData));
      alert("✅ Build guardada localmente.");
    } catch (e) {
      alert("❌ Error al guardar.");
    }
  };

  const loadBuildLocal = () => {
    const saved = localStorage.getItem("toram_build_test");
    if (!saved) {
      alert("⚠️ No hay build guardada.");
      return;
    }
    try {
      const data = JSON.parse(saved);
      if (data.level) setLevel(data.level);
      if (data.baseStats) setBaseStats(data.baseStats);
      if (data.personalStatType) setPersonalStatType(data.personalStatType);
      if (data.personalStatValue !== undefined) setPersonalStatValue(data.personalStatValue);
      if (data.mainType) setMainType(data.mainType);
      if (data.subType) setSubType(data.subType);
      
      if (data.passiveSkills) setPassiveSkills(data.passiveSkills);
      else if (data.skills) setPassiveSkills(data.skills);
      if (data.activeSkills) setActiveSkills(data.activeSkills);

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

      if (data.avatars) setAvatars(data.avatars);
      if (data.buffland) setBuffland(data.buffland);
      if (data.foods) setFoods(data.foods);
      if (data.activeRegistlets) setActiveRegistlets(data.activeRegistlets);
      alert("✅ Build cargada.");
    } catch (e) {
      alert("❌ Error al leer los datos.");
    }
  };

  const clearBuildLocal = () => {
      if(confirm("¿Estás seguro de borrar los datos guardados?")) {
          localStorage.removeItem("toram_build_test");
          alert("🗑️ Datos borrados.");
      }
  }

  return (
    <div className="toram-calculator-container">
      <style jsx global>{`
        body { background-color: #050505; }
        .toram-calculator-container {
          background-color: #050505;
          min-height: 100vh;
          padding: 20px;
          padding-bottom: 80px; 
          color: #e0e0e0;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        
        /* INPUT FIX */
        input, select {
          appearance: none;
          -webkit-appearance: none;
          background-color: #0f0f0f !important;
          color: #fff !important;
        }
        select option { background-color: #0f0f0f; color: #fff; }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>
          Toram Calculator 
          <span style={styles.versionBadge}>v3.4</span>
        </h1>
      </div>

      <div style={styles.mainGrid}>
        
        {/* === COLUMNA 1: STATS - BUFFLAND - REGISTLETS === */}
        <div style={{...styles.column, flex: 1, display: 'flex', flexDirection: 'column'}}>
          
          {/* BASE STATS */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Character Stats</div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent:'space-between', marginBottom: '15px'}}>
               <span style={{fontSize:'0.9em', color:'#aaa'}}>Level</span>
               <input type="number" className="dark-input" style={{...styles.input, width:'80px', fontSize:'1.2em', color:'#00ccff'}} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'5px', marginBottom:'15px'}}>
               {statKeys.map((key) => (
                  <div key={key} style={{textAlign:'center'}}>
                    <label style={{display:'block', fontSize:'0.7em', color:'#888', marginBottom:'2px'}}>{key}</label>
                    <input type="number" style={styles.input} value={baseStats[key]} onChange={(e) => setBaseStats(prev => ({...prev, [key]: Number(e.target.value)}))} />
                  </div>
               ))}
            </div>

            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <select style={{...styles.select, width:'80px'}} value={personalStatType} onChange={(e) => setPersonalStatType(e.target.value)}>
                  {PERSONAL_STATS.map(s => <option key={s} value={s}>{s === "NA" ? "Pers." : s}</option>)}
                </select>
                <input type="number" style={{...styles.input, flex:1, opacity: personalStatType==="NA"?0.3:1}} value={personalStatValue} onChange={(e) => setPersonalStatValue(Number(e.target.value))} disabled={personalStatType === "NA"} />
            </div>
          </div>
          
          {/* BUFFLAND */}
          <div style={styles.card}>
             <div style={styles.sectionHeader}>Buffland</div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {buffland.map((slot, idx) => {
                  const foodInfo = bufflandList.find((b: any) => b.stat === slot.key);
                  return (
                    <div key={idx} style={{display:'flex', gap:'5px', alignItems:'center'}}>
                      <select style={{ ...styles.select, flex: 1.5, fontSize:'0.8em' }} value={slot.key} onChange={(e) => { const newStat = e.target.value; setBuffland(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], key: newStat }; return copy; }); }}>
                        <option value="">(None)</option>
                        {BUFFLAND_STAT_LIST.map((stat) => <option key={stat} value={stat}>{stat}</option>)}
                      </select>
                      <div style={{ flex: 1, fontSize: '0.7em', color: '#888', textAlign: 'center' }}>
                        {foodInfo ? foodInfo.nombre : "-"}
                      </div>
                      <input type="number" style={{ ...styles.input, width:'40px' }} value={slot.value} onChange={(e) => { setBuffland(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], value: Number(e.target.value) }; return copy; }); }} />
                    </div>
                  );
                })}
             </div>
          </div>

          {/* REGISTLETS (Espaciador para empujar abajo) */}
          <div style={{...styles.card, flex: 1, display: 'flex', flexDirection: 'column'}}>
             <div style={styles.sectionHeader}>Registlets</div>
             <div style={{flex: 1, overflowY:'auto'}}>
              {activeRegistlets.map((reg, idx) => (
                <div key={idx} style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
                    <select style={{...styles.select, flex: 1, fontSize:'0.8em'}} value={reg.id} onChange={(e) => { const newRegs = [...activeRegistlets]; newRegs[idx].id = e.target.value; setActiveRegistlets(newRegs); }}>
                      <option value="">(Empty Slot)</option>
                      {registletsList.map((r:any) => <option key={r.id} value={r.id}>{r.name} ({r.stat})</option>)}
                    </select>
                    <input type="number" min="1" max="100" style={{...styles.input, width:'50px'}} value={reg.level} onChange={(e) => { const newRegs = [...activeRegistlets]; newRegs[idx].level = Number(e.target.value); setActiveRegistlets(newRegs); }} />
                </div>
              ))}
             </div>
          </div>
        </div>

        {/* === COLUMNA 2: EQUIPO (CENTRAL) === */}
        <div style={styles.column}>
          <div style={{...styles.card, height: '100%'}}>
            <div style={styles.sectionHeader}>Equipment</div>
            
            {/* MAIN WEAPON */}
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Main Weapon</span>
                  <select style={{...styles.select, width:'auto', padding:'0 10px'}} value={mainType.id} onChange={(e) => setMainType(WEAPON_TYPES.find((t: any) => t.id === e.target.value) || WEAPON_TYPES[0])}>
                    {WEAPON_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
              </div>
              <EquipmentSlot 
                    label="" category="weapon"
                    items={weapons} selectedItem={weapon} onSelect={setWeapon}
                    refineValue={weaponRefine} onRefineChange={setWeaponRefine}
                    xtalList={combinedWeaponXtals} xtals={weaponXtals} setXtals={setWeaponXtals}
                 />
            </div>

            {/* SUB WEAPON */}
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Sub Weapon</span>
                  <select style={{...styles.select, width:'auto', padding:'0 10px'}} value={subType.id} onChange={(e) => setSubType(SUB_TYPES.find((t: any) => t.id === e.target.value) || SUB_TYPES[0])}>
                    {SUB_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
              </div>
              <EquipmentSlot 
                  label="" category="weapon"
                  items={subWeapons} selectedItem={subWeapon} onSelect={setSubWeapon}
                  refineValue={subRefine} onRefineChange={setSubRefine}
                  xtalList={[]} xtals={{x1:'-1', x2:'-1'}} setXtals={() => {}}
                  hasSlots={subType.id === "shield"} 
                />
            </div>

            {/* ARMOR */}
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Body Armor</span>
                  <div style={styles.toggleGroup}>
                    {['light', 'normal', 'heavy'].map(type => (
                      <button 
                        key={type} 
                        style={{
                            ...styles.toggleBtn, 
                            background: armorType===type ? '#00ccff' : '#1a1a1a', 
                            color: armorType===type ? '#000' : '#888'
                        }} 
                        onClick={() => setArmorType(type as any)}
                      >
                        {type.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
              </div>
              <EquipmentSlot 
                label="" category="armor"
                items={armors} selectedItem={armor} onSelect={setArmor}
                refineValue={armorRefine} onRefineChange={setArmorRefine}
                xtalList={combinedArmorXtals} xtals={armorXtals} setXtals={setArmorXtals}
              />
            </div>

            {/* ADDITIONAL */}
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}><span>Additional Gear</span></div>
              <EquipmentSlot 
                label="" category="add"
                items={additionals} selectedItem={additional} onSelect={setAdditional}
                refineValue={addRefine} onRefineChange={setAddRefine}
                xtalList={combinedAddXtals} xtals={addXtals} setXtals={setAddXtals}
              />
            </div>

            {/* SPECIAL */}
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}><span>Special Gear</span></div>
              <EquipmentSlot 
                label="" category="ring"
                items={specials} selectedItem={special} onSelect={setSpecial}
                refineValue={specialRefine}
                xtalList={combinedRingXtals} xtals={specialXtals} setXtals={setSpecialXtals}
              />
            </div>
          </div>
        </div>

        {/* === COLUMNA 3: AVATARS + CONSUMABLES === */}
        <div style={styles.column}>
          
          {/* AVATARS */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>Avatars</div>
            {[{ title: "Accessory", start: 0 }, { title: "Top", start: 3 }, { title: "Bottom", start: 6 }].map(group => (
              <div key={group.title} style={{ marginBottom: '12px' }}>
                <div style={{fontSize:'0.75em', color:'#666', textTransform:'uppercase', marginBottom:'4px'}}>{group.title}</div>
                {avatars.slice(group.start, group.start + 3).map((item, i) => (
                    <CustomStatRow key={group.start + i} item={item} idx={group.start + i} setter={setAvatars} options={AVATAR_STAT_LIST} />
                ))}
              </div>
            ))}
          </div>

          {/* CONSUMABLES (height flex to fill) */}
          <div style={{...styles.card, flex: 1, display:'flex', flexDirection:'column'}}>
             <div style={styles.sectionHeader}>Consumables</div>
             <div style={{ flex: 1, display: "flex", flexDirection:'column', gap: '8px' }}>
                {foods.map((slot, idx) => {
                  const def = slot?.id ? consumablesList.find((c:any) => c.id === slot.id) : null;
                  const safeStats = def ? def.stats : {};
                  return (
                    <div key={idx} style={{ display: "flex", flexDirection:'column', gap: '4px', borderBottom:'1px solid #222', paddingBottom:'6px' }}>
                      <select style={{...styles.select, width:'100%', fontSize:'0.85em'}} value={slot?.id || ""} onChange={(e) => { const id = e.target.value; setFoods(prev => { const next = [...prev]; next[idx] = id ? { id } : null; return next; }); }}>
                        <option value="">-- Food Slot {idx+1} --</option>
                        {consumablesList.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {def && (
                          <div style={{ 
                              fontSize: "0.75em", 
                              color: "#00ff88", 
                              whiteSpace: 'normal',   
                              lineHeight: '1.2',      
                              paddingLeft: '5px'
                          }}>
                            {formatBuffStats(safeStats)}
                          </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
      
      {/* 
         === SKILLS CONTAINER === 
         Vuelve a usar Grid Layout (bloques cuadrados)
      */}
      <div style={{...styles.card, marginTop: '20px'}}>
        <div style={styles.sectionHeader}>Skills</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* PANEL IZQUIERDO: PASIVAS */}
            <div>
                <h4 style={{textAlign:'center', color:'#888', margin:'0 0 10px 0', fontSize:'0.9em', textTransform:'uppercase'}}>Passive Skills</h4>
                <div style={styles.skillGrid}>
                    {PASSIVE_SKILLS_DATA.map(skill => (
                      <div key={skill.id} style={styles.skillCard}>
                        <div style={styles.skillHeader}>
                          <img src={skill.img} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                          <span style={styles.skillName} title={skill.name}>{skill.name}</span>
                        </div>
                        <select className="form-control" style={{...styles.select, marginTop:'auto'}} value={passiveSkills[skill.id] || 0} onChange={(e) => setPassiveSkills(prev => ({ ...prev, [skill.id]: Number(e.target.value) }))}>
                          {[...Array(11)].map((_, v) => <option key={v} value={v}>{v === 10 ? 'MAX' : v}</option>)}
                        </select>
                      </div>
                    ))}
                </div>
            </div>

            {/* PANEL DERECHO: ACTIVAS */}
            <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px' }}>
                <h4 style={{textAlign:'center', color:'#888', margin:'0 0 10px 0', fontSize:'0.9em', textTransform:'uppercase'}}>Active Skills</h4>
                <div style={styles.skillGrid}>
                    {ACTIVE_SKILLS_DATA.map(skill => (
                      <div key={skill.id} style={styles.skillCard}>
                        <div style={styles.skillHeader}>
                          <img src={skill.img} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                          <span style={styles.skillName} title={skill.name}>{skill.name}</span>
                        </div>
                        <select className="form-control" style={{...styles.select, marginTop:'auto'}} value={activeSkills[skill.id] || 0} onChange={(e) => setActiveSkills(prev => ({ ...prev, [skill.id]: Number(e.target.value) }))}>
                          {[...Array(11)].map((_, v) => <option key={v} value={v}>{v === 10 ? 'MAX' : v}</option>)}
                        </select>
                      </div>
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* STATUS DISPLAY */}
      <div style={{marginTop: '20px'}}>
             <StatusDisplay stats={finalStats.final} />
      </div>

      {/* === ACTION BAR === */}
      <div style={styles.actionBar}>
        <div style={{display:'flex', gap:'15px', justifyContent:'center', maxWidth:'600px', margin:'0 auto'}}>
          <button onClick={saveBuildLocal} style={{...styles.actionBtn, background: 'linear-gradient(45deg, #11998e, #38ef7d)'}}>
            💾 Save Local
          </button>
          <button onClick={loadBuildLocal} style={{...styles.actionBtn, background: 'linear-gradient(45deg, #2980b9, #6dd5fa)'}}>
             📂 Load
          </button>
          <button onClick={clearBuildLocal} style={{...styles.actionBtn, background: 'linear-gradient(45deg, #cb2d3e, #ef473a)'}}>
             🗑️ Clear
          </button>
        </div>
      </div>

    </div>
  );
}

function CustomStatRow({ item, idx, setter, options }: any) {
  return (
    <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
      <select 
        style={{...styles.select, flex:2, fontSize:'0.8em'}}
        value={item.key}
        onChange={(e) => setter((prev:any[]) => {
           const copy = [...prev]; 
           copy[idx].key = e.target.value; 
           if (e.target.value === "") copy[idx].value = 0; 
           return copy;
        })}
      >
        <option value="">-</option>
        {options.map((o:string) => <option key={o} value={o}>{o}</option>)}
      </select>
      
      <input 
        type="number" 
        value={item.value}
        onChange={(e) => setter((prev:any[]) => {
           const copy = [...prev]; copy[idx].value = Number(e.target.value); return copy;
        })}
        disabled={!item.key} 
        style={{
            ...styles.input, 
            width:'50px', 
            opacity: !item.key ? 0.3 : 1,
            borderColor: !item.key ? '#333' : '#444'
        }}
      />
    </div>
  )
}

/* ======================
   ESTILOS
====================== */
const styles: any = {
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { margin: 0, fontSize: '2rem', fontWeight: '800', letterSpacing: '2px', color: '#fff' },
  versionBadge: { fontSize: '0.4em', background: '#333', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px', color:'#aaa' },
  
  mainGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '20px',
    alignItems: 'stretch' 
  },
  column: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      height: '100%' 
  },
  
  card: { 
    background: '#121212', 
    borderRadius: '12px', 
    padding: '20px', 
    border: '1px solid #222', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    display: 'flex', 
    flexDirection: 'column'
  },
  sectionHeader: { className: 'section-header', marginBottom: '15px', color: '#00ccff', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderBottom:'1px solid #222', paddingBottom:'8px' },
  
  input: { 
    background: '#0f0f0f', 
    border: '1px solid #333', 
    color: '#00ff88', 
    height: '36px', 
    borderRadius: '6px', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
  },
  select: { 
    height: '36px', 
    background: '#0f0f0f', 
    color: '#e0e0e0', 
    border: '1px solid #333', 
    borderRadius: '6px', 
    padding: '0 8px', 
    outline: 'none', 
    cursor: 'pointer',
    width: '100%'
  },
  
  // Aquí volvemos al Grid Layout original para las skills
  skillGrid: { 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", 
      gap: "10px" 
  },
  skillCard: { 
      background: "#1a1a1a", 
      border: "1px solid #2a2a2a", 
      borderRadius: "6px", 
      padding: "10px", 
      display: "flex", 
      flexDirection: "column", 
      gap: "6px",
      minHeight: "80px"
  },
  skillHeader: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8em", overflow: "hidden", marginBottom:'4px' },
  skillName: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ccc", fontWeight:'bold' },

  equipBlock: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #1a1a1a' },
  equipLabelRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px', fontSize:'0.85rem', color:'#aaa' },
  
  toggleGroup: { display:'flex', background:'#1a1a1a', borderRadius:'6px', padding:'2px' },
  toggleBtn: { border:'none', padding:'4px 8px', borderRadius:'4px', fontSize:'0.75rem', fontWeight:'bold', cursor:'pointer' },

  actionBar: { 
    position: 'fixed', 
    bottom: 0, 
    left: 0, 
    width: '100%', 
    background: 'rgba(18, 18, 18, 0.95)', 
    backdropFilter: 'blur(10px)', 
    borderTop: '1px solid #333', 
    padding: '15px', 
    zIndex: 100 
  },
  actionBtn: { 
    border: 'none', 
    color: 'white', 
    padding: '10px 20px', 
    borderRadius: '30px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    fontSize: '0.9rem',
    minWidth: '100px'
  }
};