import React, { useState } from 'react';
import { 
  InterviewTemplate, 
  SubjectField, 
  LawResource, 
  InterviewConfig, 
  CommitteeTone 
} from '../../types';
import { 
  Building2, 
  Scale, 
  Layers, 
  Play, 
  Sparkles, 
  PlusCircle, 
  ChevronRight, 
  Check, 
  X, 
  FileText, 
  SlidersHorizontal,
  Search,
  BookOpen,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SimpleHomeProps {
  templates: InterviewTemplate[];
  subjects: SubjectField[];
  laws: LawResource[];
  onStartInterview: (config: InterviewConfig) => void;
  onOpenResourceUploader: () => void;
  onOpenLawLibrary: () => void;
}

export const SimpleHome: React.FC<SimpleHomeProps> = ({
  templates,
  subjects,
  laws,
  onStartInterview,
  onOpenResourceUploader,
  onOpenLawLibrary
}) => {
  // Seçili Mülakat (Varsayılan: Vergi Müfettişliği)
  const [selectedTemplate, setSelectedTemplate] = useState<InterviewTemplate>(templates[0]);
  const [candidateName, setCandidateName] = useState<string>('');
  const [customInstitution, setCustomInstitution] = useState<string>('');
  const [customPosition, setCustomPosition] = useState<string>('');
  const [jobPosting, setJobPosting] = useState<string>('');
  
  // Seçili Alanlar ve Kanunlar (Mülakat değişince otomatik güncellenir)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(templates[0].defaultSubjects);
  const [selectedLawIds, setSelectedLawIds] = useState<string[]>(templates[0].suggestedLaws);
  const [committeeTone, setCommitteeTone] = useState<CommitteeTone>('standard');

  // Modallar
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showSubjectModal, setShowSubjectModal] = useState<boolean>(false);
  const [showLawModal, setShowLawModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  // Mülakat Arama State
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mülakat Seçimi Yapıldığında
  const handleSelectExam = (tpl: InterviewTemplate) => {
    setSelectedTemplate(tpl);
    if (tpl.id !== 'temp-custom') {
      setSelectedSubjectIds(tpl.defaultSubjects);
      setSelectedLawIds(tpl.suggestedLaws);
    }
    setShowExamModal(false);
  };

  const handleToggleSubject = (id: string) => {
    setSelectedSubjectIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleLaw = (id: string) => {
    setSelectedLawIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    const isCustom = selectedTemplate.id === 'temp-custom';
    const config: InterviewConfig = {
      interviewTypeId: selectedTemplate.id,
      customTitle: isCustom ? customPosition : selectedTemplate.title,
      targetInstitution: isCustom ? (customInstitution || 'Hedef Kurum') : selectedTemplate.institution,
      positionTitle: isCustom ? (customPosition || 'Müfettiş Yardımcılığı') : selectedTemplate.title,
      candidateName: candidateName.trim() || 'Aday',
      jobPostingDetails: jobPosting.trim(),
      selectedSubjects: selectedSubjectIds.length > 0 ? selectedSubjectIds : ['subj-maliye', 'subj-hukuk'],
      selectedLaws: selectedLawIds.length > 0 ? selectedLawIds : ['law-vuk-213', 'law-anayasa-1982'],
      committeeTone,
      questionCount: 5
    };

    onStartInterview(config);
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      
      {/* Basit & Prestijli Başlık */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Yapay Zeka Destekli Kariyer Sınavı Odası</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Müfettiş<span className="text-brand-400">X</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Gireceğiniz mülakatı seçin, mevzuatınızı belirleyin ve yapay zeka komisyonunun karşısına hemen geçin.
        </p>
      </div>

      {/* Ana Butonlu Kontrol Kartı */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4">
        
        {/* BUTON 1: Mülakatı Seç */}
        <div 
          onClick={() => setShowExamModal(true)}
          className="group p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/60 cursor-pointer transition-all hover:shadow-lg hover:shadow-brand-950/40 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-950 border border-brand-800/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                1. Adım: Gireceğiniz Mülakat
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-brand-300 transition-colors">
                {selectedTemplate.id === 'temp-custom' && customPosition 
                  ? customPosition 
                  : selectedTemplate.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md">
                {selectedTemplate.id === 'temp-custom' && customInstitution 
                  ? customInstitution 
                  : selectedTemplate.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
            <span className="text-xs font-semibold hidden sm:inline">Değiştir</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 2'li Izgara Butonları: Alanlar & Kanunlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* BUTON 2: Alanlar */}
          <div 
            onClick={() => setShowSubjectModal(true)}
            className="group p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">2. Adım: Soru Alanları</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {selectedSubjectIds.length} Konu Seçili
                </p>
                <p className="text-[11px] text-slate-400">Maliye, Hukuk, Vaka vb.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          </div>

          {/* BUTON 3: Kanunlar & Mevzuat */}
          <div 
            onClick={() => setShowLawModal(true)}
            className="group p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">3. Adım: Mevzuat & Kanunlar</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {selectedLawIds.length} Kanun Seçili
                </p>
                <p className="text-[11px] text-slate-400">VUK, Anayasa, 5018, 657...</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          </div>

        </div>

        {/* İsteğe Bağlı: Aday Adı & İlan Bilgileri Satırı */}
        <div 
          onClick={() => setShowDetailsModal(true)}
          className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2.5 text-slate-400">
            <FileText className="w-4 h-4 text-brand-400" />
            <span>
              Aday: <strong className="text-slate-200">{candidateName || 'Belirtilmedi (Varsayılan: Aday)'}</strong>
              {jobPosting ? ' • İlan Metni Girildi' : ''}
            </span>
          </div>
          <span className="text-brand-400 font-semibold hover:underline">Düzenle / İlan Ekle</span>
        </div>

        {/* BÜYÜK BAŞLAT BUTONU */}
        <div className="pt-4">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-brand-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Mülakat Simülasyonunu Başlat</span>
          </button>
        </div>

      </div>

      {/* Alt Hızlı Bağlantılar */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-400">
        <button
          onClick={onOpenLawLibrary}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-brand-400" />
          <span>Tüm Kanunları İncele</span>
        </button>
        <span>•</span>
        <button
          onClick={onOpenResourceUploader}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Yeni Tebliğ / Kanun Yükle</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. MODAL: MÜLAKAT SEÇİMİ MODALI                          */}
      {/* ======================================================== */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-brand-400" />
                <h3 className="text-lg font-bold text-white">Gireceğiniz Mülakatı Seçin</h3>
              </div>
              <button onClick={() => setShowExamModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Arama Çubuğu */}
            <div className="py-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mülakat veya kurum adı ara... (Örn: Vergi, Sayıştay, Banka)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Mülakat Listesi */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1">
              {filteredTemplates.map(tpl => {
                const isSelected = selectedTemplate.id === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectExam(tpl)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-950/60 border-brand-500 ring-1 ring-brand-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {tpl.category}
                        </span>
                        {tpl.popular && (
                          <span className="text-[10px] font-medium text-amber-400">★ Popüler</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{tpl.title}</h4>
                      <p className="text-xs text-brand-400/90">{tpl.institution}</p>
                    </div>

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-600 text-white' : 'border border-slate-700 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODAL: ALAN / KONU SEÇİMİ MODALI                      */}
      {/* ======================================================== */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Soru Alanlarını Seçin</h3>
              </div>
              <button onClick={() => setShowSubjectModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-4">
              {subjects.map(subj => {
                const isSelected = selectedSubjectIds.includes(subj.id);

                return (
                  <div
                    key={subj.id}
                    onClick={() => handleToggleSubject(subj.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-950/50 border-brand-500/70'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{subj.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{subj.description}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                      isSelected ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedSubjectIds.length} alan seçili</span>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
              >
                Tamamla
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL: KANUN / MEVZUAT SEÇİMİ MODALI                  */}
      {/* ======================================================== */}
      {showLawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Mülakat Kanunlarını Seçin</h3>
              </div>
              <button onClick={() => setShowLawModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-4">
              {laws.map(law => {
                const isSelected = selectedLawIds.includes(law.id);

                return (
                  <div
                    key={law.id}
                    onClick={() => handleToggleLaw(law.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-950/50 border-brand-500/70'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-brand-300">{law.code}</span>
                        <span className="text-[10px] text-slate-500">• {law.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{law.description}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                      isSelected ? 'bg-brand-600 border-brand-500 text-white' : 'border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  setShowLawModal(false);
                  onOpenResourceUploader();
                }}
                className="text-brand-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Yeni Kanun / Tebliğ Ekle</span>
              </button>
              
              <button
                onClick={() => setShowLawModal(false)}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
              >
                Tamamla
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: ADAY & İLAN DETAYLARI MODALI                    */}
      {/* ======================================================== */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <span>Aday ve İlan Bilgilerini Girin</span>
              </h3>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Adınız & Soyadınız</label>
                <input
                  type="text"
                  placeholder="Örn: Mehmet Can"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              {selectedTemplate.id === 'temp-custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Özel Kurum Adı</label>
                    <input
                      type="text"
                      placeholder="Örn: Sermaye Piyasası Kurulu"
                      value={customInstitution}
                      onChange={(e) => setCustomInstitution(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Kadro / Pozisyon</label>
                    <input
                      type="text"
                      placeholder="Örn: Uzman Yardımcısı"
                      value={customPosition}
                      onChange={(e) => setCustomPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-medium mb-1">İlan Metni veya Sınav Notları (İsteğe Bağlı)</label>
                <textarea
                  rows={3}
                  placeholder="Resmi ilandaki şartları veya komisyonun bilmesini istediğiniz detayları buraya yapıştırabilirsiniz..."
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500 resize-none placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Komisyon Üslubu</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCommitteeTone('supportive')}
                    className={`py-2 rounded-lg text-center font-semibold transition-all ${
                      committeeTone === 'supportive'
                        ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    Destekleyici
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommitteeTone('standard')}
                    className={`py-2 rounded-lg text-center font-semibold transition-all ${
                      committeeTone === 'standard'
                        ? 'bg-brand-950 border border-brand-500 text-brand-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    Standart
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommitteeTone('strict')}
                    className={`py-2 rounded-lg text-center font-semibold transition-all ${
                      committeeTone === 'strict'
                        ? 'bg-rose-950 border border-rose-500 text-rose-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400'
                    }`}
                  >
                    Stres
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
              >
                Kaydet ve Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
