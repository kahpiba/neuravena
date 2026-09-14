import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { ORGAN_DATABASE } from '../../data/organDatabase';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrgan: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectOrgan,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'saraf' | 'vaskular'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredOrgans = Object.values(ORGAN_DATABASE).filter((organ) => {
    if (category !== 'all' && organ.type !== category) return false;
    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      organ.name.toLowerCase().includes(q) ||
      organ.latin.toLowerCase().includes(q) ||
      organ.shortDesc.toLowerCase().includes(q) ||
      organ.anatomi.toLowerCase().includes(q) ||
      organ.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredOrgans.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredOrgans.length) % Math.max(1, filteredOrgans.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOrgans[selectedIndex]) {
        onSelectOrgan(filteredOrgans[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Pencarian Cepat Organ &amp; Kondisi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik nama organ, fungsi, atau penyakit (cth: stroke, otak, karotis)..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-6 top-5" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-6 top-5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter:
            </span>
            <button
              onClick={() => {
                setCategory('all');
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                category === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Semua (9)
            </button>
            <button
              onClick={() => {
                setCategory('saraf');
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                category === 'saraf'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              🧠 Saraf (4)
            </button>
            <button
              onClick={() => {
                setCategory('vaskular');
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                category === 'vaskular'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              🫀 Vaskular (5)
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 space-y-1">
          {filteredOrgans.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tidak ditemukan organ dengan kata kunci &quot;{query}&quot;
            </div>
          ) : (
            filteredOrgans.map((organ, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={organ.id}
                  onClick={() => {
                    onSelectOrgan(organ.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{organ.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {organ.name}
                        </span>
                        <span
                          className={`text-[8.5px] font-extrabold px-1.5 py-0.2 rounded border ${
                            organ.type === 'saraf'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {organ.type === 'saraf' ? 'SARAF' : 'VASKULAR'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{organ.shortDesc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>
            Gunakan <kbd className="px-1 bg-white rounded border">↑</kbd>{' '}
            <kbd className="px-1 bg-white rounded border">↓</kbd> navigasi,{' '}
            <kbd className="px-1 bg-white rounded border">Enter</kbd> buka
          </span>
          <span>ESC untuk keluar</span>
        </div>
      </div>
    </div>
  );
};
