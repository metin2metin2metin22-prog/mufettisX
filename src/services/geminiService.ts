import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  InterviewConfig, 
  LawResource, 
  ExternalResource, 
  ChatMessage, 
  InterviewStage,
  InterviewEvaluationReport 
} from '../types';

// Çevre değişkeninden yüklenen entegre API anahtarı (.env.local)
const EMBEDDED_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MOCK_MODE_STORAGE_KEY = 'mufettisx_use_mock_mode';

// Desteklenen modeller sırasıyla
const SUPPORTED_MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public getApiKey(): string {
    return EMBEDDED_API_KEY;
  }

  public isMockMode(): boolean {
    const stored = localStorage.getItem(MOCK_MODE_STORAGE_KEY);
    return stored === 'true';
  }

  public setMockMode(useMock: boolean): void {
    localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(useMock));
  }

  public isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  // Sistem promptu: Sembolik ve İsimsiz Heyet Üyesi
  public buildSystemPrompt(
    config: InterviewConfig,
    selectedLaws: LawResource[],
    externalResources: ExternalResource[],
    currentStage: InterviewStage
  ): string {
    const toneDescription = {
      supportive: 'Adayın heyecanını yatıştıran ancak devlet vakarından ödün vermeyen, öğretici ve yönlendirici bir heyet.',
      standard: 'Klasik Türk Devlet Teftiş Kurulu mülakatı: Ağırbaşlı, mesafeli, resmi, kanun lafzına ve ruhuna aşırı dikkat eden, tavizsiz heyet.',
      strict: 'Stres mülakatı: Adayın en ufak çelişkisini yakalayan, baskı altında soğukkanlılığını ölçen, sert ve zorlayıcı heyet.'
    }[config.committeeTone];

    const lawsContext = selectedLaws.map(law => {
      const articles = law.articles.map(a => `  • ${a.articleNumber} (${a.title}): ${a.text}\n    [Gerekçe/Önem: ${a.relevance}]`).join('\n');
      return `[KANUN METNİ: ${law.title} - ${law.code}]\n${articles}`;
    }).join('\n\n');

    const resourcesContext = externalResources.map(r => {
      return `[EK KAYNAK/TEBLİĞ: ${r.title} (${r.source})]\n${r.content}`;
    }).join('\n\n');

    return `SENİN ROLÜN:
Sen, bir sözlü mülakatta yer alan 5 SEMBOLİK VE İSİMSİZ heyet üyesinden birisin.

MÜLAKAT KÜNYESİ:
- Hedef Kurum: ${config.targetInstitution || 'İlgili Kurum'}
- Kadro: ${config.positionTitle || 'Müfettiş Yardımcılığı'}
- Aday Adı: ${config.candidateName || 'Aday'}
- İlan/Kadro Bilgileri: ${config.jobPostingDetails || 'Standart Kariyer Sınavı'}
- Mülakat Tarzı: ${toneDescription}
- Oturum Aşaması: ${currentStage}

MASADAKİ KANUN VE MEVZUAT METİNLERİ:
${lawsContext}

${resourcesContext ? `EK REHBER VE TEBLİĞLER:\n${resourcesContext}\n` : ''}

KESİN KURALLAR:
1. **ASLA İSİM VEYA ÜNVAN KULLANMA:** Kendine veya diğer üyelere "Komisyon Başkanı", "Başmüfettiş", "Hukuk Müşaviri", "Üye" gibi unvanlar veya kişi isimleri TAKMA. Sen sadece heyetteki sembolik bir kişisin.
2. **DOĞRUDAN SORUYA ODAKLAN:** Adayın cevabını kısaca analiz et ve doğrudan kanun maddeleri üzerinden sorunu sor.
3. **CEVAP BÜTÜNLÜĞÜ:** Cümlelerini ASLA yarıda kesme! Yanıtını her zaman adaya yöneltilen net bir soruyla ve "Buyrun izah ediniz." gibi bir bitirişle tamamla.
4. **MÜLAKAT CİDDİYETİ:** Aday lakayt veya tek kelimelik (örn: "sor", "bilmem") cevap verirse, bunu ciddiyetle eleştirip sorunu yönelt.`;
  }

  // Gemini API Soru Çağrısı
  public async generateCommissionResponse(
    candidateText: string,
    history: ChatMessage[],
    config: InterviewConfig,
    laws: LawResource[],
    externalResources: ExternalResource[],
    currentStage: InterviewStage
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API anahtarı bulunamadı.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = this.buildSystemPrompt(config, laws, externalResources, currentStage);
    
    const conversationHistory = history.slice(-6).map(msg => 
      `${msg.role === 'commission' ? 'HEYET' : 'ADAY'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${systemPrompt}

GEÇMİŞ MÜLAKAT TUTANAĞI:
${conversationHistory}

ADAYIN KOMİSYONA SON CEVABI:
"${candidateText}"

TALİMAT:
Adayın cevabını analiz et. Kendine ASLA unvan veya isim takmadan (Örn: '**Komisyon Başkanı:**' gibi ibareler yazma), doğrudan mevzuat ve denetim senaryosu çerçevesinde sıradaki sorunu sor.
(ÖNEMLİ: Cümleni ASLA yarım bırakma. Tam bir soru cümlesiyle bitir.)`;

    let lastError: any = null;

    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500,
          }
        });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} denenirken hata:`, err?.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error('Yapay zeka yanıt üretemedi.');
  }

  // ========================================================
  // YAPAY ZEKA DESTEKLİ KAPSAMLI MÜLAKAT DEĞERLENDİRME RAPORU
  // ========================================================
  public async generateComprehensiveAIReport(
    config: InterviewConfig,
    history: ChatMessage[],
    laws: LawResource[]
  ): Promise<InterviewEvaluationReport> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API anahtarı bulunamadı.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Mülakat diyaloglarını derle
    const conversation = history.map((msg, i) => 
      `[${msg.role === 'commission' ? 'HEYET SORUSU' : 'ADAY YANITI'}]:\n${msg.content}`
    ).join('\n\n');

    const lawsList = laws
      .filter(l => config.selectedLaws.includes(l.id))
      .map(l => `${l.code} (${l.title})`)
      .join(', ');

    const prompt = `Sen Türkiye'nin en seçkin kariyer sınavları (VDK, Sayıştay, SGK, İdari Yargı vb.) için sözlü mülakat değerlendirmesi yapan Yüksek Mülakat Değerlendirme Kurulusun.

