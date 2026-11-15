import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  PlusCircle, 
  Settings, 
  RotateCcw,
  Sparkles,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentView: 'setup' | 'simulation';
  isMockMode: boolean;
  onOpenLawLibrary: () => void;
  onOpenResourceUploader: () => void;
  onOpenSettings: () => void;
  onResetInterview: () => void;
  interviewTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isMockMode,
  onOpenLawLibrary,
  onOpenResourceUploader,
  onOpenSettings,
  onResetInterview,
  interviewTitle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Sol: Logo & Marka */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onResetInterview}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                Müfettiş<span className="text-brand-400">X</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Yapay Zeka Destekli Kariyer & Mülakat Simülasyonu
            </p>
          </div>
        </div>

        {/* Orta: Aktif Mülakat Bilgisi (Simülasyondaysa) */}
        {currentView === 'simulation' && interviewTitle && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">Mülakat Oturumu:</span>
            <span className="truncate max-w-[200px] text-brand-300">{interviewTitle}</span>
          </div>
        )}

        {/* Sağ: Eylemler & Ayarlar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Motor Modu Rozeti */}
          <button 
            onClick={onOpenSettings}
            className={`hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              isMockMode 
                ? 'bg-amber-950/40 border-amber-600/30 text-amber-300 hover:bg-amber-900/40' 
                : 'bg-emerald-950/40 border-emerald-600/30 text-emerald-300 hover:bg-emerald-900/40'
            }`}
            title="Motor modunu değiştirmek için tıklayın"
          >
            {isMockMode ? (
              <>
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Oto-Cevap (Örnek Mod)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemini AI Aktif</span>
              </>
            )}
          </button>

          {/* Kanun Kütüphanesi Butonu */}
          <button
            onClick={onOpenLawLibrary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all"
            title="Kanunlar ve Mevzuat Kütüphanesi"
          >
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Kanunlar</span>
          </button>

          {/* Kaynak Ekle Butonu */}
          <button
            onClick={onOpenResourceUploader}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-300 bg-brand-950/50 hover:bg-brand-900/60 border border-brand-800/60 transition-all"
            title="Yeni Kanun veya Harici Kaynak Yükle"
          >
            <PlusCircle className="w-4 h-4 text-brand-400" />
            <span className="hidden md:inline">Kaynak Ekle</span>
          </button>

          {/* Mülakatı Sıfırla (Simülasyondaysa) */}
          {currentView === 'simulation' && (
            <button
              onClick={onResetInterview}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Yeni Mülakata Dön"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Ayarlar Modal Butonu */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Ayarlar & Gemini API"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
