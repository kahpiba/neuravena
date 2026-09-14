import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Viewer3D, Viewer3DRef } from './components/Viewer3D/Viewer3D';
import { TopBar } from './components/Header/TopBar';
import { LeftControlPanel } from './components/Panels/LeftControlPanel';
import { OrganDetailCard } from './components/DetailCard/OrganDetailCard';
import { SearchModal } from './components/Modals/SearchModal';
import { QuizModal } from './components/Modals/QuizModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { GestureHint } from './components/Common/GestureHint';
import { ClinicalCondition, LayerOpacityState } from './types/anatomy';
import { ORGAN_ORDER } from './data/organDatabase';

export const App: React.FC = () => {
  // 3D Engine Ref
  const viewerRef = useRef<Viewer3DRef | null>(null);

  // Core State
  const [selectedOrganId, setSelectedOrganId] = useState<string>('cerebrum');
  const [isDetailCardOpen, setIsDetailCardOpen] = useState<boolean>(true);
  const [condition, setCondition] = useState<ClinicalCondition>('sehat');
  const [isIsolateMode, setIsIsolateMode] = useState<boolean>(false);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [explodeVal, setExplodeVal] = useState<number>(0);
  const [focusFilter, setFocusFilter] = useState<'all' | 'nerves' | 'vessels'>('all');

  // Multi-channel Layer Opacity State
  const [layerState, setLayerState] = useState<LayerOpacityState>({
    nerves: { visible: true, opacity: 0.95 },
    arteries: { visible: true, opacity: 0.90 },
    veins: { visible: true, opacity: 0.85 },
    heart: { visible: true, opacity: 1.0 },
    skeleton: { visible: true, opacity: 0.50 },
    skin: { visible: true, opacity: 0.30 },
  });

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadLabel, setLoadLabel] = useState<string>('Menginisialisasi Atlas 3D...');
  const [loadPercent, setLoadPercent] = useState<number>(10);

  // Handle Organ Selection
  const handleSelectOrgan = useCallback((id: string) => {
    setSelectedOrganId(id);
    setIsDetailCardOpen(true);
    viewerRef.current?.focusOnOrgan(id);
  }, []);

  // Handle Layer Opacity Change
  const handleOpacityChange = (layer: keyof LayerOpacityState, opacity: number) => {
    setLayerState((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], opacity },
    }));
    viewerRef.current?.setLayerOpacity(layer, opacity);
  };

  // Handle Layer Visibility Change
  const handleVisibilityChange = (layer: keyof LayerOpacityState, visible: boolean) => {
    setLayerState((prev) => ({
      ...prev,
      [layer]: { ...prev[layer], visible },
    }));
    viewerRef.current?.setLayerVisibility(layer, visible);
  };

  // Quick Layer Presets
  const handleApplyPreset = (preset: 'default' | 'neuro' | 'angio' | 'pure') => {
    let newState: LayerOpacityState;
    if (preset === 'neuro') {
      newState = {
        nerves: { visible: true, opacity: 1.0 },
        arteries: { visible: true, opacity: 0.20 },
        veins: { visible: true, opacity: 0.15 },
        heart: { visible: true, opacity: 0.30 },
        skeleton: { visible: true, opacity: 0.10 },
        skin: { visible: false, opacity: 0 },
      };
    } else if (preset === 'angio') {
      newState = {
        nerves: { visible: true, opacity: 0.15 },
        arteries: { visible: true, opacity: 1.0 },
        veins: { visible: true, opacity: 0.90 },
        heart: { visible: true, opacity: 1.0 },
        skeleton: { visible: true, opacity: 0.10 },
        skin: { visible: false, opacity: 0 },
      };
    } else if (preset === 'pure') {
      newState = {
        nerves: { visible: true, opacity: 1.0 },
        arteries: { visible: true, opacity: 0.95 },
        veins: { visible: true, opacity: 0.90 },
        heart: { visible: true, opacity: 1.0 },
        skeleton: { visible: false, opacity: 0 },
        skin: { visible: false, opacity: 0 },
      };
    } else {
      newState = {
        nerves: { visible: true, opacity: 0.95 },
        arteries: { visible: true, opacity: 0.90 },
        veins: { visible: true, opacity: 0.85 },
        heart: { visible: true, opacity: 1.0 },
        skeleton: { visible: true, opacity: 0.50 },
        skin: { visible: true, opacity: 0.30 },
      };
    }

    setLayerState(newState);
    for (const [k, v] of Object.entries(newState)) {
      const key = k as keyof LayerOpacityState;
      viewerRef.current?.setLayerVisibility(key, v.visible);
      viewerRef.current?.setLayerOpacity(key, v.opacity);
    }
  };

  // Quick Focus Filter
  const handleFocusFilter = (filter: 'all' | 'nerves' | 'vessels') => {
    setFocusFilter(filter);
    if (filter === 'nerves') {
      handleApplyPreset('neuro');
    } else if (filter === 'vessels') {
      handleApplyPreset('angio');
    } else {
      handleApplyPreset('default');
    }
  };

  // Explode Change
  const handleExplodeChange = (val: number) => {
    setExplodeVal(val);
    viewerRef.current?.setExplode(val);
  };

  // Auto Rotate Toggle
  const handleToggleAutoRotate = () => {
    const next = viewerRef.current?.toggleAutoRotate();
    setIsAutoRotate(Boolean(next));
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isTyping = activeTag === 'input' || activeTag === 'textarea';

      // Escape always dismisses modals or card
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isQuizOpen) setIsQuizOpen(false);
        else if (isShortcutsOpen) setIsShortcutsOpen(false);
        else if (isDetailCardOpen) setIsDetailCardOpen(false);
        return;
      }

      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (isTyping) return;

      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const curIdx = ORGAN_ORDER.indexOf(selectedOrganId);
        const prev = ORGAN_ORDER[(curIdx - 1 + ORGAN_ORDER.length) % ORGAN_ORDER.length];
        handleSelectOrgan(prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const curIdx = ORGAN_ORDER.indexOf(selectedOrganId);
        const next = ORGAN_ORDER[(curIdx + 1) % ORGAN_ORDER.length];
        handleSelectOrgan(next);
      } else if (e.key === '1') {
        setCondition('sehat');
      } else if (e.key === '2') {
        setCondition('aterosklerosis');
      } else if (e.key === '3') {
        setCondition('stroke');
      } else if (e.key === '4') {
        setCondition('neuropati');
      } else if (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'x') {
        setIsIsolateMode((prev) => !prev);
      } else if (e.key === ' ') {
        e.preventDefault();
        handleToggleAutoRotate();
      } else if (e.key.toLowerCase() === 'q') {
        setIsQuizOpen(true);
      } else if (e.key === '?') {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedOrganId, isSearchOpen, isQuizOpen, isShortcutsOpen, isDetailCardOpen, handleSelectOrgan]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f5f7fc] text-slate-800 font-sans select-none">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Viewer3D
          ref={viewerRef}
          selectedOrganId={selectedOrganId}
          onSelectOrgan={handleSelectOrgan}
          condition={condition}
          isIsolateMode={isIsolateMode}
          showPins={showPins}
          onLoadComplete={() => setIsLoading(false)}
          onLoadProgress={(label, pct) => {
            setLoadLabel(label);
            setLoadPercent(Math.round(pct));
          }}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-md">
          <div className="bg-white/95 p-6 rounded-2xl shadow-xl border border-slate-200/80 text-center max-w-xs w-full space-y-4">
            <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-sm text-slate-800">Memuat Neuravena 3D</h3>
              <p className="text-xs text-slate-500 mt-0.5">{loadLabel}</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-200"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-600">{loadPercent}%</span>
          </div>
        </div>
      )}

      {/* HUD & UI Layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-none p-3 sm:p-4 lg:p-5 gap-3">
        {/* Top Header */}
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onResetCamera={() => viewerRef.current?.resetCamera()}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />

        {/* Gesture Hint Pill */}
        <GestureHint />

        {/* Main Content Area: Left Panel & Right Detail Card */}
        <div className="flex-1 flex items-start justify-between gap-3 overflow-hidden min-h-0">
          <LeftControlPanel
            condition={condition}
            onConditionChange={(c) => setCondition(c)}
            isAutoRotate={isAutoRotate}
            onToggleAutoRotate={handleToggleAutoRotate}
            onSetAngle={(angle) => viewerRef.current?.setViewAngle(angle)}
            onSetRegion={(region) => viewerRef.current?.setBodyRegion(region)}
            explodeVal={explodeVal}
            onExplodeChange={handleExplodeChange}
            showPins={showPins}
            onTogglePins={setShowPins}
            layerState={layerState}
            onOpacityChange={handleOpacityChange}
            onVisibilityChange={handleVisibilityChange}
            onApplyPreset={handleApplyPreset}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Spacer for 3D Viewport */}
          <div className="hidden lg:block flex-1 pointer-events-none" />

          {/* Right Organ Detail Card */}
          {isDetailCardOpen && (
            <OrganDetailCard
              organId={selectedOrganId}
              condition={condition}
              isIsolateMode={isIsolateMode}
              onToggleIsolate={() => setIsIsolateMode((prev) => !prev)}
              onSelectOrgan={handleSelectOrgan}
              onClose={() => setIsDetailCardOpen(false)}
            />
          )}
        </div>

        {/* Bottom Bar: Quick Filter & Flow Indicator */}
        <footer className="pointer-events-auto bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-none">
                Simulasi Aliran Darah, Nutrisi &amp; Impuls Saraf
              </h4>
              <div className="hidden sm:flex items-center gap-3 text-[9px] text-slate-500 font-semibold mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> O₂ Arteri
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Nutrisi
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> CO₂ Balik Vena
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Impuls Saraf
                </span>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => handleFocusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                focusFilter === 'all'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => handleFocusFilter('nerves')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                focusFilter === 'nerves'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧠 Saraf
            </button>
            <button
              onClick={() => handleFocusFilter('vessels')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                focusFilter === 'vessels'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🫀 Pembuluh
            </button>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectOrgan={handleSelectOrgan}
      />
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onPeekOrgan={(id) => viewerRef.current?.focusOnOrgan(id)}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
