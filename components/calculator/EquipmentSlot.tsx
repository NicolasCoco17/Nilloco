"use client";

import { FULL_STAT_LIST } from "@/lib/constants"; 
import { useState, useEffect } from "react";
import { XtalSelect, XtalSlotState, Category } from "./XtalSelect";
import type { Xtal } from "@/types/xtal";

// Lista de stats para crafting (Player Mode)
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
  
  xtalList: Xtal[];
  xtals: XtalSlotState;
  setXtals: React.Dispatch<React.SetStateAction<XtalSlotState>>;
  
  hasSlots?: boolean;
};

const REFINE_LEVELS = ["0","1","2","3","4","5","6","7","8","9","E","D","C","B","A","S"];

export function EquipmentSlot({ 
  label, category, items, selectedItem, onSelect, 
  refineValue, onRefineChange, 
  xtalList, xtals, setXtals, hasSlots = true 
}: Props) {
  
  // Estado para variante seleccionada (drop, npc, player)
  const [variantType, setVariantType] = useState<string>("drop");
  
  // Estado para los 8 stats customizables (solo player mode)
  const [customStats, setCustomStats] = useState<CustomStat[]>(
    Array(8).fill({ key: "STR", value: 0 })
  );

  // Estado para el ATK/DEF base manual
  const [baseValue, setBaseValue] = useState<number>(0);

  // Efecto 1: Resetear variante y actualizar baseValue inicial al cambiar item
  useEffect(() => {
    if (selectedItem) {
       // Resetear variante si no existe en el nuevo item
       if (selectedItem.variants && !selectedItem.variants[variantType]) {
          setVariantType(Object.keys(selectedItem.variants)[0]);
       }

       // Determinar valor base inicial desde el objeto seleccionado o sus variantes
       let initialVal = 0;
       if (selectedItem.variants && selectedItem.variants[variantType]) {
          const v = selectedItem.variants[variantType];
          initialVal = category === 'weapon' ? v.base_atk : v.base_def;
       } else {
          initialVal = category === 'weapon' ? selectedItem.base_atk : selectedItem.base_def;
       }
       
       // Si el item ya tiene un valor modificado guardado, usar ese
       setBaseValue(Number(selectedItem.modifiedBaseValue ?? initialVal ?? 0));
    }
  }, [selectedItem?.id, variantType]); 

  // Efecto 2: Construir y enviar el objeto procesado al padre
  useEffect(() => {
    if (!selectedItem) return;

    let processedItem = { ...selectedItem };

    // Procesar Variante
    if (selectedItem.variants) {
       const variantData = selectedItem.variants[variantType];
       if (variantData) {
          processedItem = {
            ...processedItem,
            base_atk: variantData.base_atk ?? selectedItem.base_atk,
            base_def: variantData.base_def ?? selectedItem.base_def,
            stability: variantData.stability ?? selectedItem.stability,
            stats: variantData.stats, 
            selectedVariant: variantType
          };
       }
    }

    // Procesar Player Stats
    if (variantType === "player") {
      const statsToExport = customStats
        .filter(s => s.value !== 0)
        .map(s => ({ key: s.key, value: s.value }));
      
      processedItem.playerStats = statsToExport;
      processedItem.stats = []; 
      processedItem.isPlayerMode = true; // Flag importante para el aggregator
    } else {
      processedItem.isPlayerMode = false;
    }

    // SOBRESCRIBIR CON EL VALOR MANUAL
    if (category === 'weapon') processedItem.base_atk = baseValue;
    else if (category === 'armor' || category === 'add' || category === 'ring') processedItem.base_def = baseValue;
    
    processedItem.modifiedBaseValue = baseValue; // Guardar para persistencia local

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

  // === NUEVA FUNCIÓN: RENDERIZAR STATS DEL XTAL ===
  const renderXtalStats = (xtalId: string) => {
    if (!xtalId || xtalId === "-1") return null;
    
    // Buscar el Xtal en la lista
    const xtal = xtalList.find(x => String(x.id) === String(xtalId));
    if (!xtal || !xtal.stats) return null;

    // Normalizar stats (array u objeto)
    const statsEntries = Array.isArray(xtal.stats)
      ? xtal.stats.map((s: any) => [s.key, s.value])
      : Object.entries(xtal.stats);

    // DEVOLVER JSX (Esto es lo que faltaba)
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
        {onRefineChange && (
          <div className="flex items-center gap-2 text-sm">
            <span>Refine:</span>
            <select className="border rounded p-1 w-12 text-center bg-gray-700 text-white" value={refineValue} onChange={(e) => onRefineChange(e.target.value)}>
              {REFINE_LEVELS.map(r => <option key={r} value={r}>+{r}</option>)}
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
          <option key={`${item.id}-${idx}`} value={item.id}>
            {item.name}
          </option>
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

      {/* Renderizado de Stats (Modo NO Player) */}
      {selectedItem && variantType !== "player" && (
        <div className="text-xs text-gray-400 p-2 bg-gray-900 rounded border border-gray-700">
          <p className="font-bold text-white mb-1">Variant Stats:</p>
          {selectedItem.stats && (Array.isArray(selectedItem.stats) ? selectedItem.stats : Object.entries(selectedItem.stats)).map((s:any, i:number) => {
             const k = s.key || s[0];
             const v = s.value || s[1];
             return <div key={i} className="text-blue-300">{k}: {String(v)}</div>;
          })}
        </div>
      )}

      {/* 8 Custom Inputs para Player Mode */}
      {selectedItem && variantType === "player" && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          <div className="flex flex-col">
            <XtalSelect label="Slot 1" value={xtals.x1} xtalKey="x1" category={category} list={xtalList} setXtals={setXtals} />
            {/* Renderizar Stats Xtal 1 */}
            {renderXtalStats(xtals.x1)}
          </div>
          
          <div className="flex flex-col">
            <XtalSelect label="Slot 2" value={xtals.x2} xtalKey="x2" category={category} list={xtalList} setXtals={setXtals} />
            {/* Renderizar Stats Xtal 2 */}
            {renderXtalStats(xtals.x2)}
          </div>
        </div>
      )}
    </div>
  );
}