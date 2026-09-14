import React, { useState } from 'react';
import { Play, Pause, X, Layers, Activity } from 'lucide-react';
import { ClinicalCondition, LayerOpacityState } from '../../types/anatomy';
import { LayerOpacityPanel } from './LayerOpacityPanel';

interface LeftControlPanelProps {
  condition: ClinicalCondition;
  onConditionChange: (cond: ClinicalCondition) => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onSetAngle: (angle: 'front' | 'side' | 'back') => void;
  onSetRegion: (region: 'full' | 'head' | 'chest' | 'abdomen' | 'legs') => void;
  explodeVal: number;
  onExplodeChange: (val: number) => void;
  showPins: boolean;
  onTogglePins: (show: boolean) => void;
  layerState: LayerOpacityState;
  onOpacityChange: (layer: keyof LayerOpacityState, opacity: number) => void;
  onVisibilityChange: (layer: keyof LayerOpacityState, visible: boolean) => void;
  onApplyPreset: (preset: 'default' | 'neuro' | 'angio' | 'pure') => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LeftControlPanel: React.FC<LeftControlPanelProps> = ({
  condition,
  onConditionChange,
  isAutoRotate,
  onToggleAutoRotate,
  onSetAngle,
  onSetRegion,
  explodeVal,
  onExplodeChange,
  showPins,
  onTogglePins,
  layerState,
  onOpacityChange,
  onVisibilityChange,
  onApplyPreset,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'layers'>('simulation');

  if (!isOpen) return null;

  const conditions: Array<{
    id: ClinicalCondition;
    name: string;
    sub: string;
    color: string;
    num: string;
  }> = [
    { id: 'sehat', name: 'Referensi Sehat (Normal)', sub: 'Homeostasis Fisiologis', color: '#10b981', num: '1' },
    { id: 'aterosklerosis', name: 'Aterosklerosis (Plak Arteri)', sub: 'Stenosis & Turbulensi', color: '#f59e0b', num: '2' },
    { id: 'stroke', name: 'Stroke Iskemik Serebral', sub: 'Oklusi Arteri Otak Akut', color: '#e11d48', num: '3' },
    { id: 'neuropati', name: 'Neuropati Perifer (Saraf Tepi)', sub: 'Degenerasi Akson Distal', color: '#0ea5e9', num: '4' },
  ];

  return (
    <aside className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-[22px] w-full max-w-xs z-30 flex flex-col max-h-[82vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Simulasi
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                activeTab === 'layers'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Lapisan
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          title="Tutup Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Scroll */}
      <div className="p-3.5 overflow-y-auto space-y-4 text-xs">
        {activeTab === 'simulation' ? (
          <>
            {/* Section 1: Clinical Conditions */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  1. Kondisi Klinis &amp; Patologi
                </span>
              </div>
              <div className="space-y-1.5">
                {conditions.map((c) => {
                  const isActive = condition === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onConditionChange(c.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <div className="min-w-0">
                          <p className={`font-bold text-[11px] truncate ${isActive ? 'text-indigo-950' : 'text-slate-800'}`}>
                            {c.name}
                          </p>
                          <p className="text-[9.5px] text-slate-500 truncate">{c.sub}</p>
                        </div>
                      </div>
                      <kbd className="text-[9px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border ml-1">
                        {c.num}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Camera Angles & View Presets */}
            <section className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                2. Kamera &amp; Sudut Pandang
              </span>
              <button
                onClick={onToggleAutoRotate}
                className={`w-full py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all mb-2 ${
                  isAutoRotate
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>Putar Otomatis 360°</span>
                <kbd className="text-[9px] font-mono ml-1 px-1 bg-black/10 rounded">Space</kbd>
              </button>

              <div className="grid grid-cols-3 gap-1 mb-2">
                <button
                  onClick={() => onSetAngle('front')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Depan 0°
                </button>
                <button
                  onClick={() => onSetAngle('side')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Samping 90°
                </button>
                <button
                  onClick={() => onSetAngle('back')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Belakang 180°
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => onSetRegion('head')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  🧠 Kepala
                </button>
                <button
                  onClick={() => onSetRegion('chest')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  🫀 Dada
                </button>
                <button
                  onClick={() => onSetRegion('abdomen')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  🩺 Perut
                </button>
                <button
                  onClick={() => onSetRegion('legs')}
                  className="py-1 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  🦵 Kaki
                </button>
              </div>
            </section>

            {/* Section 3: Exploded View Slider */}
            <section className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  3. Bongkar Struktur (Exploded View)
                </span>
                <span className="font-mono text-[10px] font-bold text-indigo-600">
                  {Math.round(explodeVal * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(explodeVal * 100)}
                onChange={(e) => onExplodeChange(parseFloat(e.target.value) / 100)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-2"
              />

              {/* Pin marker toggle */}
              <label className="flex items-center justify-between py-1 cursor-pointer select-none">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Label Mengambang 3D
                </span>
                <input
                  type="checkbox"
                  checked={showPins}
                  onChange={(e) => onTogglePins(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </section>
          </>
        ) : (
          <LayerOpacityPanel
            layerState={layerState}
            onOpacityChange={onOpacityChange}
            onVisibilityChange={onVisibilityChange}
            onApplyPreset={onApplyPreset}
          />
        )}
      </div>
    </aside>
  );
};
