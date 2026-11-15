import React from 'react';
import { InterviewConfig, InterviewStage } from '../../types';
import { 
  Users, 
  Timer, 
  Scale, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface CommissionHeaderProps {
  config: InterviewConfig;
  currentStage: InterviewStage;
  elapsedSeconds: number;
  onOpenLawDrawer: () => void;
  onOpenNotepad: () => void;
  onEndInterviewEarly: () => void;
}

export const CommissionHeader: React.FC<CommissionHeaderProps> = ({
  config,
  currentStage,
  elapsedSeconds,
  onOpenLawDrawer,
  onOpenNotepad,
  onEndInterviewEarly
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStageTitle = (stage: InterviewStage) => {
    switch (stage) {
      case 'welcome': return '1. Karşılama ve Heyet Tanıtımı';
      case 'introduction': return '2. Aday Özgeçmişi & Motivasyon';
      case 'legal_theory': return '3. Kanun & Mevzuat Teorisi';
      case 'followup_deep': return '4. Derinleştirici Teknik Soru';
      case 'case_study': return '5. Denetim Vakası (Case Study)';
      case 'ethics_stress': return '6. Etik & Kriz Yönetimi';
      case 'evaluation': return '7. Komisyon Kanaati';
      default: return 'Mülakat Oturumu';
    }
  };

  const getStageProgress = (stage: InterviewStage) => {
    switch (stage) {
      case 'welcome': return 15;
      case 'introduction': return 30;
      case 'legal_theory': return 50;
      case 'followup_deep': return 65;
      case 'case_study': return 80;
      case 'ethics_stress': return 95;
      case 'evaluation':
      case 'completed': return 100;
      default: return 20;
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Sol: Komisyon & Sınav Bilgisi */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-brand-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {config.targetInstitution}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {config.committeeTone === 'strict' ? 'Stres Mülakatı' : config.committeeTone === 'supportive' ? 'Destekleyici' : 'Standart Heyet'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {config.positionTitle} Sözlü Sınav Heyeti ({config.candidateName})
            </p>
          </div>
        </div>

        {/* Orta: Aşama ve İlerleme Çubuğu */}
        <div className="w-full md:w-72 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{getStageTitle(currentStage)}</span>
            <span className="text-brand-400 font-bold">%{getStageProgress(currentStage)}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${getStageProgress(currentStage)}%` }}
            />
          </div>
        </div>

        {/* Sağ: Sayaç ve Hızlı Araçlar */}
        <div className="flex items-center gap-2.5">
          {/* Süre Sayacı */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Kanun Çekmecesi Butonu */}
          <button
            onClick={onOpenLawDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Mülakattaki Kanunları Gör"
          >
            <Scale className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Kanunlar</span>
          </button>

          {/* Not Defteri */}
          <button
            onClick={onOpenNotepad}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Kişisel Not Al"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Not Defteri</span>
          </button>

          {/* Mülakatı Bitir */}
          <button
            onClick={onEndInterviewEarly}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 transition-colors"
            title="Mülakatı Sonlandır ve Karne Al"
          >
            Bitir
          </button>
        </div>

      </div>
    </div>
  );
};
