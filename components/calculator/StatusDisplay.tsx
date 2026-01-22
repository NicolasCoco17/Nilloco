import React, { useState } from "react";
import { DetailedStats } from "@/lib/engine/types";

export function StatusDisplay({ stats }: { stats: DetailedStats }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!stats) return null;

  return (
    <div className="w-full bg-[#121212] border border-[#222] rounded-xl p-4 mt-6 text-white text-sm">
      {/* Título Toggleable */}
      <div 
        className="flex justify-between items-center cursor-pointer border-b border-[#333] pb-2 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-[#00ccff] uppercase tracking-wider">Status</h2>
        <span className="text-[#666]">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLUMNA 1: DEFENSIVE */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#00ff88] border-b border-[#333] pb-1">Defensive</h3>
            <StatRow label="MaxHP" value={stats.MaxHP} />
            <StatRow label="MaxMP" value={`${stats.MaxMP} (${Math.min(stats.MaxMP, 2000)})`} />
            <StatRow label="AMPR" value={stats.AMPR} />
            <StatRow label="DEF" value={stats.DEF} />
            <StatRow label="MDEF" value={stats.MDEF} />
            <StatRow label="Dodge" value={stats.FLEE} />
            <StatRow label="Phys. Res %" value={`${stats.PhysicalResistance}%`} />
            <StatRow label="Magic Res %" value={`${stats.MagicResistance}%`} />
            <StatRow label="Ailment Res %" value={`${stats.AilmentResistance}%`} />
            <StatRow label="Aggro %" value={`${stats.Aggro}%`} />
            <StatRow label="Phys Barrier" value={stats.PhysicalBarrier} />
            <StatRow label="Mag Barrier" value={stats.MagicBarrier} />
          </div>

          {/* COLUMNA 2: OFFENSIVE PHYSICAL */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#ff5555] border-b border-[#333] pb-1">Physical</h3>
            <StatRow label="ATK" value={stats.ATK} highlight />
            <StatRow label="Stability %" value={`${stats.Stability}%`} />
            <StatRow label="ASPD" value={stats.ASPD} />
            <StatRow label="Motion Speed" value={stats.MotionSpeed} />
            <StatRow label="Phys. Pierce %" value={`${stats.PhysicalPierce}%`} />
            <StatRow label="Accuracy" value={stats.Accuracy} />
            <StatRow label="Crit Rate" value={stats.CriticalRate} />
            <StatRow label="Crit Dmg" value={`${stats.CriticalDamage}%`} />
            <StatRow label="Unsheathe %" value={`${stats.Unsheathe}%`} />
          </div>

          {/* COLUMNA 3: OFFENSIVE MAGIC */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#55aaff] border-b border-[#333] pb-1">Magic</h3>
            <StatRow label="MATK" value={stats.MATK} highlight />
            <StatRow label="Mag. Stability %" value={`${stats.MagicStability}%`} />
            <StatRow label="CSPD" value={stats.CSPD} />
            <StatRow label="Mag. Pierce %" value={`${stats.MagicPierce}%`} />
            
            {/* NUEVAS FILAS */}
            <StatRow label="Magic Crit Rate" value={`${stats.MagicCriticalRate}%`} />
            <StatRow 
                label="M.CR (w/ Weaken)" 
                value={`${stats.MagicCriticalRateWeaken}%`} 
                color="#aaaaff" // Un color ligeramente diferente para diferenciar
            />
            <StatRow label="Magic Crit Dmg" value={`${stats.MagicCriticalDamage}%`} />
            
            <StatRow label="Add. Magic %" value={`${stats.AdditionalMagic}%`} />
          </div>

          {/* COLUMNA 4: ELEMENTS & GENERAL */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#ffff55] border-b border-[#333] pb-1">Elements</h3>
            <StatRow label="Element" value={stats.Element} color="#ffff55" />
            <div className="grid grid-cols-3 gap-1 text-xs text-center mt-2">
                <div className="text-[#666]">Ele</div>
                <div className="text-[#666]">DTE%</div>
                <div className="text-[#666]">Res%</div>
                
                <span>Fire</span><span>{stats.DTE_Fire}%</span><span>{stats.RES_Fire}%</span>
                <span>Water</span><span>{stats.DTE_Water}%</span><span>{stats.RES_Water}%</span>
                <span>Wind</span><span>{stats.DTE_Wind}%</span><span>{stats.RES_Wind}%</span>
                <span>Earth</span><span>{stats.DTE_Earth}%</span><span>{stats.RES_Earth}%</span>
                <span>Light</span><span>{stats.DTE_Light}%</span><span>{stats.RES_Light}%</span>
                <span>Dark</span><span>{stats.DTE_Dark}%</span><span>{stats.RES_Dark}%</span>
                <span>Neut</span><span>{stats.DTE_Neutral}%</span><span>{stats.RES_Neutral}%</span>
            </div>
            
            <h3 className="font-bold text-[#ff55ff] border-b border-[#333] pb-1 mt-4">General</h3>
            <StatRow label="Short Range %" value={`${stats.ShortRangeDmg}%`} />
            <StatRow label="Long Range %" value={`${stats.LongRangeDmg}%`} />
          </div>

        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, highlight, color }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#aaa]">{label}</span>
      <span 
        className="font-mono font-bold" 
        style={{ 
            color: color ? color : (highlight ? '#fff' : '#00ccff'),
            fontSize: highlight ? '1.1em' : '1em'
        }}
      >
        {value}
      </span>
    </div>
  );
}