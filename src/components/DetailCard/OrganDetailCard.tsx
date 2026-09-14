import React, { useEffect, useRef } from 'react';
import { Eye, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { ClinicalCondition } from '../../types/anatomy';
import { ORGAN_DATABASE, ORGAN_ORDER } from '../../data/organDatabase';

interface OrganDetailCardProps {
  organId: string;
  condition: ClinicalCondition;
  isIsolateMode: boolean;
  onToggleIsolate: () => void;
  onSelectOrgan: (id: string) => void;
  onClose: () => void;
}

export const OrganDetailCard: React.FC<OrganDetailCardProps> = ({
  organId,
  condition,
  isIsolateMode,
  onToggleIsolate,
  onSelectOrgan,
  onClose,
}) => {
  const organ = ORGAN_DATABASE[organId];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentIndex = ORGAN_ORDER.indexOf(organId);
  const prevOrganId = ORGAN_ORDER[(currentIndex - 1 + ORGAN_ORDER.length) % ORGAN_ORDER.length];
  const nextOrganId = ORGAN_ORDER[(currentIndex + 1) % ORGAN_ORDER.length];

  // Canvas waveform animation (ECG for heart/vascular, action potential for nerves)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const isNerve = organ?.type === 'saraf';

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;

      // Grid
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isNerve ? '#14b8a6' : '#e11d48';

      offset += 1.8;
      for (let x = 0; x < w; x++) {
        const t = (x + offset) % 120;
        let y = mid;

        if (isNerve) {
          // Action potential spike
          if (t > 40 && t < 50) {
            y = mid - Math.sin(((t - 40) / 10) * Math.PI) * 22;
          } else if (t >= 50 && t < 65) {
            y = mid + Math.sin(((t - 50) / 15) * Math.PI) * 7;
          }
        } else {
          // ECG P-Q-R-S-T
          if (t > 20 && t < 30) y = mid - Math.sin(((t - 20) / 10) * Math.PI) * 4; // P
          else if (t > 33 && t < 36) y = mid + 4; // Q
          else if (t >= 36 && t < 44) y = mid - 25; // R
          else if (t >= 44 && t < 48) y = mid + 7; // S
          else if (t > 58 && t < 75) y = mid - Math.sin(((t - 58) / 17) * Math.PI) * 7; // T
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [organId, condition]);

  if (!organ) return null;

  const condData = organ.kondisi[condition];

  return (
    <section className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-[22px] w-full max-w-sm z-30 flex flex-col max-h-[82vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
            Kartu Edukasi
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 truncate max-w-[150px]">
            {condData.badge}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSelectOrgan(prevOrganId)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            title="Organ Sebelumnya (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectOrgan(nextOrganId)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            title="Organ Selanjutnya (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            title="Tutup Kartu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Scroll */}
      <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs">
        {/* Title & Latin */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{organ.icon}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-snug">{organ.name}</h2>
              <p className="text-[10px] italic font-semibold text-slate-500">{organ.latin}</p>
            </div>
          </div>
          <p className="text-[10.5px] font-bold text-indigo-600 mt-1">{organ.system}</p>
        </div>

        {/* ISOLATE / X-RAY GHOSTING TOGGLE BUTTON */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-50/90 to-sky-50/90 border border-indigo-200/80 flex items-center justify-between">
          <div className="min-w-0 mr-2">
            <div className="flex items-center gap-1 font-bold text-indigo-900 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Mode Isolasi (X-Ray Ghost)</span>
            </div>
            <p className="text-[9px] text-slate-500 truncate">
              Sorot organ ini, buat bagian tubuh lain tembus pandang
            </p>
          </div>
          <button
            onClick={onToggleIsolate}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              isIsolateMode
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-300'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isIsolateMode ? 'Aktif' : 'Isolasi'}</span>
            <kbd className="hidden sm:inline-block text-[8px] font-mono px-1 py-0.2 bg-black/10 rounded">
              I
            </kbd>
          </button>
        </div>

        {/* Anatomy */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            🧬 Anatomi &amp; Fungsi
          </span>
          <p className="text-[11px] text-slate-700 leading-relaxed">{organ.anatomi}</p>
        </div>

        {/* Physiology */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            ⚙️ Fisiologi &amp; Cara Kerja
          </span>
          <p className="text-[11px] text-slate-700 leading-relaxed">{organ.fisiologi}</p>
        </div>

        {/* Pathology for Current Condition */}
        <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
            🩺 Patologi Terkait: {condData.badge}
          </span>
          <p className="text-[11px] text-slate-800 leading-relaxed font-medium mb-1">
            {condData.patologi}
          </p>
          <p className="text-[10px] text-rose-900 bg-rose-100/70 p-1.5 rounded-lg leading-relaxed">
            <strong>Dampak Klinis:</strong> {condData.dampak}
          </p>
        </div>

        {/* Real-time Physiological Waveform */}
        <div className="p-2.5 rounded-xl bg-slate-900 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {organ.type === 'saraf' ? 'SIMULASI IMPULS LISTRIK SARAF' : 'SIMULASI GELOMBANG EKG / TEKANAN'}
            </span>
            <span className="font-mono text-[9px] text-slate-400">
              {organ.fisiologiData.value} {organ.fisiologiData.unit}
            </span>
          </div>
          <canvas ref={canvasRef} width={280} height={56} className="w-full h-14 rounded-lg bg-slate-950/80" />
          <p className="text-[9px] text-slate-400 mt-1 truncate">{organ.fisiologiData.desc}</p>
        </div>
      </div>
    </section>
  );
};
