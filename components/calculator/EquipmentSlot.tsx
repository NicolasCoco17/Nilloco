"use client";

import { FULL_STAT_LIST } from "@/lib/constants"; 
import { useState, useEffect } from "react";
import { XtalSelect, XtalSlotState, Category } from "./XtalSelect";
import type { Xtal } from "@/types/xtal";

const CRAFT_OPTIONS = FULL_STAT_LIST;

type CustomStat = { key: string; value: number };

type Props = {
  label: string;
  category: Category;
  items: any[];
  selectedItem: any;
  onSelect: (item: any) => void;
  refineValue: string;
  onRefineChange?: (val: string) => void;
  showRefine?: boolean;
  xtalList: Xtal[];
  xtals: XtalSlotState;
  setXtals: React.Dispatch<React.SetStateAction<XtalSlotState>>;
  xtalIcon?: string; 
  hasSlots?: boolean;
};

const REFINE_LEVELS = ["0","1","2","3","4","5","6","7","8","9","E","D","C","B","A","S"];

export function EquipmentSlot({ 
  label, category, items, selectedItem, onSelect, 
  refineValue, onRefineChange, 
  showRefine = true,
  xtalList, xtals, setXtals, xtalIcon, hasSlots = true 
}: Props) {
  
  const [variantType, setVariantType] = useState<string>("drop");
  
  const [customStats, setCustomStats] = useState<CustomStat[]>(
    Array(8).fill({ key: "Select", value: 0 })
  );

  const [baseValue, setBaseValue] = useState<number>(0);

  // Efecto 1: Resetear variante y actualizar baseValue inicial
  useEffect(() => {
    if (selectedItem) {
       if (selectedItem.variants && !selectedItem.variants[variantType]) {
          // Si la variante actual no existe en el item nuevo, resetear a la primera disponible o 'player' si es scroll único
          const firstVariant = Object.keys(selectedItem.variants)[0];
          setVariantType(firstVariant || "drop");
       }

       let initialVal = 0;
       if (selectedItem.variants && selectedItem.variants[variantType]) {
          const v = selectedItem.variants[variantType];
          initialVal = category === 'weapon' ? v.base_atk : v.base_def;
       } else {
          initialVal = category === 'weapon' ? selectedItem.base_atk : selectedItem.base_def;
       }
       
       setBaseValue(Number(selectedItem.modifiedBaseValue ?? initialVal ?? 0));
    }
  }, [selectedItem?.id, variantType]); 

  // === EFECTO 2 CORREGIDO: Manejo de allow_custom_stats ===
  useEffect(() => {
    if (!selectedItem) return;

    let processedItem = { ...selectedItem };
    let currentVariantData = null;

    // 1. Obtener datos de la variante actual
    if (selectedItem.variants) {
       currentVariantData = selectedItem.variants[variantType];
       if (currentVariantData) {
          processedItem = {
            ...processedItem,
            base_atk: currentVariantData.base_atk ?? selectedItem.base_atk,
            base_def: currentVariantData.base_def ?? selectedItem.base_def,
            stability: currentVariantData.stability ?? selectedItem.stability,
            // Importante: Asignamos stats base aquí por defecto
            stats: currentVariantData.stats, 
            selectedVariant: variantType
          };
       }
    }

    // 2. Determinar si permite custom stats
    // Si es variant "player" Y tiene la flag en true (o undefined en items viejos, cuidado aquí, mejor explícito)
    const isPlayerVariant = variantType === "player";
    // Leemos la propiedad del JSON. Si es Scroll, será false.
    const allowsCustom = currentVariantData?.allow_custom_stats === true;

    if (isPlayerVariant && allowsCustom) {
      // CASO A: Player Craft (Espadas, Armaduras) -> Usa los inputs manuales
      const statsToExport = customStats
        .filter(s => s.value !== 0)
        .map(s => ({ key: s.key, value: s.value }));
      
      processedItem.playerStats = statsToExport;
      processedItem.stats = []; // Borramos stats fijos para evitar duplicados en crafts puros
      processedItem.isPlayerMode = true; 
    } else {
      // CASO B: Drop, NPC, o Player Fixed (Scrolls)
      // Mantenemos los stats fijos que asignamos en el paso 1 (currentVariantData.stats)
      processedItem.playerStats = []; // Limpiamos custom stats previos
      processedItem.isPlayerMode = isPlayerVariant; // Sigue siendo player mode para lógica de colores, etc.
    }

    // 3. Sobrescribir valor base manual
    if (category === 'weapon') processedItem.base_atk = baseValue;
    else if (category === 'armor' || category === 'add' || category === 'ring') processedItem.base_def = baseValue;
    
    processedItem.modifiedBaseValue = baseValue;

    onSelect(processedItem); 
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantType, customStats, baseValue]); 

  const handleCustomStatChange = (idx: number, field: 'key' | 'value', val: any) => {
    setCustomStats(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const availableVariants = selectedItem?.variants ? Object.keys(selectedItem.variants) : [];

  // Helper para saber si mostrar inputs
  const currentVariantData = selectedItem?.variants?.[variantType];
  const showCustomInputs = variantType === "player" && currentVariantData?.allow_custom_stats === true;
  
  // Helper para saber si mostrar stats fijos (Scrolls caen aquí ahora)
  const showFixedStats = selectedItem && !showCustomInputs;

  const renderXtalStats = (xtalId: string) => {
    if (!xtalId || xtalId === "-1") return null;
    const xtal = xtalList.find(x => String(x.id) === String(xtalId));
    if (!xtal || !xtal.stats) return null;
    const statsEntries = Array.isArray(xtal.stats) ? xtal.stats.map((s: any) => [s.key, s.value]) : Object.entries(xtal.stats);
    return (
      <div className="mt-1 p-2 bg-black/40 rounded border border-gray-700 text-[10px] space-y-0.5">
        {statsEntries.map(([k, v]: any, i: number) => (
          <div key={i} className="flex justify-between text-blue-200">
            <span>{k}</span>
            <span className="font-mono text-white">{v}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700 dark:text-gray-200">{label}</h3>
        {showRefine && onRefineChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Refine:</span>
            <select
              className="border rounded p-1 text-center font-bold"
              style={{ width: '60px', color: '#ffffff', backgroundColor: '#333333', borderColor: '#555555', outline: 'none', cursor: 'pointer', appearance: 'menulist' }}
              value={refineValue}
              onChange={(e) => onRefineChange(e.target.value)}
            >
              {REFINE_LEVELS.map(r => <option key={r} value={r} style={{ color: '#ffffff', backgroundColor: '#333333' }}>+{r}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Selector de Item */}
      <select 
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-600"
        onChange={(e) => {
           const id = e.target.value;
           const item = items.find(i => String(i.id) === id);
           onSelect(item || null);
        }}
        value={selectedItem?.id || ""}
      >
        <option value="">-- Select {label} --</option>
        {items.map((item, idx) => (
          <option key={`${item.id}-${idx}`} value={item.id}>{item.name}</option>
        ))}
      </select>

      {/* Botones de Variantes */}
      {availableVariants.length > 0 && (
        <div className="flex gap-2 text-xs">
          {availableVariants.map(v => (
            <button 
              key={v}
              onClick={() => setVariantType(v)}
              className={`flex-1 py-1 rounded capitalize border border-gray-600 ${variantType === v ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-400'}`}
            >
              {v === 'unknown' ? 'Base' : v}
            </button>
          ))}
        </div>
      )}

      {/* Input de Base Stat Manual */}
      {selectedItem && (
        <div className="flex gap-2 items-center bg-gray-900 p-2 rounded border border-gray-700">
          <span className="text-xs font-bold text-gray-400 w-24">
            {category === 'weapon' ? 'ATK' : 'DEF'}:
          </span>
          <input 
            type="number"
            className="flex-1 p-1 text-sm bg-black border border-gray-600 rounded text-white text-center font-mono"
            value={baseValue}
            onChange={(e) => setBaseValue(Number(e.target.value))}
          />
        </div>
      )}

      {/* === CORRECCIÓN VISUAL === */}
      
      {/* 1. Renderizado de Stats FIJOS (Drop, NPC, o Player sin custom) */}
      {showFixedStats && (
        <div className="text-xs text-gray-400 p-2 bg-gray-900 rounded border border-gray-700">
          <p className="font-bold text-white mb-1">Stats:</p>
          {/* Prioridad: Stats de la variante > Stats base del item */}
          {(() => {
             const statsToShow = currentVariantData?.stats || selectedItem.stats;
             if (!statsToShow || (Array.isArray(statsToShow) && statsToShow.length === 0)) return <span className="italic text-gray-600">None</span>;
             
             const list = Array.isArray(statsToShow) ? statsToShow : Object.entries(statsToShow);
             return list.map((s:any, i:number) => {
                 const k = s.key || s[0];
                 const v = s.value || s[1];
                 return <div key={i} className="text-blue-300">{k}: {String(v)}</div>;
             });
          })()}
        </div>
      )}

      {/* 2. Custom Inputs SOLO si es Player Y allow_custom_stats es true */}
      {showCustomInputs && (
        <div className="grid grid-cols-1 gap-1 bg-gray-900 p-2 rounded border border-gray-700">
          <p className="font-bold text-white text-xs mb-1">Custom Stats (8 Slots):</p>
          {customStats.map((stat, idx) => (
            <div key={idx} className="flex gap-1">
              <select 
                className="flex-1 text-xs bg-gray-800 text-white border border-gray-600 rounded"
                value={stat.key}
                onChange={(e) => handleCustomStatChange(idx, 'key', e.target.value)}
              >
                {CRAFT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <input 
                type="number"
                className="w-16 text-xs bg-gray-800 text-white border border-gray-600 rounded text-center"
                value={stat.value}
                onChange={(e) => handleCustomStatChange(idx, 'value', Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      )}

       {/* Xtals */}
      {hasSlots && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          
          {/* SLOT 1 */}
          <div className="flex flex-col">
            <XtalSelect 
              label="Slot 1" 
              value={xtals.x1} 
              xtalKey="x1" 
              category={category} 
              list={xtalList} 
              setXtals={setXtals}
              icon={xtalIcon} // <--- PASAR EL ICONO AQUI
            />
            {renderXtalStats(xtals.x1)}
          </div>
          
          {/* SLOT 2 */}
          <div className="flex flex-col">
            <XtalSelect 
              label="Slot 2" 
              value={xtals.x2} 
              xtalKey="x2" 
              category={category} 
              list={xtalList} 
              setXtals={setXtals}
              icon={xtalIcon} // <--- PASAR EL ICONO AQUI TAMBIEN
            />
            {renderXtalStats(xtals.x2)}
          </div>

        </div>
      )}
    </div>
  );
}