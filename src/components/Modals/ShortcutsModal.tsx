import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { label: 'Cari Organ Instan', key: 'Ctrl + K / ⌘K / /' },
    { label: 'Ganti Organ (Sebelumnya / Selanjutnya)', key: '← / →' },
    { label: 'Pilih Kondisi: Sehat', key: '1' },
    { label: 'Pilih Kondisi: Aterosklerosis', key: '2' },
    { label: 'Pilih Kondisi: Stroke Iskemik', key: '3' },
    { label: 'Pilih Kondisi: Neuropati Perifer', key: '4' },
    { label: 'Mode Isolasi (X-Ray Ghosting)', key: 'I' },
    { label: 'Putar Otomatis 360° (Pause / Play)', key: 'Space' },
    { label: 'Buka Evaluasi / Kuis', key: 'Q' },
    { label: 'Tutup Modal / Kartu Edukasi', key: 'Esc' },
    { label: 'Buka Panduan Pintasan Ini', key: '?' },
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Pintasan Keyboard (Shortcuts)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 overflow-y-auto divide-y divide-slate-100 text-xs">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="font-medium text-slate-700">{item.label}</span>
              <kbd className="px-2 py-0.5 bg-slate-100 font-mono text-[10.5px] rounded border border-slate-200 text-slate-800 shadow-2xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10.5px] text-slate-400">
          Tekan <kbd className="px-1 bg-white rounded border">Esc</kbd> untuk menutup jendela ini
        </div>
      </div>
    </div>
  );
};
