import React, { useState } from 'react';
import { Trophy, X, Eye, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPeekOrgan: (organId: string) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onPeekOrgan,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
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
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-sm">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">
                Evaluasi Neurovaskular Interaktif
              </h2>
              <p className="text-[10px] font-semibold text-slate-500 mt-1">
                Uji Pemahaman Anatomi, Fisiologi &amp; Patologi Klinis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {!isFinished ? (
            <>
              {/* Question Counter & 3D Peek button */}
              <div className="flex items-center justify-between">
                <span className="text-indigo-700 font-mono font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-[11px]">
                  Soal {currentIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <button
                  onClick={() => onPeekOrgan(currentQ.targetOrganId)}
                  className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-all flex items-center gap-1.5"
                  title="Fokus kamera 3D ke organ terkait"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>🔍 Intip di 3D Atlas</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Scenario Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Skenario Kasus Klinis:
                </span>
                <p className="text-[11.5px] text-slate-800 leading-relaxed font-medium">
                  {currentQ.scenario}
                </p>
              </div>

              {/* Question */}
              <p className="text-xs font-black text-slate-900">{currentQ.question}</p>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => {
                  let optStyle =
                    'bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50 hover:border-slate-300';
                  let icon = null;

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-200';
                      icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-200';
                      icon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
                    } else {
                      optStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${optStyle}`}
                    >
                      <span>{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission) */}
              {isAnswerSubmitted && (
                <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/90 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px] mb-1">
                    <span>💡 Penjelasan Patofisiologi:</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  <button
                    onClick={handleNext}
                    className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {currentIndex + 1 < QUIZ_QUESTIONS.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Summary Result Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-3xl mx-auto shadow-inner">
                {score >= 4 ? '🎉' : score >= 3 ? '👏' : '📚'}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {score >= 4 ? 'Luar Biasa!' : score >= 3 ? 'Pemahaman Bagus!' : 'Perlu Pendalaman'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Skor Akhir:{' '}
                  <span className="font-bold text-indigo-600 text-sm">
                    {score} / {QUIZ_QUESTIONS.length}
                  </span>{' '}
                  ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
                </p>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {score >= 4
                  ? 'Anda memiliki penguasaan klinis yang sangat mendalam terhadap integrasi sistem saraf dan sirkulasi darah manusia.'
                  : 'Gunakan atlas 3D dan kartu edukasi untuk meninjau kembali korelasi antara patologi vaskular dan manifestasi saraf perifer.'}
              </p>
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
