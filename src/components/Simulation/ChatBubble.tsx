import React from 'react';
import { ChatMessage } from '../../types';
import { 
  Shield, 
  User, 
  Scale, 
  Lightbulb, 
  Award,
  CheckCircle2
} from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isCommission = message.role === 'commission';

  return (
    <div className={`flex flex-col ${isCommission ? 'items-start' : 'items-end'} mb-6 group`}>
      <div className={`flex items-start gap-3 max-w-3xl ${isCommission ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
          isCommission 
            ? 'bg-gradient-to-tr from-slate-800 to-slate-700 border-slate-600 text-brand-400 shadow-md' 
            : 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/20'
        }`}>
          {isCommission ? (
            <Shield className="w-5 h-5 text-brand-400" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Mesaj Gövdesi */}
        <div className="flex flex-col">
          {/* Konuşmacı Başlığı & Zaman */}
          <div className={`flex items-center gap-2 mb-1.5 px-1 ${isCommission ? 'justify-start' : 'justify-end'}`}>
            <span className="text-xs font-bold text-slate-300">
              {isCommission ? (message.speakerTitle || 'Mülakat Komisyonu') : 'Aday (Siz)'}
            </span>
            <span className="text-[10px] text-slate-500">
              {message.timestamp}
            </span>
          </div>

          {/* Konuşma Balonu */}
          <div className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isCommission
              ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
              : 'bg-gradient-to-r from-brand-700 to-indigo-700 text-white rounded-tr-sm shadow-lg shadow-brand-900/30 font-normal'
          }`}>
            {message.content}
          </div>

          {/* İlgili Kanun Kartı (Varsa) */}
          {message.referencedLaw && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-brand-500/30 text-xs shadow-sm">
              <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
                <Scale className="w-3.5 h-3.5 text-brand-400" />
                <span>İlgili Kanun Maddesi: {message.referencedLaw.lawCode} - {message.referencedLaw.articleNumber}</span>
              </div>
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "{message.referencedLaw.snippet}"
              </p>
            </div>
          )}

          {/* Değerlendirme & İpucu Kutusu (Varsa) */}
          {message.feedback && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mevzuat Uyumu: %{message.feedback.accuracyScore}
                </span>
                <span className="text-[10px] text-slate-500">
                  İfade & Vakar: %{message.feedback.toneScore}
                </span>
              </div>
              {message.feedback.tip && (
                <div className="flex items-start gap-1.5 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Komisyon İpucu: {message.feedback.tip}</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
