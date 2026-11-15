import React from 'react';
import { InterviewTemplate } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Search
} from 'lucide-react';

interface ExamSelectorProps {
  templates: InterviewTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (template: InterviewTemplate) => void;
  customDetails: {
    institution: string;
    position: string;
    candidateName: string;
    jobPosting: string;
  };
  onCustomDetailsChange: (field: string, value: string) => void;
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  customDetails,
  onCustomDetailsChange
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('Hepsi');

  const categories = ['Hepsi', 'Denetim & Teftiş', 'Yargı & Hukuk', 'Finans & Banka', 'Mülki İdare'];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Hepsi' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isCustomMode = selectedTemplateId === 'temp-custom';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-400" />
          1. Gireceğiniz Mülakatı ve Kurumu Seçin
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Simülasyona başlamak için hazır kariyer sınavlarından birini seçin veya kendi özel mülakat bilgilerinizi girin.
        </p>
      </div>

      {/* Arama ve Kategori Filtresi */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mülakat ara... (Örn: Vergi Müfettişliği, Sayıştay, Hakimlik)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mülakat Kartları Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTemplates.map(template => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                isSelected
                  ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {template.category}
                    </span>
                    {template.popular && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
                        <Sparkles className="w-3 h-3" />
                        Popüler
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {template.title}
                  </h3>
                  <p className="text-xs text-brand-400/90 font-medium">
                    {template.institution}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  isSelected ? 'text-brand-400' : 'text-slate-600'
                }`}>
                  <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'fill-brand-500/20' : ''}`} />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {template.description}
              </p>

              {template.sampleQuestions && template.sampleQuestions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-500 italic truncate">
                    Örnek Soru: "{template.sampleQuestions[0]}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aday ve İlan Detayları Formu */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>İlan ve Aday Bilgileri</span>
          {isCustomMode && (
            <span className="text-xs font-normal text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">
              Özel Mülakat Modu
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Adınız & Soyadınız
            </label>
            <input
              type="text"
              placeholder="Örn: Ahmet Yılmaz"
              value={customDetails.candidateName}
              onChange={(e) => onCustomDetailsChange('candidateName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Hedef Kurum
            </label>
            <input
              type="text"
              placeholder="Örn: Vergi Denetim Kurulu"
              value={customDetails.institution}
              onChange={(e) => onCustomDetailsChange('institution', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Kadro / Unvan
            </label>
            <input
              type="text"
              placeholder="Örn: Vergi Müfettiş Yardımcısı"
              value={customDetails.position}
              onChange={(e) => onCustomDetailsChange('position', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            İlan Metni / Sınav Notları (İsteğe Bağlı)
          </label>
          <textarea
            rows={2}
            placeholder="İlandaki özel şartlar, sınav konuları veya komisyona sunmak istediğiniz ek bilgileri yapıştırabilirsiniz..."
            value={customDetails.jobPosting}
            onChange={(e) => onCustomDetailsChange('jobPosting', e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500 placeholder:text-slate-600 resize-none"
          />
        </div>
      </div>
    </div>
  );
};
