import React, { useState } from 'react';
import { 
  InterviewTemplate, 
  SubjectField, 
  LawResource, 
  InterviewConfig, 
  CommitteeTone 
} from '../../types';
import { ExamSelector } from './ExamSelector';
import { SubjectSelector } from './SubjectSelector';
import { LawSelector } from './LawSelector';
import { 
  Building2, 
  Layers, 
  Scale, 
  Sliders, 
  Play, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface InterviewSetupWizardProps {
  templates: InterviewTemplate[];
  subjects: SubjectField[];
  laws: LawResource[];
  onStartInterview: (config: InterviewConfig) => void;
  onOpenResourceUploader: () => void;
}

export const InterviewSetupWizard: React.FC<InterviewSetupWizardProps> = ({
  templates,
  subjects,
  laws,
  onStartInterview,
  onOpenResourceUploader
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const defaultTemplate = templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplate.id);
  const [institution, setInstitution] = useState<string>(defaultTemplate.institution);
  const [position, setPosition] = useState<string>(defaultTemplate.title);
  const [candidateName, setCandidateName] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<string>('');
  
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(defaultTemplate.defaultSubjects);
  const [selectedLawIds, setSelectedLawIds] = useState<string[]>(defaultTemplate.suggestedLaws);
  
  const [committeeTone, setCommitteeTone] = useState<CommitteeTone>('standard');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const handleSelectTemplate = (template: InterviewTemplate) => {
    setSelectedTemplateId(template.id);
    if (template.id !== 'temp-custom') {
      setInstitution(template.institution);
      setPosition(template.title);
      setSelectedSubjectIds(template.defaultSubjects);
      setSelectedLawIds(template.suggestedLaws);
    } else {
      setInstitution('');
      setPosition('');
    }
  };

  const handleCustomDetailsChange = (field: string, value: string) => {
    if (field === 'institution') setInstitution(value);
    if (field === 'position') setPosition(value);
    if (field === 'candidateName') setCandidateName(value);
    if (field === 'jobPosting') setJobPosting(value);
  };

  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleToggleLaw = (lawId: string) => {
    setSelectedLawIds(prev => 
      prev.includes(lawId)
        ? prev.filter(id => id !== lawId)
        : [...prev, lawId]
    );
  };

  const handleStart = () => {
    const config: InterviewConfig = {
      interviewTypeId: selectedTemplateId,
      customTitle: position,
      targetInstitution: institution || 'Hazine ve Maliye Bakanlığı',
      positionTitle: position || 'Vergi Müfettiş Yardımcılığı',
      candidateName: candidateName.trim() || 'Aday',
      jobPostingDetails: jobPosting.trim(),
      selectedSubjects: selectedSubjectIds.length > 0 ? selectedSubjectIds : ['subj-maliye', 'subj-hukuk'],
      selectedLaws: selectedLawIds.length > 0 ? selectedLawIds : ['law-vuk-213', 'law-anayasa-1982'],
      committeeTone,
      questionCount
    };

    onStartInterview(config);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cumhuriyetin En Prestijli Kariyer Sınavlarına Birebir Hazırlık</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mülakat Simülasyon <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Kurulum Paneli</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Gireceğiniz mülakatı seçin, kanun ve alan dağılımını belirleyin. Yüksek Mülakat Komisyonu yapay zeka heyeti karşısında sözlü sınav deneyimini başlatın.
        </p>
      </div>

      {/* Adım Sekmeleri */}
      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveStep(1)}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeStep === 1
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Mülakat & Kurum</span>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeStep === 2
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Alan & Konular ({selectedSubjectIds.length})</span>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeStep === 3
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>3. Kanun Kütüphanesi ({selectedLawIds.length})</span>
        </button>

        <button
          onClick={() => setActiveStep(4)}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeStep === 4
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>4. Komisyon Ayarları</span>
        </button>
      </div>

      {/* Adım İçerikleri */}
      <div className="bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-sm shadow-xl">
        {activeStep === 1 && (
          <ExamSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
            customDetails={{
              institution,
              position,
              candidateName,
              jobPosting
            }}
            onCustomDetailsChange={handleCustomDetailsChange}
          />
        )}

        {activeStep === 2 && (
          <SubjectSelector
            subjects={subjects}
            selectedSubjectIds={selectedSubjectIds}
            onToggleSubject={handleToggleSubject}
          />
        )}

        {activeStep === 3 && (
          <LawSelector
            laws={laws}
            selectedLawIds={selectedLawIds}
            onToggleLaw={handleToggleLaw}
            onOpenResourceUploader={onOpenResourceUploader}
          />
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-400" />
                4. Komisyon Tavrı ve Oturum Parametreleri
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Komisyon heyetinin size karşı olan üslubunu ve soru derinliğini belirleyin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div
                onClick={() => setCommitteeTone('supportive')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  committeeTone === 'supportive'
                    ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-400">Destekleyici Komisyon</span>
                  {committeeTone === 'supportive' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Heyet adayın heyecanını yatıştırır, ipuçları verir, rahatlatıcı ve yapıcı bir tonda ilerler.
                </p>
              </div>

              <div
                onClick={() => setCommitteeTone('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  committeeTone === 'standard'
                    ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-400">Standart Heyet (Önerilen)</span>
                  {committeeTone === 'standard' && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Gerçek teftiş kurulu mülakatı havası; resmi, mesafeli, objektif ve kanun maddelerine odaklı.
                </p>
              </div>

              <div
                onClick={() => setCommitteeTone('strict')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  committeeTone === 'strict'
                    ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-rose-400">Stres Mülakatı (Zorlayıcı)</span>
                  {committeeTone === 'strict' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Çelişkilerin üzerine giden, zaman baskısı kuran, soğukkanlılığınızı ve mesleki direncinizi sınayan sert üslup.
                </p>
              </div>
            </div>

            {/* Özet Kartı */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Mülakat Özeti:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400">
                <div><span className="text-slate-500">Kurum:</span> <p className="font-medium text-white truncate">{institution || '-'}</p></div>
                <div><span className="text-slate-500">Unvan:</span> <p className="font-medium text-white truncate">{position || '-'}</p></div>
                <div><span className="text-slate-500">Alanlar:</span> <p className="font-medium text-white">{selectedSubjectIds.length} Alan</p></div>
                <div><span className="text-slate-500">Kanunlar:</span> <p className="font-medium text-white">{selectedLawIds.length} Kanun</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Adım Gezinme ve Başlat Butonları */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-800">
          {activeStep > 1 ? (
            <button
              onClick={() => setActiveStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← Önceki Adım
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Sonraki Adım →
              </button>
            ) : null}

            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mülakatı Başlat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
