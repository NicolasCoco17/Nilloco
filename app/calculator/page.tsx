// app/calculator/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { WEAPON_TYPES, SUB_TYPES } from "@/lib/constants";
import { useToramData } from "@/hooks/useToramData";
import { calcCharacterStatus } from "@/lib/engine/index";
import { EquipmentSlot } from "@/components/calculator/EquipmentSlot";
import type { XtalSlotState } from "@/components/calculator/XtalSelect";
import { PASSIVE_SKILLS_DATA, AVATAR_STAT_LIST, BUFFLAND_STAT_LIST } from "@/lib/constants";
import { StatusDisplay } from "@/components/calculator/StatusDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useBuilds } from "@/hooks/useBuilds";
import { Save, FolderOpen, Trash2, X, FileText, Calendar } from "lucide-react";

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
  /* ======================
     1. HOOKS Y ESTADOS
  ====================== */
  const { isAuthenticated } = useAuth();
  const { saveBuildCloud, builds, fetchBuilds, deleteBuildCloud, loading: cloudLoading } = useBuilds();

  // Modales
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  // Estados Calculadora
  const [level, setLevel] = useState(1);
  const [baseStats, setBaseStats] = useState({ STR: 1, INT: 1, VIT: 1, AGI: 1, DEX: 1 });
  const [personalStatType, setPersonalStatType] = useState("NA");
  const [personalStatValue, setPersonalStatValue] = useState(0);

  const [mainType, setMainType] = useState(WEAPON_TYPES[0]);
  const [subType, setSubType] = useState(SUB_TYPES[0]);
  
  const [passiveSkills, setPassiveSkills] = useState<Record<string, number>>({});
  const [activeSkills, setActiveSkills] = useState<Record<string, number>>({});

  const [weapon, setWeapon] = useState<any>(null);
  const [weaponRefine, setWeaponRefine] = useState("0");
  const [weaponXtals, setWeaponXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });

  const [subWeapon, setSubWeapon] = useState<any>(null);
  const [subRefine, setSubRefine] = useState("0");

  const [armor, setArmor] = useState<any>(null);
  const [armorRefine, setArmorRefine] = useState("0");
  const [armorXtals, setArmorXtals] = useState<XtalSlotState>({ x1: "-1", x2: "-1" });
  const [armorType, setArmorType] = useState<"normal" | "light" | "heavy">("normal");

  const [additional, setAdditional] = useState<any>(null);
  const [addRefine, setAddRefine] = useState("0");
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

  const combinedWeaponXtals = useMemo(() => [...xtals.weapons, ...xtals.normal], [xtals]);
  const combinedArmorXtals = useMemo(() => [...xtals.armors, ...xtals.normal], [xtals]);
  const combinedAddXtals = useMemo(() => [...xtals.add, ...xtals.normal], [xtals]);
  const combinedRingXtals = useMemo(() => [...xtals.ring, ...xtals.normal], [xtals]);

  /* ======================
     LOGICA DE VISIBILIDAD
  ====================== */
  const showMainRefine = mainType.id !== "barehand" && mainType.id !== "none";
  const showSubRefine = ["shield", "1h", "kat", "knux", "md"].includes(subType.id);

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
        xtals: { x1: findXtal(weaponXtals.x1, combinedWeaponXtals), x2: findXtal(weaponXtals.x2, combinedWeaponXtals) }
      },
      { 
        ...subWeapon, refine: subRefine, type: "sub", stability: weapon?.stability ?? weapon?.base_stability,
      },
      { 
        ...armor, refine: armorRefine, type: "armor",
        xtals: { x1: findXtal(armorXtals.x1, combinedArmorXtals), x2: findXtal(armorXtals.x2, combinedArmorXtals) }
      },
      { 
        ...additional, refine: addRefine, type: "add",
        xtals: { x1: findXtal(addXtals.x1, combinedAddXtals), x2: findXtal(addXtals.x2, combinedAddXtals) }
      },
      { 
        ...special, refine: specialRefine, type: "special",
        xtals: { x1: findXtal(specialXtals.x1, combinedRingXtals), x2: findXtal(specialXtals.x2, combinedRingXtals) }
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
    registletsList, consumablesList, xtals, 
    combinedWeaponXtals, combinedArmorXtals, combinedAddXtals, combinedRingXtals
  ]);

  const statKeys = Object.keys(baseStats) as Array<keyof typeof baseStats>;

  /* ======================
     HANDLERS
  ====================== */
  const handleCloudSave = async () => {
    if (!buildName.trim()) return alert("Ponle un nombre a la build");
    
    const currentBuildData = {
      level, baseStats, personalStatType, personalStatValue,
      mainType, subType, passiveSkills, activeSkills,
      weapon, weaponRefine, weaponXtals,
      subWeapon, subRefine,
      armor, armorRefine, armorXtals, armorType,
      additional, addRefine, addXtals,
      special, specialRefine, specialXtals,
      avatars, buffland, foods, activeRegistlets
    };

    const success = await saveBuildCloud(buildName, currentBuildData);
    if (success) {
        setIsSaveModalOpen(false);
        setBuildName("");
    }
  };

  const handleCloudLoad = (buildData: any) => {
     if (buildData.level) setLevel(buildData.level);
     if (buildData.baseStats) setBaseStats(buildData.baseStats);
     if (buildData.personalStatType) setPersonalStatType(buildData.personalStatType);
     if (buildData.personalStatValue) setPersonalStatValue(buildData.personalStatValue);
     
     if (buildData.mainType) setMainType(buildData.mainType);
     if (buildData.subType) setSubType(buildData.subType);
     
     if (buildData.passiveSkills) setPassiveSkills(buildData.passiveSkills);
     else if (buildData.skills) setPassiveSkills(buildData.skills);
     
     if (buildData.activeSkills) setActiveSkills(buildData.activeSkills);

     setWeapon(buildData.weapon || null);
     if (buildData.weaponRefine) setWeaponRefine(buildData.weaponRefine);
     if (buildData.weaponXtals) setWeaponXtals(buildData.weaponXtals);

     setSubWeapon(buildData.subWeapon || null);
     if (buildData.subRefine) setSubRefine(buildData.subRefine);

     setArmor(buildData.armor || null);
     if (buildData.armorRefine) setArmorRefine(buildData.armorRefine);
     if (buildData.armorXtals) setArmorXtals(buildData.armorXtals);
     if (buildData.armorType) setArmorType(buildData.armorType);

     setAdditional(buildData.additional || null);
     if (buildData.addRefine) setAddRefine(buildData.addRefine);
     if (buildData.addXtals) setAddXtals(buildData.addXtals);

     setSpecial(buildData.special || null);
     if (buildData.specialRefine) setSpecialRefine(buildData.specialRefine);
     if (buildData.specialXtals) setSpecialXtals(buildData.specialXtals);
     
     if (buildData.avatars) setAvatars(buildData.avatars);
     if (buildData.buffland) setBuffland(buildData.buffland);
     if (buildData.foods) setFoods(buildData.foods);
     if (buildData.activeRegistlets) setActiveRegistlets(buildData.activeRegistlets);

     setIsLoadModalOpen(false);
  };
  
  useEffect(() => {
      if (isLoadModalOpen && isAuthenticated) {
          fetchBuilds();
      }
  }, [isLoadModalOpen, isAuthenticated, fetchBuilds]);

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="toram-calculator-container">
       <style jsx global>{`
        body { background-color: #050505; }
        .toram-calculator-container {
          background-color: #050505;
          min-height: 100vh;
          padding: 20px;
          color: #e0e0e0;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        
        input, select {
          appearance: none;
          -webkit-appearance: none;
          background-color: #0f0f0f !important;
          color: #fff !important;
        }
        select option { background-color: #0f0f0f; color: #fff; }
      `}</style>

      {/* --- HEADER SUPERIOR (TÍTULO + BOTONES) --- */}
      <div style={styles.headerContainer}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <h1 style={styles.title}>
            Calculadora de Stats para Toram Online
            </h1>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div style={{display:'flex', gap:'10px'}}>
            <button 
                onClick={() => isAuthenticated ? setIsSaveModalOpen(true) : alert("Inicia sesión para guardar en la nube.")} 
                style={styles.headerBtnSave}
                title="Guardar Build"
            >
                <Save size={18} /> <span className="hidden sm:inline">Guardar</span>
            </button>

            <button 
                onClick={() => isAuthenticated ? setIsLoadModalOpen(true) : alert("Inicia sesión para cargar.")}
                style={styles.headerBtnLoad}
                title="Cargar Build"
            >
                <FolderOpen size={18} /> <span className="hidden sm:inline">Mis Builds</span>
            </button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        
        {/* COLUMNA 1: Stats, Buffs, Registlets */}
        <div style={{...styles.column, flex: 1, display: 'flex', flexDirection: 'column'}}>
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

        {/* COLUMNA 2: Equipment */}
        <div style={styles.column}>
          <div style={{...styles.card, height: '100%'}}>
            <div style={styles.sectionHeader}>Equipment</div>
            
            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Main Weapon</span>
                  <select 
                    style={{...styles.select, width:'auto', padding:'0 10px'}} 
                    value={mainType.id} 
                    onChange={(e) => {
                      // RESET: Al cambiar de arma principal
                      setMainType(WEAPON_TYPES.find((t: any) => t.id === e.target.value) || WEAPON_TYPES[0]);
                      setWeapon(null); // Borra el item
                      setWeaponXtals({ x1: "-1", x2: "-1" }); // Borra Xtals
                      setWeaponRefine("0"); // Resetea Refine
                    }}
                  >
                    {WEAPON_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
              </div>
              <EquipmentSlot label="" category="weapon" items={weapons} selectedItem={weapon} onSelect={setWeapon} refineValue={weaponRefine} onRefineChange={setWeaponRefine} xtalList={combinedWeaponXtals} xtals={weaponXtals} setXtals={setWeaponXtals} showRefine={showMainRefine} />
            </div>

            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Sub Weapon</span>
                  <select 
                    style={{...styles.select, width:'auto', padding:'0 10px'}} 
                    value={subType.id} 
                    onChange={(e) => {
                      // RESET: Al cambiar de sub-arma
                      setSubType(SUB_TYPES.find((t: any) => t.id === e.target.value) || SUB_TYPES[0]);
                      setSubWeapon(null); // Borra el item
                      setSubRefine("0"); // Resetea Refine
                    }}
                  >
                    {SUB_TYPES.map((t: any) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
              </div>
              <EquipmentSlot label="" category="weapon" items={subWeapons} selectedItem={subWeapon} onSelect={setSubWeapon} refineValue={subRefine} onRefineChange={setSubRefine} xtalList={[]} xtals={{x1:'-1', x2:'-1'}} setXtals={() => {}} hasSlots={subType.id === "shield"} showRefine={showSubRefine}/>
            </div>

            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}>
                  <span>Body Armor</span>
                  <div style={styles.toggleGroup}>
                    {['light', 'normal', 'heavy'].map(type => (
                      <button key={type} style={{...styles.toggleBtn, background: armorType===type ? '#00ccff' : '#1a1a1a', color: armorType===type ? '#000' : '#888'}} onClick={() => setArmorType(type as any)}>{type.charAt(0).toUpperCase()}</button>
                    ))}
                  </div>
              </div>
              <EquipmentSlot label="" category="armor" items={armors} selectedItem={armor} onSelect={setArmor} refineValue={armorRefine} onRefineChange={setArmorRefine} xtalList={combinedArmorXtals} xtals={armorXtals} setXtals={setArmorXtals} />
            </div>

            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}><span>Additional Gear</span></div>
              <EquipmentSlot label="" category="add" items={additionals} selectedItem={additional} onSelect={setAdditional} refineValue={addRefine} onRefineChange={setAddRefine} xtalList={combinedAddXtals} xtals={addXtals} setXtals={setAddXtals} />
            </div>

            <div style={styles.equipBlock}>
              <div style={styles.equipLabelRow}><span>Special Gear</span></div>
              <EquipmentSlot label="" category="ring" items={specials} selectedItem={special} onSelect={setSpecial} refineValue={specialRefine} xtalList={combinedRingXtals} xtals={specialXtals} setXtals={setSpecialXtals} />
            </div>
          </div>
        </div>

        {/* COLUMNA 3: Avatars + Consumables */}
        <div style={styles.column}>
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
                          <div style={{ fontSize: "0.75em", color: "#00ff88", whiteSpace: 'normal', lineHeight: '1.2', paddingLeft: '5px' }}>
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
      
      {/* SKILLS CONTAINER */}
      <div style={{ ...styles.card, marginTop: '20px' }}>
        <div style={styles.sectionHeader}>Skills</div>
        <div style={styles.skillGrid}>
          {PASSIVE_SKILLS_DATA.map(skill => (
            <div key={skill.id} style={styles.skillCard}>
              <div style={styles.skillHeader}>
                <img 
                  src={skill.img} 
                  alt="" 
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                  onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
                <span style={styles.skillName} title={skill.name}>{skill.name}</span>
              </div>
              <select 
                className="form-control" 
                style={{ ...styles.select, marginTop: 'auto' }} 
                value={passiveSkills[skill.id] || 0} 
                onChange={(e) => setPassiveSkills(prev => ({ ...prev, [skill.id]: Number(e.target.value) }))}
              >
                {[...Array(11)].map((_, v) => <option key={v} value={v}>{v === 10 ? 'MAX' : v}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop: '20px'}}>
             <StatusDisplay stats={finalStats.final} />
      </div>

      {/* === MODAL GUARDAR === */}
      {isSaveModalOpen && (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                   <h3 style={{fontSize:'1.2em', fontWeight:'bold', color:'#fff'}}>Guardar Build</h3>
                   <button onClick={() => setIsSaveModalOpen(false)} style={{background:'none', border:'none', color:'#666', cursor:'pointer'}}><X size={20}/></button>
                </div>
                <input 
                    type="text" 
                    placeholder="Nombre de la build (ej: Katana DPS)" 
                    value={buildName}
                    onChange={e => setBuildName(e.target.value)}
                    style={{width:'100%', padding:'12px', background:'#222', color:'#fff', border:'1px solid #444', borderRadius:'6px', outline:'none'}}
                />
                <div style={{marginTop:'20px', display:'flex', gap:'10px', justifyContent:'end'}}>
                    <button onClick={handleCloudSave} style={modalStyles.confirmBtn} disabled={cloudLoading}>
                        {cloudLoading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* === MODAL CARGAR (Visualización tipo Lista) === */}
      {isLoadModalOpen && (
        <div style={modalStyles.overlay}>
            <div style={{...modalStyles.content, maxWidth:'500px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', borderBottom:'1px solid #333', paddingBottom:'10px'}}>
                   <h3 style={{fontSize:'1.2em', fontWeight:'bold', color:'#fff'}}>Mis Builds Guardadas</h3>
                   <button onClick={() => setIsLoadModalOpen(false)} style={{background:'none', border:'none', color:'#666', cursor:'pointer'}}><X size={20}/></button>
                </div>
                
                {cloudLoading && <p className="text-center text-gray-500 py-4">Cargando...</p>}
                
                <div style={{maxHeight:'400px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'8px', paddingRight:'5px'}}>
                    {!cloudLoading && builds.length === 0 && (
                        <div style={{textAlign:'center', padding:'30px', color:'#555', border:'1px dashed #333', borderRadius:'8px'}}>
                            <FileText size={40} style={{opacity:0.3, marginBottom:'10px'}} />
                            <p>No tienes builds guardadas.</p>
                        </div>
                    )}
                    
                    {builds.map(b => (
                        <div key={b.id} className="group" style={{background:'#1a1a1a', padding:'12px', borderRadius:'8px', border:'1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.2s'}}>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <span style={{fontWeight:'bold', color:'#e0e0e0', fontSize:'1em'}}>{b.name}</span>
                                <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.75em', color:'#666', marginTop:'2px'}}>
                                   <Calendar size={12}/>
                                   <span>{new Date(b.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style={{display:'flex', gap:'8px'}}>
                                <button 
                                    onClick={() => handleCloudLoad(b.data)} 
                                    style={{background:'#2563eb', border:'none', color:'#fff', padding:'6px 12px', borderRadius:'4px', cursor:'pointer', fontSize:'0.85em', fontWeight:'bold'}}
                                    title="Cargar"
                                >
                                    Cargar
                                </button>
                                <button 
                                    onClick={() => deleteBuildCloud(b.id)} 
                                    style={{background:'#dc2626', border:'none', color:'#fff', padding:'6px', borderRadius:'4px', cursor:'pointer', display:'flex', alignItems:'center'}}
                                    title="Borrar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente simple para filas de stats
function CustomStatRow({ item, idx, setter, options }: any) {
  return (
    <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
      <select 
        style={{...styles.select, flex:2, fontSize:'0.8em'}}
        value={item.key}
        onChange={(e) => setter((prev:any[]) => { const copy = [...prev]; copy[idx].key = e.target.value; if (e.target.value === "") copy[idx].value = 0; return copy; })}
      >
        <option value="">-</option>
        {options.map((o:string) => <option key={o} value={o}>{o}</option>)}
      </select>
      <input type="number" value={item.value} onChange={(e) => setter((prev:any[]) => { const copy = [...prev]; copy[idx].value = Number(e.target.value); return copy; })} disabled={!item.key} style={{...styles.input, width:'50px', opacity: !item.key ? 0.3 : 1, borderColor: !item.key ? '#333' : '#444'}} />
    </div>
  )
}

/* ======================
      ESTILOS
   ====================== */
const styles: any = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
    borderBottom: '1px solid #222',
    paddingBottom: '15px',
    textAlign: 'center'
  },
  title: { margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '1px', color: '#fff' },
  versionBadge: { fontSize: '0.4em', background: '#333', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle', marginLeft: '10px', color: '#aaa' },

  headerBtnSave: { display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9em' },
  headerBtnLoad: { display: 'flex', alignItems: 'center', gap: '6px', background: '#3b82f6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9em' },

  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch' },
  column: { display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' },
  card: { background: '#121212', borderRadius: '12px', padding: '20px', border: '1px solid #222', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' },
  sectionHeader: { marginBottom: '15px', color: '#00ccff', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: '8px' },

  input: { background: '#0f0f0f', border: '1px solid #333', color: '#00ff88', height: '36px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', outline: 'none', transition: 'border-color 0.2s', width: '100%' },
  
  select: { height: '36px', background: '#0f0f0f', color: '#ffffff', border: '1px solid #333', borderRadius: '6px', padding: '0 8px', outline: 'none', cursor: 'pointer', width: '100%' },

  skillGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px", width: "100%" },
  skillCard: { background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", minHeight: "80px" },
  skillHeader: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8em", overflow: "hidden", marginBottom: '4px' },
  skillName: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ccc", fontWeight: 'bold' },

  equipBlock: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #1a1a1a' },
  equipLabelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem', color: '#aaa' },
  toggleGroup: { display: 'flex', background: '#1a1a1a', borderRadius: '6px', padding: '2px' },
  toggleBtn: { border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' },
};

const modalStyles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    background: '#0a0a0a',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #333',
    width: '90%',
    maxWidth: '400px',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  confirmBtn: {
    background: '#10b981',
    border: 'none',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};