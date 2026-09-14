import React from 'react';
import { Sliders, Eye, EyeOff, Sparkles } from 'lucide-react';
import { LayerOpacityState } from '../../types/anatomy';

interface LayerOpacityPanelProps {
  layerState: LayerOpacityState;
  onOpacityChange: (layer: keyof LayerOpacityState, opacity: number) => void;
  onVisibilityChange: (layer: keyof LayerOpacityState, visible: boolean) => void;
  onApplyPreset: (preset: 'default' | 'neuro' | 'angio' | 'pure') => void;
}

export const LayerOpacityPanel: React.FC<LayerOpacityPanelProps> = ({
  layerState,
  onOpacityChange,
  onVisibilityChange,
  onApplyPreset,
}) => {
  const layers: Array<{
    key: keyof LayerOpacityState;
    label: string;
    icon: string;
    color: string;
  }> = [
    { key: 'nerves', label: 'Sistem Saraf & Impuls', icon: '🧠', color: '#14b8a6' },
    { key: 'arteries', label: 'Arteri (O₂ & Nutrisi)', icon: '🔴', color: '#e11d48' },
    { key: 'veins', label: 'Vena (Aliran Balik CO₂)', icon: '🔵', color: '#3b82f6' },
    { key: 'heart', label: 'Jantung 3D & Sirkulasi', icon: '🫀', color: '#991b1b' },
    { key: 'skeleton', label: 'Kerangka Acuan (Ghost)', icon: '🦴', color: '#cbd5e1' },
    { key: 'skin', label: 'Siluet Kulit (Transparan)', icon: '👤', color: '#94a3b8' },
  ];

  return (
    <div className="space-y-3.5 pt-2">
      {/* Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Preset Klinis Cepat
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onApplyPreset('default')}
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all text-left"
          >
            ⚡ Lengkap (Default)
          </button>
          <button
            onClick={() => onApplyPreset('neuro')}
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all text-left"
          >
            🧠 Fokus Saraf
          </button>
          <button
            onClick={() => onApplyPreset('angio')}
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all text-left"
          >
            🫀 Fokus Vaskular
          </button>
          <button
            onClick={() => onApplyPreset('pure')}
            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all text-left"
          >
            ✨ Saraf &amp; Pembuluh Saja
          </button>
        </div>
      </div>

      {/* Individual Layer Sliders */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sliders className="w-3 h-3 text-indigo-500" /> Transparansi Lapisan (Opacity)
        </span>

        {layers.map(({ key, label, icon, color }) => {
          const item = layerState[key];
          const pct = Math.round(item.opacity * 100);

          return (
            <div
              key={key}
              className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">{icon}</span>
                  <span className="text-[11px] font-semibold text-slate-700 truncate">{label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-[10px] font-bold text-indigo-600 w-8 text-right">
                    {item.visible ? `${pct}%` : 'Mati'}
                  </span>
                  <button
                    onClick={() => onVisibilityChange(key, !item.visible)}
                    className={`p-1 rounded-md transition-all ${
                      item.visible
                        ? 'text-slate-500 hover:bg-slate-200'
                        : 'text-slate-300 bg-slate-100'
                    }`}
                    title={item.visible ? 'Sembunyikan layer' : 'Tampilkan layer'}
                  >
                    {item.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.visible ? pct : 0}
                  disabled={!item.visible}
                  onChange={(e) => onOpacityChange(key, parseFloat(e.target.value) / 100)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-30"
                  style={{
                    accentColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
