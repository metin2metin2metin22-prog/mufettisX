export type CommitteeTone = 'supportive' | 'standard' | 'strict';

export type InterviewStage = 
  | 'welcome'        // Giriş ve selamlaşma
  | 'introduction'   // Adayın özgeçmişi ve motivasyonu
  | 'legal_theory'   // Kanun ve mevzuat teorik bilgisi
  | 'followup_deep'  // Cevaba göre derinleştirici teknik soru
  | 'case_study'     // Pratik denetim/olay vakası çözümü
  | 'ethics_stress'  // Etik ikilem veya kriz yönetimi sorusu
  | 'evaluation'     // Komisyon nihai kararı ve karne
  | 'completed';     // Mülakat bitti

export interface LawArticle {
  id: string;
  articleNumber: string;
  title: string;
  text: string;
  relevance: string;
}

export interface LawResource {
  id: string;
  code: string;
  title: string;
  category: 'maliye' | 'hukuk' | 'iktisat' | 'kamu_yonetimi' | 'bankacilik' | 'diger';
  description: string;
  articles: LawArticle[];
  isCustom?: boolean;
}

export interface ExternalResource {
  id: string;
  title: string;
  type: 'teblig' | 'genelge' | 'makale' | 'vaka_notu' | 'yonetmelik';
  source: string;
  content: string;
  dateAdded: string;
}

export interface SubjectField {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
}

export interface InterviewTemplate {
  id: string;
  title: string;
  institution: string;
  category: 'Denetim & Teftiş' | 'Yargı & Hukuk' | 'Maliye & Vergi' | 'Finans & Banka' | 'Mülki İdare' | 'Özel';
  description: string;
  defaultSubjects: string[];
  suggestedLaws: string[];
  sampleQuestions: string[];
  popular?: boolean;
}

export interface InterviewConfig {
  interviewTypeId: string;
  customTitle?: string;
  targetInstitution: string;
  positionTitle: string;
  candidateName: string;
  jobPostingDetails: string;
  selectedSubjects: string[];
  selectedLaws: string[];
  committeeTone: CommitteeTone;
  questionCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'commission' | 'candidate' | 'system';
  speakerTitle?: string;
  speakerIndex?: number; // 0, 1, 2, 3, 4 (5 sembolik üyeden hangisi)
  avatarUrl?: string;
  content: string;
  timestamp: string;
  stage: InterviewStage;
  referencedLaw?: {
    lawCode: string;
    articleNumber: string;
    snippet: string;
  };
}

export interface QuestionAnalysis {
  questionNumber: number;
  questionText: string;
  candidateAnswerText: string;
  commissionImpression: string; // Heyetin bu cevaptaki hissi ve intibası
  accuracyScore: number; // 0 - 100
  critique: string; // Nerede hata yaptı veya neyi eksik bıraktı
  idealAnswerGuide: string; // İdeal kanuni cevap nasıl olmalıydı
}

export interface InterviewEvaluationReport {
  overallScore: number; // 0 - 100
  verdict: 'BAŞARILI' | 'YEDEKLERDE' | 'YETERSİZ';
  candidateName: string;
  position: string;
  institution: string;
  scores: {
    legalKnowledge: number;
    logicalReasoning: number;
    expressionAndDiction: number;
    ethicsAndStressManagement: number;
  };
  // Heyetin Oturum Boyunca Gizli Duygu Durumu ve İzlenimleri
  committeeImpressionSummary: string;
  questionAnalyses: QuestionAnalysis[];
  keyStrengths: string[];
  areasToDevelop: string[];
  commissionNotes: string;
  recommendedLawArticles: string[];
  studyPrescription: string[]; // Sınava kadar çalışılması gereken somut reçete
  fullAIReportText?: string;
}
