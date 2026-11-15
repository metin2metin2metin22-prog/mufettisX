import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { 
  Settings, 
  X, 
  Sparkles, 
  Key, 
  Bot, 
  Check, 
  AlertCircle,
  ExternalLink
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
  const geminiService = GeminiService.getInstance();
  const [apiKey, setApiKey] = useState<string>(geminiService.getApiKey() || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    geminiService.setApiKey(apiKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Başlık */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sistem & Motor Ayarları</h2>
              <p className="text-xs text-slate-400">Yapay zeka motoru ve Gemini API entegrasyonu</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Motor Seçimi (Mock vs Gemini) */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Mülakat Motoru Seçimi:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  Oto-Cevap (Mock)
                </span>
                {isMockMode && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Şimdilik API bağlamadan, önceden hazırlanmış akıllı komisyon cevaplarıyla hızlı ve kotasız çalışır.
              </p>
            </div>

            {/* Gemini API Modu */}
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
                  Gemini AI Canlı
                </span>
                {!isMockMode && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Google Gemini API kullanarak seçtiğiniz kanunları sistem promptuna gömer ve gerçek zamanlı üretir.
              </p>
            </div>
          </div>
        </div>

        {/* Gemini API Anahtarı Tanımlama */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-brand-400" />
              <span>Gemini API Key (İsteğe Bağlı):</span>
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Anahtar Al</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kaydedildi</span>
                </>
              ) : (
                <span>Kaydet</span>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            * API anahtarınız sadece tarayıcınızın yerel depolama alanında saklanır, harici sunucuya iletilmez.
          </p>
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
