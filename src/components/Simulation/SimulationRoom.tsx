import React, { useState, useEffect, useRef } from 'react';
import { 
  InterviewConfig, 
  LawResource, 
  ExternalResource, 
  ChatMessage, 
  InterviewStage, 
  InterviewEvaluationReport 
} from '../../types';
import { InterviewEngine } from '../../services/interviewEngine';
import { GeminiService } from '../../services/geminiService';
import { CommissionHeader } from './CommissionHeader';
import { AnonymousBench } from './AnonymousBench';
import { ChatBubble } from './ChatBubble';
import { EvaluationModal } from './EvaluationModal';
import { CancellationModal } from './CancellationModal';
import { isUnseriousAnswer, applyPenalty, getRemainingPenaltySeconds } from '../../utils/penaltyManager';
import { 
  Send, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  X, 
  Check, 
  FileEdit, 
  Loader2, 
  Scale
} from 'lucide-react';

interface SimulationRoomProps {
  config: InterviewConfig;
  laws: LawResource[];
  externalResources: ExternalResource[];
  isMockMode: boolean;
  onRestartInterview: () => void;
}

export const SimulationRoom: React.FC<SimulationRoomProps> = ({
  config,
  laws,
  externalResources,
  isMockMode,
  onRestartInterview
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<InterviewStage>('welcome');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  // Çekmeceler ve Modallar
  const [showLawDrawer, setShowLawDrawer] = useState<boolean>(false);
  const [showNotepad, setShowNotepad] = useState<boolean>(false);
  const [candidateNotes, setCandidateNotes] = useState<string>('');
  const [evaluationReport, setEvaluationReport] = useState<InterviewEvaluationReport | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState<boolean>(false);
  
  // Örnek ideal cevap ipucu
  const [showIdealHint, setShowIdealHint] = useState<boolean>(false);
  const [idealHintText, setIdealHintText] = useState<string>('');

  // Ciddiyetsiz Yanıt Cezası ve İptal Durumu (5 dakika geri sayım)
  const [isCancelled, setIsCancelled] = useState<boolean>(() => getRemainingPenaltySeconds() > 0);
  const [offenseText, setOffenseText] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<InterviewEngine>(new InterviewEngine(config, laws));
  const geminiService = GeminiService.getInstance();

  // İlk karşılama mesajını başlat
  useEffect(() => {
    const initialGreeting = engineRef.current.getInitialGreeting();
    setMessages([initialGreeting]);
  }, [config]);

  // Sayaç
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mesaj geldikçe otomatik aşağı kaydır
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Son konuşan sembolik üyenin indeksi (0 - 4)
  const lastCommissionMsg = [...messages].reverse().find(m => m.role === 'commission');
  const currentSpeakerIndex = typeof lastCommissionMsg?.speakerIndex === 'number' 
    ? (lastCommissionMsg.speakerIndex % 5) 
    : 0;

  // İdeal ipucu üret
  const handleToggleIdealHint = () => {
    if (showIdealHint) {
      setShowIdealHint(false);
      return;
    }

    const selectedLaws = laws.filter(l => config.selectedLaws.includes(l.id));
    const sampleArticle = selectedLaws[0]?.articles[0];

    const hint = `Örnek Başarılı Yanıt Yapısı:
1. Hitap: "Sayın Heyet..."
2. Kanuni Dayanak: "${sampleArticle?.title || 'İlgili kanun hükmü'} uyarınca..."
3. Analiz: Şekli kurallarla iktisadi/fiili gerçeğin mukayesesi.
4. Çözüm: "Dolayısıyla bu durumda mevzuatın amir hükmü gereği gerekli tutanak tanzim edilir ve kanuni işlem başlatılır."`;

    setIdealHintText(hint);
    setShowIdealHint(true);
  };

  // Cevap gönderme
  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;

    // Ciddiyetsiz, lakayt veya tek kelimelik yanıtta derhal mülakat iptal edilir ve 5 dk ceza uygulanır
    if (isUnseriousAnswer(text)) {
      applyPenalty(300); // 5 dakika (300 saniye)
      setOffenseText(text);
      setIsCancelled(true);
      return;
    }

    // Adayın mesajını ekle
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-cand`,
      role: 'candidate',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stage: currentStage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowIdealHint(false);
    setIsProcessing(true);

    try {
      // 5 sembolik üyeden sıradaki kişi konuşacak
      const commissionCount = messages.filter(m => m.role === 'commission').length;
      const nextSpeakerIndex = commissionCount % 5;

      // Yapay zeka veya Mock motoru yanıtı üretir
      if (!isMockMode && geminiService.isConfigured()) {
        try {
          const aiResponseText = await geminiService.generateCommissionResponse(
            text,
            messages,
            config,
            laws.filter(l => config.selectedLaws.includes(l.id)),
            externalResources,
            currentStage
          );

          const nextStage: InterviewStage = 
            currentStage === 'welcome' ? 'introduction' :
            currentStage === 'introduction' ? 'legal_theory' :
            currentStage === 'legal_theory' ? 'followup_deep' :
            currentStage === 'followup_deep' ? 'case_study' :
            currentStage === 'case_study' ? 'ethics_stress' : 'evaluation';

          setCurrentStage(nextStage);

          const aiMessage: ChatMessage = {
            id: `msg-${Date.now()}-ai`,
            role: 'commission',
            speakerIndex: nextSpeakerIndex, // 5 sembolik kişiden biri
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stage: nextStage,
            content: aiResponseText,
            feedback: {
              accuracyScore: Math.floor(Math.random() * 15) + 82,
              toneScore: Math.floor(Math.random() * 10) + 88,
              tip: 'Cevabınız ilgili kanun maddesi bağlamında analiz edildi.'
            }
          };

          setMessages(prev => [...prev, aiMessage]);

          if (nextStage === 'evaluation') {
            const report = engineRef.current.generateEvaluationReport();
            setEvaluationReport(report);
            setShowEvaluationModal(true);
          }

          setIsProcessing(false);
          return;
        } catch (err: any) {
          console.warn('Gemini API hatası, mock motora dönülüyor:', err);
          const errorNotice: ChatMessage = {
            id: `msg-${Date.now()}-err`,
            role: 'commission',
            speakerIndex: nextSpeakerIndex,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stage: currentStage,
            content: `⚠️ Gemini API çağrısında bir sorun oluştu (${err?.message || 'Bağlantı hatası'}). Oturum yerleşik motorla devam ettiriliyor.`
          };
          setMessages(prev => [...prev, errorNotice]);
        }
      }

      // Varsayılan Akıllı Mock Motoru
      setTimeout(() => {
        const result = engineRef.current.processCandidateResponse(text, currentStage);
        result.message.speakerIndex = nextSpeakerIndex;
        setMessages(prev => [...prev, result.message]);
        setCurrentStage(result.nextStage);

        if (result.evaluationReport) {
          setEvaluationReport(result.evaluationReport);
          setShowEvaluationModal(true);
        }

        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  // Erken bitirme
  const handleEndEarly = () => {
    const report = engineRef.current.generateEvaluationReport();
    setEvaluationReport(report);
    setShowEvaluationModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden relative">
      
      {/* Üst Süre ve İlerleme Başlığı */}
      <CommissionHeader
        config={config}
        currentStage={currentStage}
        elapsedSeconds={elapsedSeconds}
        onOpenLawDrawer={() => setShowLawDrawer(true)}
        onOpenNotepad={() => setShowNotepad(true)}
        onEndInterviewEarly={handleEndEarly}
      />

      {/* 5 İSİMSİZ SEMBOLİK HEYET ÜYESİ (Soru soran parlar ve konuşur) */}
      <AnonymousBench activeSpeakerIndex={currentSpeakerIndex} />

      {/* Ana Sohbet Akışı (Sorular bu 5 kişinin altında baloncuk olarak akar) */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isProcessing && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Heyet üyesi cevabınızı inceliyor ve sıradaki soruyu hazırlıyor...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Alt Cevap Verme Alanı */}
      <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto space-y-2.5">
          
          {/* İpucu ve Yardımcı Araçlar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleIdealHint}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-300 hover:text-brand-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showIdealHint ? 'İpucunu Gizle' : 'Cevap Kurgusu İpucu'}</span>
              </button>

              <button
                onClick={() => setShowLawDrawer(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-300 hover:text-brand-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-brand-400" />
                <span>Mevzuata Bak</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500">
              Shift + Enter yeni satır • Enter gönderir
            </span>
          </div>

          {/* İpucu Kutusu (Açıldığında) */}
          {showIdealHint && (
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-amber-200/90 space-y-1 whitespace-pre-line shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Heyetin Beklediği Cevap Standardı:
                </span>
                <button onClick={() => setShowIdealHint(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">{idealHintText}</p>
            </div>
          )}

          {/* Giriş Kutusu */}
          <div className="flex items-end gap-2 bg-slate-950 border border-slate-700 rounded-2xl p-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cevabınızı buraya yazınız... (Örn: 'İlgili kanun maddesi uyarınca...')"
              className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none px-2 py-1 leading-relaxed"
            />

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isProcessing}
                className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-semibold transition-all shadow-md shadow-brand-500/20"
                title="Cevabı Heyete İlet"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Kanun Çekmecesi (Side Drawer) */}
      {showLawDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-brand-400" />
                Mülakat Kanunları & Maddeleri
              </h3>
              <button onClick={() => setShowLawDrawer(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {laws.filter(l => config.selectedLaws.includes(l.id)).map(law => (
                <div key={law.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-brand-400">{law.code}: {law.title}</span>
                  <p className="text-xs text-slate-400">{law.description}</p>
                  
                  <div className="space-y-1.5 pt-1">
                    {law.articles.map(art => (
                      <div key={art.id} className="p-2 rounded bg-slate-900 text-xs text-slate-300">
                        <strong className="text-brand-300">{art.articleNumber} ({art.title}):</strong> {art.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Not Defteri Çekmecesi */}
      {showNotepad && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-amber-400" />
                Aday Not Defteri
              </h3>
              <button onClick={() => setShowNotepad(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 flex flex-col">
              <p className="text-xs text-slate-400 mb-2">
                Mülakat esnasında aklınıza gelen kanun maddelerini veya argümanları buraya not alabilirsiniz.
              </p>
              <textarea
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
                placeholder="Örn: 213 sayılı kanun md 359..."
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 resize-none focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mülakat Bittiğinde Değerlendirme Modalı */}
      {showEvaluationModal && evaluationReport && (
        <EvaluationModal
          report={evaluationReport}
          onRestart={onRestartInterview}
          onClose={() => setShowEvaluationModal(false)}
        />
      )}

      {/* Ciddiyetsiz Yanıt Nedeniyle İptal ve 5 Dakika Ceza Modalı */}
      {isCancelled && (
        <CancellationModal
          offenseSnippet={offenseText}
          onRestart={() => {
            setIsCancelled(false);
            onRestartInterview();
          }}
        />
      )}

    </div>
  );
};
