import React from 'react';
import { Search, Trophy, RotateCcw, HelpCircle, Menu } from 'lucide-react';

interface TopBarProps {
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  onOpenShortcuts: () => void;
  onResetCamera: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSearch,
  onOpenQuiz,
  onOpenShortcuts,
  onResetCamera,
  onToggleSidebar,
}) => {
  return (
    <header className="flex items-center justify-between pointer-events-auto gap-2 sm:gap-3 w-full">
      {/* Brand Identity */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm rounded-2xl flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl shrink-0 bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/20">
            NV
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                NEURAVENA
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                3D NEUROVASCULAR ATLAS
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-medium truncate">
              Atlas Anatomi Interaktif Sistem Saraf &amp; Vaskular
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm hover:bg-white hover:border-indigo-300 transition-all"
          title="Pencarian Cepat Organ & Kondisi (Ctrl+K)"
          aria-label="Cari Organ"
        >
          <Search className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">Cari</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[8.5px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/90 backdrop-blur border border-indigo-200 shadow-sm hover:bg-indigo-100 transition-all"
          title="Evaluasi & Kuis Neurovaskular Interaktif"
          aria-label="Kuis Klinis"
        >
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="hidden sm:inline">Kuis</span>
        </button>

        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm hover:bg-white hover:border-indigo-300 transition-all"
          title="Tampilkan / Sembunyikan Kontrol & Legend"
          aria-label="Toggle Panel"
        >
          <Menu className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">Panel</span>
        </button>

        <button
          onClick={onResetCamera}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm hover:bg-white hover:border-indigo-300 transition-all"
          title="Kembalikan Sudut Kamera Awal"
          aria-label="Reset Kamera"
        >
          <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold text-slate-600 bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm hover:bg-white hover:text-indigo-600 transition-all"
          title="Panduan Pintasan Keyboard (?)"
          aria-label="Pintasan Keyboard"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
