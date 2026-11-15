import React from 'react';
import { LawResource } from '../../types';
import { 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  PlusCircle, 
  Scale,
  Sparkles
} from 'lucide-react';

interface LawSelectorProps {
  laws: LawResource[];
  selectedLawIds: string[];
  onToggleLaw: (lawId: string) => void;
  onOpenResourceUploader: () => void;
}

export const LawSelector: React.FC<LawSelectorProps> = ({
  laws,
  selectedLawIds,
  onToggleLaw,
  onOpenResourceUploader
}) => {
  const [expandedLawId, setExpandedLawId] = React.useState<string | null>(null);

  const toggleExpand = (e: React.MouseEvent, lawId: string) => {
    e.stopPropagation();
    setExpandedLawId(prev => prev === lawId ? null : lawId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-400" />
            3. Mülakatta Kullanılacak Kanun & Mevzuatı Seçin
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Yapay zeka komisyonu seçtiğiniz kanun maddelerinden doğrudan soru yöneltecektir.
          </p>
        </div>

        <button
          onClick={onOpenResourceUploader}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition-all shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Kanun / Kaynak Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {laws.map(law => {
          const isSelected = selectedLawIds.includes(law.id);
          const isExpanded = expandedLawId === law.id;

          return (
            <div
              key={law.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-brand-500/70 shadow-lg shadow-brand-950/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                onClick={() => onToggleLaw(law.id)}
                className="p-4 cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                      {law.code}
                    </span>
                    {law.isCustom && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                        <Sparkles className="w-2.5 h-2.5" />
                        Kullanıcı Ekledi
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">
                    {law.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {law.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected 
                      ? 'bg-brand-600 border-brand-500 text-white' 
                      : 'border-slate-700 bg-slate-800/50'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {law.articles && law.articles.length > 0 && (
                    <button
                      onClick={(e) => toggleExpand(e, law.id)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                      title={isExpanded ? 'Maddeleri Gizle' : 'Maddeleri Gör'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Madde Ayrıntıları Akordeon */}
              {isExpanded && law.articles && law.articles.length > 0 && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">
                    Önemli Maddeler ({law.articles.length}):
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {law.articles.map(art => (
                      <div key={art.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between font-semibold text-brand-300">
                          <span>{art.articleNumber}: {art.title}</span>
                        </div>
                        <p className="text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {art.text}
                        </p>
                        {art.relevance && (
                          <p className="text-[10px] text-amber-300/80 mt-1 italic">
                            💡 Mülakat Önemi: {art.relevance}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Seçilen Kanun Sayısı: <strong className="text-brand-300 font-semibold">{selectedLawIds.length}</strong></span>
        <span>Yapay zeka komisyonu bu kanunların lafzını ve ruhunu mülakata aktaracaktır.</span>
      </div>
    </div>
  );
};
