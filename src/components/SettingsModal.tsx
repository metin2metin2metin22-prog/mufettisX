import React from 'react';
import { 
  Settings, 
  X, 
  Sparkles, 
  Bot, 
  Check, 
  CheckCircle2, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMockMode: boolean;
  onMockModeChange: (isMock: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMockMode,
  onMockModeChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Başlık */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Yapay Zeka Motor Durumu</h2>
              <p className="text-xs text-slate-400">Google Gemini Entegrasyonu</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aktif Model Durum Rozeti */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-300">Google Gemini AI Bağlandı</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              API anahtarınız sisteme entegre edildi. Tüm mülakat oturumları gerçek zamanlı yapay zeka ile yürütülür.
            </p>
          </div>
        </div>

        {/* Motor Seçimi (Gemini vs Mock) */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Çalışma Modu:
          </label>

          <div className="space-y-2.5">
            {/* Gemini AI Modu (Varsayılan) */}
            <div
              onClick={() => onMockModeChange(false)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                !isMockMode
                  ? 'bg-emerald-950/30 border-emerald-500/80 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  Gemini Flash AI (Önerilen)
                </span>
                {!isMockMode && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Mevzuat maddelerini okuyarak cevaplarınıza göre anlık komisyon diyalogları ve zorlayıcı sorular üretir.
              </p>
            </div>

            {/* Mock Modu */}
            <div
              onClick={() => onMockModeChange(true)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isMockMode
                  ? 'bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Bot className="w-4 h-4" />
                  Çevrimdışı / Oto-Cevap Modu
                </span>
                {isMockMode && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                İnternet veya kota kullanımı olmadan yerleşik komisyon senaryosuyla çalışır.
              </p>
            </div>
          </div>
        </div>

        {/* Kapat Butonu */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
