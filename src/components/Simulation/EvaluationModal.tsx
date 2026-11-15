import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { InterviewEvaluationReport } from '../../types';
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  Download, 
  BookOpen, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';

interface EvaluationModalProps {
  report: InterviewEvaluationReport;
  onRestart: () => void;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  report,
  onRestart,
  onClose
}) => {
  useEffect(() => {
    if (report.overallScore >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [report.overallScore]);

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'BAŞARILI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <CheckCircle className="w-4 h-4" />
            KOMİSYON KARARI: BAŞARILI (KAZANDI)
          </span>
        );
      case 'YEDEKLERDE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-4 h-4" />
            KOMİSYON KARARI: YEDEK LİSTE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
            <XCircle className="w-4 h-4" />
            KOMİSYON KARARI: YETERSİZ (ELENDİ)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Başlık ve Karar */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/40">
            <Award className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            Mülakat Değerlendirme Raporu
          </h2>
          <p className="text-xs text-slate-400">
            {report.institution} • {report.position}
          </p>
          <div className="pt-1">
            {getVerdictBadge(report.verdict)}
          </div>
        </div>

        {/* Genel Puan Dairesi / Kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Mevzuat Bilgisi</span>
            <p className="text-2xl font-extrabold text-brand-400 mt-0.5">%{report.scores.legalKnowledge}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Muhakeme Yetisi</span>
            <p className="text-2xl font-extrabold text-indigo-400 mt-0.5">%{report.scores.logicalReasoning}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">İfade & Diksiyon</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">%{report.scores.expressionAndDiction}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Etik & Stres</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-0.5">%{report.scores.ethicsAndStressManagement}</p>
          </div>
        </div>

        {/* Toplam Puan Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-indigo-950/80 border border-brand-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-brand-400" />
            <div>
              <p className="text-xs font-semibold text-slate-300">Komisyon Genel Başarı Puanı</p>
              <p className="text-xs text-slate-400">100 Tam Puan Üzerinden Nihai Aritmetik Ortalama</p>
            </div>
          </div>
          <span className="text-3xl font-black text-white">{report.overallScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
        </div>

        {/* Güçlü Yanlar & Geliştirilmesi Gerekenler */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Öne Çıkan Güçlü Yönler
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {report.keyStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Geliştirilmesi Gereken Alanlar
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {report.areasToDevelop.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Komisyon Kanaat Notu */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs">
          <p className="font-semibold text-slate-400 mb-1">Mülakat Heyeti Kanaat Şerhi:</p>
          <p className="italic text-slate-200 leading-relaxed">
            "{report.commissionNotes}"
          </p>
        </div>

        {/* Alt Eylemler */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Simülasyon Başlat</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Sohbete Dön / İncele
          </button>
        </div>

      </div>
    </div>
  );
};
