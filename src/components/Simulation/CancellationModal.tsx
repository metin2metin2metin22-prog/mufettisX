import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Timer, 
  Ban, 
  RotateCcw, 
  ShieldAlert,
  Lock
} from 'lucide-react';
import { getRemainingPenaltySeconds } from '../../utils/penaltyManager';

interface CancellationModalProps {
  offenseSnippet?: string;
  onRestart: () => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  offenseSnippet,
  onRestart
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => getRemainingPenaltySeconds());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingPenaltySeconds();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((300 - remainingSeconds) / 300) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-600/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* İptal Rozeti */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center shadow-xl shadow-rose-950/60 animate-bounce">
          <Ban className="w-10 h-10 text-rose-500 stroke-[2.5]" />
        </div>

        {/* Başlık ve Tutanak */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-black uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" />
            <span>Resmi Tutanak: Oturum Feshedildi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mülakat İptal Edildi!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Adayın mülakat adabı ve sınav ciddiyetiyle bağdaşmayan, gayriciddi veya lakayt ifadesi{' '}
            {offenseSnippet ? (
              <span className="font-mono font-bold text-rose-400 bg-rose-950/70 px-1.5 py-0.5 rounded border border-rose-800">
                "{offenseSnippet}"
              </span>
            ) : null}{' '}
            heyetimizce tespit edilmiş olup mülakat derhal sonlandırılmıştır.
          </p>
        </div>

        {/* 5 Dakikalık Geri Sayım Sayacı */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-rose-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Timer className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Yeniden Başvuru İçin Bekleme Süresi:</span>
            </span>
            <span className="font-mono text-slate-300">5 Dakika Ceza</span>
          </div>

          {/* Büyük Dijital Sayaç */}
          <div className="py-2">
            <span className="text-5xl font-mono font-black text-rose-400 tracking-wider">
              {formatTime(remainingSeconds)}
            </span>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-1000 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Sayfayı yenileseniz dahi süre devam eder. Süre bitmeden yeni oturuma izin verilmez.
          </p>
        </div>

        {/* Eylem Butonu */}
        <div>
          {remainingSeconds > 0 ? (
            <button
              disabled
              className="w-full py-3.5 rounded-2xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700/50"
            >
              <Lock className="w-4 h-4" />
              <span>Bekleme Süresi Dolmadan Giriş Yapılamaz ({formatTime(remainingSeconds)})</span>
            </button>
          ) : (
            <button
              onClick={onRestart}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ceza Süresi Doldu • Yeni Mülakata Başvur</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