GÖREVİN:
Aşağıdaki gerçek mülakat diyaloğunu en ince ayrıntısına kadar incele. Aday için son derece profesyonel, gerçekçi, eksiklerini yüzüne vuran ve sınava hazırlanmasında hayat kurtaracak kalitede bir "MÜLAKAT DEĞERLENDİRME VE KARNE RAPORU" hazırla.

MÜLAKAT BİLGİLERİ:
- Kurum: ${config.targetInstitution || 'Teftiş Kurulu'}
- Kadro: ${config.positionTitle || 'Müfettiş Yardımcılığı'}
- Aday Adı: ${config.candidateName || 'Aday'}
- Gündemdeki Kanunlar: ${lawsList}

MÜLAKAT DİYALOĞU:
${conversation}

LÜTFEN SADECE GEÇERLİ BİR JSON NESNESİ DÖNDÜR. JSON FORMATI AŞAĞIDAKİ ŞABLONA BİREBİR UYMALIDIR (Yorum veya markdown tırnakları olmadan sadece saf JSON döndür):
{
  "overallScore": 84,
  "verdict": "BAŞARILI", 
  "scores": {
    "legalKnowledge": 85,
    "logicalReasoning": 80,
    "expressionAndDiction": 90,
    "ethicsAndStressManagement": 85
  },
  "committeeImpressionSummary": "Heyetin oturum boyunca gizli duygu durumu ve adaya dair psikolojik izlenimi (Örn: Heyet adayın ilk soruda özgüvenli olduğunu ancak 2. sorudaki zamanaşımı detayında bocaladığını, stres sorusunda ise dik durduğunu kaydetmiştir...)",
  "questionAnalyses": [
    {
      "questionNumber": 1,
      "questionText": "Sorulan soru",
      "candidateAnswerText": "Adayın verdiği cevap",
      "commissionImpression": "Heyetin bu cevabı dinlerkenki içsel hissi ve intibası",
      "accuracyScore": 85,
      "critique": "Adayın cevabındaki zayıf veya eksik bırakılan hukuki yönler",
      "idealAnswerGuide": "Bu soruya verilecek tam puanlık ideal kanuni cevap nasıl olmalıydı (Madde ve gerekçelerle)"
    }
  ],
  "keyStrengths": [
    "Adayın öne çıkan güçlü yönü 1",
    "Adayın öne çıkan güçlü yönü 2"
  ],
  "areasToDevelop": [
    "Geliştirmesi gereken kritik alan 1",
    "Geliştirmesi gereken kritik alan 2"
  ],
  "commissionNotes": "Heyetin aday hakkındaki nihai kanaat şerhi",
  "recommendedLawArticles": [
    "Örn: 213 Sayılı VUK Madde 359",
    "Örn: 5018 Sayılı Kanun Madde 31"
  ],
  "studyPrescription": [
    "Sınav gününe kadar adayın mutlaka yapması gereken somut çalışma maddesi 1",
    "Somut çalışma maddesi 2",
    "Somut çalışma maddesi 3"
  ]
}

