// components/calculator/EquipmentSlot.tsx
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

  // === EFECTO 1: Resetear variante y actualizar baseValue inicial ===
  useEffect(() => {
    if (selectedItem) {
       // 1. Verificar si la variante actual existe en el nuevo item
       if (selectedItem.variants && !selectedItem.variants[variantType]) {
          const firstVariant = Object.keys(selectedItem.variants)[0];
          setVariantType(firstVariant || "drop");
          // Importante: Si cambiamos la variante, salimos. 
          // El cambio de estado de setVariantType disparará este efecto de nuevo correctamente.
          return; 
       }

       let initialVal = 0;
       if (selectedItem.variants && selectedItem.variants[variantType]) {
          const v = selectedItem.variants[variantType];
          initialVal = category === 'weapon' ? v.base_atk : v.base_def;
       } else {
          initialVal = category === 'weapon' ? selectedItem.base_atk : selectedItem.base_def;
       }
       
       // Si el item ya trae un valor modificado (porque venimos de una carga o edición previa), lo respetamos
       setBaseValue(Number(selectedItem.modifiedBaseValue ?? initialVal ?? 0));
    }
  // CORRECCIÓN AQUÍ: Eliminado 'selectedItem' completo, solo usamos 'selectedItem?.id'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.id, variantType, category]); 

  // === EFECTO 2: Manejo de actualización hacia el padre ===
  useEffect(() => {
    if (!selectedItem) return;

    let processedItem = { ...selectedItem };
    let currentVariantData = null;

    if (selectedItem.variants) {
       currentVariantData = selectedItem.variants[variantType];
       if (currentVariantData) {
          processedItem = {
            ...processedItem,
            base_atk: currentVariantData.base_atk ?? selectedItem.base_atk,
            base_def: currentVariantData.base_def ?? selectedItem.base_def,
            stability: currentVariantData.stability ?? selectedItem.stability,
            stats: currentVariantData.stats, 
            selectedVariant: variantType
          };
       }
    }

    const isPlayerVariant = variantType === "player";
    const allowsCustom = currentVariantData?.allow_custom_stats === true;

    if (isPlayerVariant && allowsCustom) {
      const statsToExport = customStats
        .filter(s => s.value !== 0)
        .map(s => ({ key: s.key, value: s.value }));
      
      processedItem.playerStats = statsToExport;
      processedItem.stats = [];
      processedItem.isPlayerMode = true; 
    } else {
      processedItem.playerStats = [];
      processedItem.isPlayerMode = isPlayerVariant;
    }

    // Actualizar ATK/DEF basado en el input manual (baseValue)
    if (category === 'weapon') processedItem.base_atk = baseValue;
    else if (category === 'armor' || category === 'add' || category === 'ring') processedItem.base_def = baseValue;
    
    processedItem.modifiedBaseValue = baseValue;

    // Solo llamamos a onSelect si realmente ha cambiado algo relevante para evitar ciclos,
    // pero como React optimiza los estados, el ciclo principal se rompió en el Efecto 1.
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

  const currentVariantData = selectedItem?.variants?.[variantType];
  const showCustomInputs = variantType === "player" && currentVariantData?.allow_custom_stats === true;
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
    <div className="bg-[#121212] p-4 rounded-lg shadow-sm border border-gray-800 flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-200 text-sm">{label}</h3>
        {showRefine && onRefineChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 text-xs">Refine:</span>
            <select
              className="border border-gray-700 rounded p-0 text-center font-bold bg-[#0f0f0f] text-white outline-none cursor-pointer h-[30px]"
              style={{ width: '60px' }}
              value={refineValue}
              onChange={(e) => onRefineChange(e.target.value)}
            >
              {REFINE_LEVELS.map(r => (
                <option key={r} value={r} className="bg-[#0f0f0f] text-white">
                  +{r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selector de Item */}
      <select 
        className="w-full h-[40px] px-2 border rounded bg-[#0f0f0f] text-white border-gray-700 outline-none"
        onChange={(e) => {
           const id = e.target.value;
           const item = items.find(i => String(i.id) === id);
           onSelect(item || null);
        }}
        value={selectedItem?.id || ""}
      >
        <option value="">-- Select {label || "Item"} --</option>
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
        <div className="flex gap-2 items-center bg-[#1a1a1a] p-2 rounded border border-gray-700">
          <span className="text-xs font-bold text-gray-400 w-24">
            {category === 'weapon' ? 'ATK' : 'DEF'}:
          </span>
          <input 
            type="number"
            className="flex-1 p-1 text-sm bg-[#0f0f0f] border border-gray-600 rounded text-white text-center font-mono outline-none"
            value={baseValue}
            onChange={(e) => setBaseValue(Number(e.target.value))}
          />
        </div>
      )}

      {/* Stats Fijos */}
      {showFixedStats && (
        <div className="text-xs text-gray-400 p-2 bg-[#1a1a1a] rounded border border-gray-700">
          <p className="font-bold text-white mb-1">Stats:</p>
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

      {/* Custom Inputs */}
      {showCustomInputs && (
        <div className="grid grid-cols-1 gap-1 bg-[#1a1a1a] p-2 rounded border border-gray-700">
          <p className="font-bold text-white text-xs mb-1">Custom Stats (8 Slots):</p>
          {customStats.map((stat, idx) => (
            <div key={idx} className="flex gap-1">
              <select 
                className="flex-1 text-xs bg-[#0f0f0f] text-white border border-gray-600 rounded h-[30px]"
                value={stat.key}
                onChange={(e) => handleCustomStatChange(idx, 'key', e.target.value)}
              >
                {CRAFT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <input 
                type="number"
                className="w-16 text-xs bg-[#0f0f0f] text-white border border-gray-600 rounded text-center h-[30px]"
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
          <div className="flex flex-col">
            <XtalSelect 
              label="Slot 1" 
              value={xtals.x1} 
              xtalKey="x1" 
              category={category} 
              list={xtalList} 
              setXtals={setXtals}
              icon={xtalIcon} 
            />
            {renderXtalStats(xtals.x1)}
          </div>
          <div className="flex flex-col">
            <XtalSelect 
              label="Slot 2" 
              value={xtals.x2} 
              xtalKey="x2" 
              category={category} 
              list={xtalList} 
              setXtals={setXtals}
              icon={xtalIcon} 
            />
            {renderXtalStats(xtals.x2)}
          </div>
        </div>
      )}
    </div>
  );
}