import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { InterviewEvaluationReport } from '../../types';
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Scale, 
  Brain, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  ChevronUp,
  FileCheck,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';

interface EvaluationModalProps {
  report: InterviewEvaluationReport;
  onRestart: () => void;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  report,
  onRestart,
  onClose
}) => {
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);

  useEffect(() => {
    if (report.overallScore >= 70) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [report.overallScore]);

  const toggleQuestionExpand = (idx: number) => {
    setExpandedQuestionIdx(prev => (prev === idx ? null : idx));
  };

  const handlePrint = () => {
    window.print();
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'BAŞARILI':
        return (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-950 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-950/50">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>NİHAİ HEYET KARARI: ASİL KAZANDI (BAŞARILI)</span>
          </div>
        );
      case 'YEDEKLERDE':
        return (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-amber-950 text-amber-300 border-2 border-amber-500 shadow-lg shadow-amber-950/50">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>NİHAİ HEYET KARARI: YEDEK LİSTEYE ALINDI</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase bg-rose-950 text-rose-300 border-2 border-rose-500 shadow-lg shadow-rose-950/50">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>NİHAİ HEYET KARARI: ELENDİ (YETERSİZ)</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-9 shadow-2xl space-y-7 my-6 animate-in fade-in zoom-in-95 duration-200 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Üst Başlık & Mühür */}
        <div className="text-center space-y-3 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-left text-[11px] font-mono text-slate-400">
              <p>TUTANAK NO: 2026/S-KARNE</p>
              <p>TARİH: {new Date().toLocaleDateString('tr-TR')}</p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Raporu Yazdır / PDF</span>
            </button>
          </div>

          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-600 flex items-center justify-center shadow-xl shadow-brand-500/20 border-2 border-brand-400/50">
            <Award className="w-9 h-9 text-white" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-400">
              Yapay Zeka Destekli Kariyer Sınavı Raporu
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Mülakat Değerlendirme & Karne Tutanağı
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {report.institution} • {report.position} • Aday: <strong className="text-white">{report.candidateName}</strong>
            </p>
          </div>

          <div className="pt-1">
            {getVerdictBadge(report.verdict)}
          </div>
        </div>

        {/* 4 Ana Kategori Puan Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <Scale className="w-5 h-5 text-brand-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Mevzuat Bilgisi</span>
            <p className="text-2xl sm:text-3xl font-black text-brand-400 mt-1">%{report.scores.legalKnowledge}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <Brain className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Muhakeme & Analiz</span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">%{report.scores.logicalReasoning}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <MessageSquare className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Temsil & Diksiyon</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">%{report.scores.expressionAndDiction}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Etik & Stres</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">%{report.scores.ethicsAndStressManagement}</p>
          </div>
        </div>

        {/* Genel Başarı Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white">Heyet Genel Başarı Puanı</p>
              <p className="text-xs text-slate-400">100 Tam Puan Üzerinden Aritmetik Ortalama</p>
            </div>
          </div>
          <span className="text-4xl font-black text-white">{report.overallScore} <span className="text-sm font-normal text-slate-400">/ 100</span></span>
        </div>

        {/* BÖLÜM 1: HEYETİN OTURUM BOYUNCA GİZLİ DUYGU DURUMU VE İZLENİMLERİ (KULLANICI TALEBİ) */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Heyetin Oturum Boyunca Gizli Duygu Durumu & İzlenimleri</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            "{report.committeeImpressionSummary}"
          </p>
        </div>

        {/* BÖLÜM 2: SORU SORU DETAYLI CEVAP ANALİZİ & İDEAL CEVAP REHBERİ */}
        {report.questionAnalyses && report.questionAnalyses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand-400" />
                <span>Soru Soru Cevap Analizi ve İdeal Cevap Rehberi</span>
              </h3>
              <span className="text-[11px] text-slate-400">({report.questionAnalyses.length} Soru Tahlil Edildi)</span>
            </div>

            <div className="space-y-3">
              {report.questionAnalyses.map((qa, i) => {
                const isExpanded = expandedQuestionIdx === i;

                return (
                  <div 
                    key={i} 
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-all"
                  >
                    <div 
                      onClick={() => toggleQuestionExpand(i)}
                      className="p-4 cursor-pointer flex items-start justify-between gap-3 hover:bg-slate-900/60"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                            Soru #{qa.questionNumber || i + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            qa.accuracyScore >= 80 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            Puan: %{qa.accuracyScore}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                          {qa.questionText}
                        </p>
                      </div>

                      <button className="text-slate-400 hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
                        {/* Adayın Cevabı */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Adayın Verdiği Yanıt:</span>
                          <p className="text-slate-300 mt-1 leading-relaxed">"{qa.candidateAnswerText}"</p>
                        </div>

                        {/* Heyetin Bu Yanıttaki Hissi */}
                        {qa.commissionImpression && (
                          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-indigo-200">
                            <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-0.5">
                              Heyetin Bu Yanıttaki Gizli İntibası:
                            </span>
                            <p className="italic">"{qa.commissionImpression}"</p>
                          </div>
                        )}

                        {/* Hata ve Eleştiri */}
                        {qa.critique && (
                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-200">
                            <span className="text-[10px] font-bold uppercase text-rose-400 block mb-0.5">
                              Nerede Eksik Kaldı? (Komisyon Eleştirisi):
                            </span>
                            <p>{qa.critique}</p>
                          </div>
                        )}

                        {/* İdeal Cevap Rehberi */}
                        {qa.idealAnswerGuide && (
                          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Tam Puanlık İdeal Cevap Nasıl Olmalıydı?</span>
                            </span>
                            <p className="leading-relaxed text-slate-200 text-xs">{qa.idealAnswerGuide}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BÖLÜM 3: GÜÇLÜ YÖNLER & GELİŞİM ALANLARI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Adayın Güçlü Yönleri</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {report.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Kritik Risk ve Gelişim Alanları</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {report.areasToDevelop.map((area, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BÖLÜM 4: KİŞİSELLEŞTİRİLMİŞ ÇALIŞMA REÇETESİ (HAYAT KURTARICI REHBER) */}
        {report.studyPrescription && report.studyPrescription.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 border border-brand-500/40 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span>Sınava Kadar Kişiselleştirilmiş Çalışma Reçetesi (Action Plan)</span>
            </h4>
            <div className="space-y-2">
              {report.studyPrescription.map((presc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 leading-relaxed">{presc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BÖLÜM 5: KOMİSYON NİHAİ KANAAT ŞERHİ */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <span className="font-bold text-slate-400 uppercase text-[10px]">Heyet Ortak Kanaat Şerhi:</span>
          <p className="italic text-slate-200 leading-relaxed font-serif text-sm">
            "{report.commissionNotes}"
          </p>
        </div>

        {/* Alt Eylem Butonları */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Mülakat Oturumu Başlat</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Tutanak Diyaloğunu İncele
          </button>
        </div>

      </div>
    </div>
  );
};