NOT: 'verdict' alanı sadece 'BAŞARILI', 'YEDEKLERDE' veya 'YETERSİZ' değerlerinden birini alabilir. Puanlar 0-100 arası tamsayıdır.`;

    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 3000,
            responseMimeType: 'application/json'
          }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // JSON ayrıştırma
        const parsed = JSON.parse(text);

        return {
          overallScore: Number(parsed.overallScore) || 75,
          verdict: parsed.verdict || (Number(parsed.overallScore) >= 70 ? 'BAŞARILI' : 'YETERSİZ'),
          candidateName: config.candidateName || 'Aday',
          position: config.positionTitle || 'Müfettiş Yardımcılığı',
          institution: config.targetInstitution || 'Hazine ve Maliye Bakanlığı',
          scores: {
            legalKnowledge: Number(parsed.scores?.legalKnowledge) || 75,
            logicalReasoning: Number(parsed.scores?.logicalReasoning) || 75,
            expressionAndDiction: Number(parsed.scores?.expressionAndDiction) || 80,
            ethicsAndStressManagement: Number(parsed.scores?.ethicsAndStressManagement) || 80
          },
          committeeImpressionSummary: parsed.committeeImpressionSummary || 'Heyet adayın oturum genelindeki soğukkanlılığını ve temsil kabiliyetini olumlu değerlendirmiştir.',
          questionAnalyses: Array.isArray(parsed.questionAnalyses) ? parsed.questionAnalyses : [],
          keyStrengths: Array.isArray(parsed.keyStrengths) ? parsed.keyStrengths : ['Mevzuata genel hakimiyet', 'Soğukkanlı ifade yetisi'],
          areasToDevelop: Array.isArray(parsed.areasToDevelop) ? parsed.areasToDevelop : ['Kanun maddelerinin fıkra numaraları daha net ezberlenmeli'],
          commissionNotes: parsed.commissionNotes || 'Adayın mülakat genelindeki performansı heyetimizce tatmin edici bulunmuştur.',
          recommendedLawArticles: Array.isArray(parsed.recommendedLawArticles) ? parsed.recommendedLawArticles : ['213 Sayılı VUK Madde 359', '5018 Sayılı Kanun Madde 8'],
          studyPrescription: Array.isArray(parsed.studyPrescription) ? parsed.studyPrescription : ['İlgili kanun maddelerini tekrar çalışınız.'],
          fullAIReportText: text
        };
      } catch (err: any) {
        console.warn(`Rapor üretilirken ${modelName} hatası:`, err?.message || err);
      }
    }

    throw new Error('Yapay zeka mülakat raporu oluşturamadı.');
  }
}
