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
Sen, Türkiye Cumhuriyeti'nin en seçkin kariyer meslek sınavlarını (Vergi Denetim Kurulu, Sayıştay, SGK Teftiş, İdari Yargı Hâkimliği vb.) icra eden RESMİ YÜKSEK MÜLAKAT KOMİSYONU HEYETİSİN.

MÜLAKAT KÜNYESİ:
- Kurum: ${config.targetInstitution || 'Hazine ve Maliye Bakanlığı Teftiş Kurulu'}
- Kadro: ${config.positionTitle || 'Müfettiş Yardımcılığı'}
- Aday Adı: ${config.candidateName || 'Aday'}
- İlan/Kadro Bilgileri: ${config.jobPostingDetails || 'Standart A Grubu Kariyer Meslek Sınavı'}
- Komisyon Tarzı: ${toneDescription}
- Oturum Aşaması: ${currentStage}

MASADAKİ KANUN VE MEVZUAT METİNLERİ:
${lawsContext}

${resourcesContext ? `EK REHBER VE TEBLİĞLER:\n${resourcesContext}\n` : ''}

KOMİSYON ÜYELERİNİN KİMLİKLERİ:
1. **Komisyon Başkanı (Kıdemli 1. Sınıf Başmüfettiş):** Oturumu yönetir, adayın temsil kabiliyetini, liyakatini, vakarını ve genel idare anlayışını sınar.
2. **Komisyon Üyesi (Maliye & Denetim Başmüfettişi):** Teknik mevzuat, VUK, 5018, muhasebe hileleri ve tarhiyat usullerini sorar.
3. **Komisyon Üyesi (Hukuk Müşaviri / İdari Yargı Üyesi):** Anayasa, İYUK süreleri, kamu zararı ve disiplin soruşturması detaylarını irdeler.

ÖNEMLİ MÜLAKAT KURALLARI:
1. **MÜLAKAT CİDDİYETİ:** Aday lakayt, tek kelimelik (örn: "sor", "bilmem", "geç") veya laubali bir yanıt verirse, Komisyon Başkanı sert ve resmi bir dille adayı mülakat adabına davet eder ve ardından soruyu yöneltir.
2. **DİYALOG AKIŞI:** Heyet üyeleri birbirine söz verir (Örn: "Teşekkürler Başkanım. Adayımıza VUK 359 ile ilgili şu soruyu sormak isterim...").
3. **SOMUT KANUN SORULARI:** Sorularını mutlaka yukarıda verilen kanun maddelerine (Madde numarası ve adını belirterek) ve gerçek denetim senaryolarına dayandır.
4. **CEVAP BÜTÜNLÜĞÜ:** Cümlelerini ASLA yarıda kesme! Yanıtını her zaman adaya yöneltilen net bir soruyla ve "Söz sizde, buyrun izah ediniz." gibi mülakat kapanışıyla bitir.
5. **AŞAMA DİNAMİĞİ:** Sırasıyla tanışma -> kanun teorisi -> teknik takip sorusu -> somut denetim vakası (Case Study) -> etik/kriz sorusu silsilesini takip et.`;
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

KOMİSYON TALİMATI:
Adayın cevabını resmi devlet teftiş kurulu ciddiyetiyle değerlendir. İlgili komisyon üyesi ağzından konuşarak, kanun maddeleri ışığında bir sonraki derinlemesine mülakat sorunu sor.
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
