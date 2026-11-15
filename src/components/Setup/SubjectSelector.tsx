import React from 'react';
import { SubjectField } from '../../types';
import { 
  Layers, 
  Receipt, 
  Scale, 
  TrendingUp, 
  BarChart3, 
  Building2, 
  ShieldAlert,
  Check
} from 'lucide-react';

interface SubjectSelectorProps {
  subjects: SubjectField[];
  selectedSubjectIds: string[];
  onToggleSubject: (subjectId: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubjectIds,
  onToggleSubject
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt': return <Receipt className="w-5 h-5 text-amber-400" />;
      case 'Scale': return <Scale className="w-5 h-5 text-blue-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-purple-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default: return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" />
          2. Soru Sorulacak Alanları Belirleyin
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Mülakat heyetinin yoğunlaşmasını istediğiniz konuları işaretleyin. Seçili alanlardan komisyon üyeleri uzman sorular yöneltecektir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {subjects.map(subj => {
          const isSelected = selectedSubjectIds.includes(subj.id);

          return (
            <div
              key={subj.id}
              onClick={() => onToggleSubject(subj.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-brand-950/40 border-brand-500/80 ring-1 ring-brand-500/30 shadow-md shadow-brand-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {getIcon(subj.iconName)}
                </div>

                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  isSelected 
                    ? 'bg-brand-600 border-brand-500 text-white' 
                    : 'border-slate-700 bg-slate-800/50'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                  {subj.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {subj.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {subj.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Seçilen Alan Sayısı: <strong className="text-brand-300 font-semibold">{selectedSubjectIds.length}</strong></span>
        <span className="italic">Öneri: Dengeli bir mülakat için en az 2 alan seçilmesi tavsiye edilir.</span>
      </div>
    </div>
  );
};
