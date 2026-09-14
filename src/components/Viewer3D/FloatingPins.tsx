import React from 'react';
import { ORGAN_DATABASE } from '../../data/organDatabase';

interface FloatingPinsProps {
  pinPositions: Record<string, { x: number; y: number; visible: boolean }>;
  selectedOrganId: string;
  onSelectOrgan: (organId: string) => void;
  visible: boolean;
}

export const FloatingPins: React.FC<FloatingPinsProps> = ({
  pinPositions,
  selectedOrganId,
  onSelectOrgan,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {Object.entries(ORGAN_DATABASE).map(([id, organ]) => {
        const pos = pinPositions[id];
        if (!pos || !pos.visible) return null;

        const isSelected = selectedOrganId === id;

        return (
          <div
            key={id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectOrgan(id);
            }}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
            }}
            className={`absolute pointer-events-auto cursor-pointer transition-transform duration-100 ease-out select-none group`}
          >
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-md backdrop-blur border transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 scale-105 ring-2 ring-indigo-300 ring-offset-1'
                  : 'bg-white/90 text-slate-700 border-slate-200/90 hover:bg-white hover:scale-105 hover:border-indigo-300'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: organ.color }}
              />
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{organ.pinLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
