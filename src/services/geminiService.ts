import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewConfig, LawResource, ExternalResource, ChatMessage, InterviewStage } from '../types';

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

  // Sistem promptu: Gerçekçi Devlet Teftiş Kurulu & Mülakat Heyeti Atmosferi
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

  // Gemini API Çağrısı
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
    
    // Geçmiş mesajları resmi formata dök
    const conversationHistory = history.slice(-6).map(msg => 
      `${msg.role === 'commission' ? (msg.speakerTitle || 'KOMİSYON HEYETİ') : 'ADAY'}: ${msg.content}`
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

    // Desteklenen modelleri sırasıyla dene (Yüksek token limitiyle)
    for (const modelName of SUPPORTED_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500, // Yarım kalmayı önleyen geniş token tavanı
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
}
