import React from 'react';
import { GENRES } from '../data';

interface TopBarProps {
  currentFilter: string;
  onFilterChange: (genre: string) => void;
}

export default function TopBar({ currentFilter, onFilterChange }: TopBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-white/40 backdrop-blur-[35px] saturate-[200%] border-b border-white/30 flex flex-col pt-safe px-3.5 pb-2.5">
      {/* フィルターチップ - 横スクロール */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pt-2 pb-0.5">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all shadow-sm border ${
            currentFilter === 'all'
              ? 'bg-[#007aff] text-white border-transparent shadow-[#007aff]/20'
              : 'bg-white/40 backdrop-blur-[15px] border-white/50 text-[#1c1c1e] hover:bg-white/60'
          }`}
        >
          すべて
        </button>

        {Object.entries(GENRES).map(([key, value]) => {
          const isActive = currentFilter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all shadow-sm border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#007aff] text-white border-transparent shadow-[#007aff]/30 shadow-lg'
                  : 'bg-white/40 backdrop-blur-[15px] border-white/50 text-[#1c1c1e] hover:bg-white/60'
              }`}
            >
              {!isActive && (
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: value.color }}
                />
              )}
              {value.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
