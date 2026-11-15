import React from 'react';
import { ChatMessage } from '../../types';
import { 
  User, 
  Scale, 
  Lightbulb, 
  CheckCircle2
} from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

const COMMITTEE_AVATARS = [
  '/avatars/avatar-1.png',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  '/avatars/avatar-5.svg',
];

// Temiz Markdown / Metin Biçimlendirici (Yıldız ** temizlenir ve kalın yapılır)
const renderFormattedContent = (content: string) => {
  // Gereksiz "Komisyon Başkanı:" vb. başlıkları temizle (eğer AI metne eklediyse)
  let cleanContent = content.replace(/^(\*\*.*?(başkan|komisyon|üye|heyet).*?\*\*[:\-]?\s*)/i, '');

  const lines = cleanContent.split('\n');

  return lines.map((line, idx) => {
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    let isHeader = false;
    let cleanLine = line;

    if (line.startsWith('### ')) {
      isHeader = true;
      cleanLine = line.replace('### ', '');
    } else if (line.startsWith('## ')) {
      isHeader = true;
      cleanLine = line.replace('## ', '');
    }

    const isBullet = /^\s*([•\-\*]|\d+\.)\s+/.test(cleanLine);
    if (isBullet) {
      cleanLine = cleanLine.replace(/^\s*([•\-\*]|\d+\.)\s+/, '');
    }

    // Kalın (**metin**) ve İtalik (*metin*)
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let match;
    let lastIndex = 0;
    let matchIdx = 0;

    while ((match = regex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={matchIdx++} className="font-bold text-white tracking-wide">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={matchIdx++} className="italic text-slate-300">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={matchIdx++} className="px-1 py-0.5 rounded bg-slate-800 text-brand-300 font-mono text-[11px]">
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }

    if (isHeader) {
      return (
        <h4 key={idx} className="text-sm font-bold text-brand-300 mt-2 mb-1">
          {parts}
        </h4>
      );
    }

    if (isBullet) {
      return (
        <div key={idx} className="flex items-start gap-2 my-1 pl-2 text-slate-200">
          <span className="text-brand-400 font-bold shrink-0 mt-0.5">•</span>
          <span className="flex-1 leading-relaxed">{parts}</span>
        </div>
      );
    }

    return (
      <p key={idx} className="my-1 leading-relaxed text-slate-200">
        {parts}
      </p>
    );
  });
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isCommission = message.role === 'commission';
  const speakerIdx = typeof message.speakerIndex === 'number' ? message.speakerIndex % 5 : 0;
  const avatarSrc = COMMITTEE_AVATARS[speakerIdx] || COMMITTEE_AVATARS[0];

  return (
    <div className={`flex flex-col ${isCommission ? 'items-start' : 'items-end'} mb-6 group w-full`}>
      <div className={`flex items-start gap-3.5 max-w-3xl w-full ${isCommission ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Yuvarlak Silüet Avatarı (İsim / Ünvan YOK) */}
        {isCommission ? (
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-700 bg-white shadow-md relative">
            <img
              src={avatarSrc}
              alt="Heyet Üyesi"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `/avatars/avatar-${speakerIdx + 1}.svg`;
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-brand-400 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-900/30">
            <User className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Mesaj Gövdesi */}
        <div className="flex flex-col flex-1 max-w-2xl">
          
          {/* Zaman Damgası */}
          <div className={`flex items-center gap-2 mb-1 px-1 ${isCommission ? 'justify-start' : 'justify-end'}`}>
            <span className="text-[10px] text-slate-500 font-mono">
              {message.timestamp}
            </span>
          </div>

          {/* Konuşma Balonu (Ünvan/İsim Yazmaz, Doğrudan Baloncuk) */}
          <div className={`p-4 sm:p-5 rounded-3xl text-sm shadow-xl leading-relaxed relative ${
            isCommission
              ? 'bg-slate-900/95 border border-slate-700/80 text-slate-200 rounded-tl-sm backdrop-blur-md shadow-black/40 ring-1 ring-slate-800'
              : 'bg-gradient-to-r from-brand-700 to-indigo-700 text-white rounded-tr-sm shadow-brand-900/40 font-medium'
          }`}>
            <div className="space-y-1">
              {renderFormattedContent(message.content)}
            </div>
          </div>

          {/* İlgili Kanun Kartı (Varsa) */}
          {message.referencedLaw && (
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-950/90 border border-brand-500/30 text-xs shadow-md">
              <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
                <Scale className="w-3.5 h-3.5 text-brand-400" />
                <span>İlgili Kanun Hükmü: {message.referencedLaw.lawCode} - {message.referencedLaw.articleNumber}</span>
              </div>
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "{message.referencedLaw.snippet}"
              </p>
            </div>
          )}

          {/* Değerlendirme & İpucu Kutusu (Varsa) */}
          {message.feedback && (
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mevzuat & İfade Uyumu: %{message.feedback.accuracyScore}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Mesleki Vakar: %{message.feedback.toneScore}
                </span>
              </div>
              {message.feedback.tip && (
                <div className="flex items-start gap-1.5 text-slate-400 text-[11px] pt-1.5 border-t border-slate-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Komisyon Notu: {message.feedback.tip}</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
