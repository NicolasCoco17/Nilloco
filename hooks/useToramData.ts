import { useState, useEffect } from "react";

export function useToramData(mainTypeId: string, subTypeId: string) {
  // Equipo
  const [weapons, setWeapons] = useState<any[]>([]);
  const [subWeapons, setSubWeapons] = useState<any[]>([]);
  const [armors, setArmors] = useState<any[]>([]);
  const [additionals, setAdditionals] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);

  // Xtals y Otros
  const [xtals, setXtals] = useState({ weapons: [], armors: [], add: [], ring: [], normal: [] });
  const [registletsList, setRegistletsList] = useState<any[]>([]);
  const [bufflandList, setBufflandList] = useState<any[]>([]);
  const [consumablesList, setConsumablesList] = useState<any[]>([]);

  // 1. Cargar Armas
  useEffect(() => {
    if (!mainTypeId) return;
    const fileMap: Record<string, string> = {
      "1h": "espadas_1h_clean.json",
      "2h": "espadas_2h_clean.json",
      "bow": "bows_clean.json",
      "bwg": "bwg_clean.json",
      "staff": "staff_clean.json",
      "md": "md_clean.json",
      "knux": "knuckles_clean.json",
      "kat": "katana_clean.json",
      "hb": "hb_clean.json",
    };
    const file = fileMap[mainTypeId];
    if (file) fetch(`/data/weapons/${file}`).then(r => r.json()).then(setWeapons).catch(() => setWeapons([]));
  }, [mainTypeId]);

  // 2. Cargar Sub-Armas
  useEffect(() => {
    if (subTypeId === "none") { setSubWeapons([]); return; }
    const subMap: Record<string, string> = {
      "shield": "escudos_clean.json",
      "arrow": "flecha_clean.json",
      "dagger": "daga_clean.json",
      "md": "md_clean.json",
      "knux": "knuckles_clean.json",
      "kat": "katana_clean.json",
      "scroll": "scroll_clean.json"
    };
    const file = subMap[subTypeId];
    if (file) fetch(`/data/weapons/${file}`).then(r => r.json()).then(setSubWeapons).catch(() => setSubWeapons([]));
  }, [subTypeId]);

  // 3. Cargar Resto (Armor, Add, Ring, Xtals, Buffs)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          armorsData, addsData, ringsData,
          wXtal, aXtal, addXtal, rXtal, nXtal,
          regData, buffData, consData
        ] = await Promise.all([
          fetch("/data/armors/armors_clean.json").then(r => r.json()),
          fetch("/data/add/add_clean.json").then(r => r.json()),
          fetch("/data/anillo/anillos_clean.json").then(r => r.json()),
          
          fetch("/data/xtals/xtal_arma.json").then(r => r.json()),
          fetch("/data/xtals/xtal_armor.json").then(r => r.json()),
          fetch("/data/xtals/xtal_add.json").then(r => r.json()),
          fetch("/data/xtals/xtal_anillo.json").then(r => r.json()),
          fetch("/data/xtals/xtal_normal.json").then(r => r.json()),

          // Asegúrate de crear estos archivos con los JSONs que pegaste
          fetch("/data/registlets.json").then(r => r.json()).catch(()=>[]),
          fetch("/data/buff/buffland.json").then(r => r.json()).catch(()=>[]), 
          fetch("/data/buff/consumables.json").then(r => r.json()).catch(()=>[])
        ]);

        setArmors(armorsData);
        setAdditionals(addsData);
        setSpecials(ringsData);
        setXtals({ weapons: wXtal, armors: aXtal, add: addXtal, ring: rXtal, normal: nXtal });
        
        // Manejo de arrays planos o envueltos en objetos { "registlets": [...] }
        setRegistletsList(Array.isArray(regData) ? regData : (regData.registlets || []));
        setBufflandList(Array.isArray(buffData) ? buffData : (buffData.buffland || []));
        setConsumablesList(Array.isArray(consData) ? consData : (consData.consumables || []));

      } catch (e) {
        console.error("Error loading data", e);
      }
    };
    fetchData();
  }, []);

  return { 
    weapons, subWeapons, armors, additionals, specials, xtals,
    registletsList, bufflandList, consumablesList
  };
}