import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewConfig, LawResource, ExternalResource, ChatMessage, InterviewStage } from '../types';

// Çevre değişkeninden yüklenen entegre API anahtarı (.env.local)
const EMBEDDED_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MOCK_MODE_STORAGE_KEY = 'mufettisx_use_mock_mode';

// Desteklenen ücretsiz Flash modelleri (Öncelik sırasıyla)
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
    // Artık varsayılan olarak Gemini AI aktif (false)
    return stored === 'true';
  }

  public setMockMode(useMock: boolean): void {
    localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(useMock));
  }

  public isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  // Sistem promptunu ve kanun bağlamını inşa eder
  public buildSystemPrompt(
    config: InterviewConfig,
    selectedLaws: LawResource[],
    externalResources: ExternalResource[],
    currentStage: InterviewStage
  ): string {
    const toneText = {
      supportive: 'Adayı cesaretlendirici, rehberlik eden ama ciddiyeti koruyan nazik bir üslup',
      standard: 'Klasik devlet teftiş kurulu mülakatı üslubu; mesafeli, resmi, net ve ölçülü',
      strict: 'Stres mülakatı tarzı; adayın cevaplarını sıkıştıran, çelişkileri anında yüzüne vuran zorlayıcı bir üslup'
    }[config.committeeTone];

    const lawsContext = selectedLaws.map(law => {
      const articles = law.articles.map(a => `  - ${a.articleNumber} (${a.title}): ${a.text} [Mülakat Önemi: ${a.relevance}]`).join('\n');
      return `[KANUN: ${law.title} (${law.code})]\n${articles}`;
    }).join('\n\n');

    const resourcesContext = externalResources.map(r => {
      return `[KAYNAK: ${r.title} (${r.source})]\n${r.content}`;
    }).join('\n\n');

    return `Sen "MüfettişX" adında, Türkiye'nin en seçkin kariyer meslek sınavları ve teftiş kurulları (VDK, Sayıştay, SGK, İdari Yargı Hâkimliği, Banka Müfettişliği, BDDK vb.) için sözlü mülakat simülasyonu icra eden Yüksek Mülakat Komisyon Heyetisin.

MÜLAKAT BİLGİLERİ:
- Hedef Kurum: ${config.targetInstitution || 'Teftiş Kurulu Başkanlığı'}
- Kadro / Unvan: ${config.positionTitle || 'Müfettiş Yardımcılığı'}
- Aday Adı: ${config.candidateName || 'Aday'}
- İlan Detayları: ${config.jobPostingDetails || 'Standart A Grubu Kariyer İlanı'}
- Komisyon Tavrı: ${toneText}
- Mülakat Aşaması: ${currentStage}

MÜLAKATTA KULLANILACAK KANUN VE MEVZUAT METİNLERİ:
${lawsContext}

EK KAYNAKLAR VE DENETİM REHBERLERİ:
${resourcesContext}

KOMİSYON PROTOKOLÜ VE KURALLAR:
1. Tek bir kişi gibi değil, "Komisyon Başkanı (Başmüfettiş)" veya uzman "Komisyon Üyeleri" (Maliye, Hukuk, Muhasebe vb.) kimliğiyle konuş.
2. Adayın cevabını kısaca analiz et (hukuki terminolojiye uydu mu, mantık tutarlı mı?), ardından bir sonraki derinleştirici soruyu sor.
3. Soru sorarken mutlaka yukarıdaki KANUN METİNLERİNDEN (Örn: VUK 359, 5018 Harcama yetkilisi, Anayasa 73 vb.) ve gerçek denetim senaryolarından (sahte fatura, zimmet, örtülü sermaye, yetki aşımı) beslen.
4. Yanıtlarını Türkçe, son derece resmi, devlet ciddiyetine ve Türk bürokrasi teftiş adabına uygun şekilde ver.
5. Aşırı uzun yanıtlar verme; mülakat sohbetinin dinamik kalması için 2-3 paragrafı geçme.`;
  }

  // Gemini API çağrısı (Model fallback ile yüksek kararlılık)
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
    
    // Geçmiş mesajları formatla
    const conversationHistory = history.map(msg => 
      `${msg.role === 'commission' ? (msg.speakerTitle || 'KOMİSYON') : 'ADAY'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${systemPrompt}

GEÇMİŞ MÜLAKAT DİYALOĞU:
${conversationHistory}

ADAYIN VERDİĞİ SON CEVAP:
"${candidateText}"

LÜTFEN ŞİMDİ:
Adayın cevabını komisyon heyeti vakarında kısaca değerlendir ve ilgili kanun veya teftiş senaryosu çerçevesinde sıradaki sorunu yönelt.`;

    let lastError: any = null;

    // Desteklenen modelleri sırasıyla dene
    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        if (text) {
          return text;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} denenirken hata:`, err?.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error('Yapay zeka yanıt üretemedi.');
  }
}
