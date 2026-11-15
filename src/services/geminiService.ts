import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewConfig, LawResource, ExternalResource, ChatMessage, InterviewStage } from '../types';

const API_KEY_STORAGE_KEY = 'mufettisx_gemini_api_key';
const MOCK_MODE_STORAGE_KEY = 'mufettisx_use_mock_mode';

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  public setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }

  public isMockMode(): boolean {
    const stored = localStorage.getItem(MOCK_MODE_STORAGE_KEY);
    // Varsayılan olarak mock modu açık
    return stored === null ? true : stored === 'true';
  }

  public setMockMode(useMock: boolean): void {
    localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(useMock));
  }

  public isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  // API Anahtarını canlı olarak test eder
  public async testConnection(key?: string): Promise<{ success: boolean; message: string }> {
    const testKey = key?.trim() || this.getApiKey();
    if (!testKey) {
      return { success: false, message: 'Lütfen geçerli bir Gemini API anahtarı giriniz.' };
    }

    try {
      const genAI = new GoogleGenerativeAI(testKey);
      // Ücretsiz ve en hızlı model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Merhaba, tek kelimeyle "Aktif" de.');
      const response = await result.response;
      const text = response.text();

      if (text) {
        return { success: true, message: 'Google Gemini API bağlantısı başarılı! Ücretsiz Flash modeli hazır.' };
      }
      return { success: false, message: 'API yanıt döndüremedi.' };
    } catch (err: any) {
      console.error('Gemini test error:', err);
      let errMsg = err.message || 'Bağlantı sağlanamadı.';
      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('400')) {
        errMsg = 'Geçersiz API Anahtarı! Lütfen Google AI Studio üzerinden aldığınız anahtarı kontrol ediniz.';
      }
      return { success: false, message: `Hata: ${errMsg}` };
    }
  }

  // Gemini API'ye gönderilecek sistem promptunu ve kanun bağlamını inşa eder
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
      const articles = law.articles.map(a => `  - ${a.articleNumber} (${a.title}): ${a.text} [Önem: ${a.relevance}]`).join('\n');
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
1. Tek bir kişi gibi değil, "Komisyon Başkanı (Başmüfettiş)" veya uzman "Komisyon Üyeleri" (Maliye, Hukuk, Bankacılık) kimliğiyle konuş.
2. Adayın cevabını kısaca analiz et (hukuki terminolojiye uydu mu, mantık tutarlı mı?), ardından bir sonraki derinleştirici soruyu sor.
3. Soru sorarken mutlaka yukarıdaki KANUN METİNLERİNDEN (Örn: VUK 359, 5018 Harcama yetkilisi, Anayasa 73 vb.) ve gerçek denetim senaryolarından (sahte fatura, zimmet, örtülü sermaye, yetki aşımı) beslen.
4. Yanıtlarını Türkçe, son derece resmi, devlet ciddiyetine ve Türk bürokrasi teftiş adabına uygun şekilde ver.
5. Aşırı uzun destansı yanıtlar verme; mülakat sohbetinin dinamik kalması için 2-3 paragrafı geçme.`;
  }

  // Gemini API çağrısı
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
      throw new Error('Gemini API anahtarı tanımlı değil.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Ücretsiz katmanda çalışan Google Gemini 1.5 Flash modeli
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

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

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }
}
