import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const GestureHint: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('neuravena_hint_dismissed') === '1') {
        return;
      }
    } catch {
      // Ignore storage errors
    }

    setVisible(true);

    const timer = setTimeout(() => {
      handleDismiss();
    }, 8000);

    const handlePointerDown = () => {
      setTimeout(() => {
        handleDismiss();
      }, 2500);
    };

    window.addEventListener('pointerdown', handlePointerDown, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('neuravena_hint_dismissed', '1');
    } catch {
      // Ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="mx-auto pointer-events-auto transition-all duration-300 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/95 backdrop-blur border border-slate-200/90 shadow-md animate-in fade-in slide-in-from-top-2">
      <span>
        🖐️ Geser / drag untuk memutar 3D • Scroll / cubit untuk zoom • Klik organ / pin untuk kartu edukasi
      </span>
      <button
        onClick={handleDismiss}
        className="ml-1 text-slate-400 hover:text-slate-700 font-bold p-0.5 text-xs rounded"
        title="Tutup Petunjuk"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
