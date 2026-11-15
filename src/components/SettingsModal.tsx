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
  ExternalLink,
  Loader2,
  CheckCircle2,
  HelpCircle
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
  
  // Test Bağlantısı State
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    geminiService.setApiKey(apiKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await geminiService.testConnection(apiKey);
      setTestResult(result);
      if (result.success) {
        // Otomatik kaydet ve AI moduna geçir
        geminiService.setApiKey(apiKey);
        onMockModeChange(false);
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e?.message || 'Bilinmeyen bir hata oluştu.' });
    } finally {
      setIsTesting(false);
    }
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
              <h2 className="text-base font-bold text-white">Yapay Zeka & Motor Ayarları</h2>
              <p className="text-xs text-slate-400">Ücretsiz Google Gemini API entegrasyonu</p>
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
                API anahtarsız, yerleşik akıllı komisyon cevaplarıyla hızlı ve kotasız çalışır.
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
                  Gemini Flash AI Canlı
                </span>
                {!isMockMode && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Google'ın ücretsiz <strong>Gemini 1.5 Flash</strong> modelini kullanarak gerçek zamanlı sorular üretir.
              </p>
            </div>
          </div>
        </div>

        {/* Gemini API Anahtarı Tanımlama */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-brand-400" />
              <span>Gemini API Key:</span>
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Ücretsiz Anahtar Al (Google AI Studio)</span>
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
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1 border border-slate-700"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Kaydet'}
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Test Ediliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Et</span>
                </>
              )}
            </button>
          </div>

          {/* Test Sonucu Bildirimi */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in duration-200 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Adım Adım Rehber Kutusu */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
              <span>Ücretsiz Gemini API Nasıl Alınır? (30 Saniye)</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Google AI Studio</strong> sitesine Google hesabınızla giriş yapın.</li>
              <li>Mavi <strong className="text-emerald-400">"Create API Key"</strong> butonuna tıklayın.</li>
              <li>Oluşan <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">AIzaSy...</code> kodunu buraya yapıştırıp <strong className="text-brand-400">"Test Et"</strong> butonuna basın.</li>
            </ol>
            <p className="text-[10px] text-slate-500 pt-1">
              * Google Gemini 1.5 Flash modeli ücretsiz katmanda dakikada 15, günde 1.500 istek hakkı tanır; kredi kartı gerekmez.
            </p>
          </div>
        </div>

        {/* Kapat Butonu */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Tamamla ve Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
