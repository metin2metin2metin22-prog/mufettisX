import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewConfig, LawResource, ExternalResource, ChatMessage } from '../types';

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
    // Varsayılan olarak mock modu açık (Kullanıcı promptunda "cevapları şimdilik api ye bağlama" dediği için)
    return stored === null ? true : stored === 'true';
  }

  public setMockMode(useMock: boolean): void {
    localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(useMock));
  }

  public isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  // Gemini API'ye gönderilecek sistem promptunu ve kanun bağlamını inşa eder
  public buildSystemPrompt(
    config: InterviewConfig,
    selectedLaws: LawResource[],
    externalResources: ExternalResource[]
  ): string {
    const toneText = {
      supportive: 'Adayı cesaretlendirici, rehberlik eden ama ciddiyeti koruyan nazik bir üslup',
      standard: 'Klasik devlet teftiş kurulu mülakatı üslubu; mesafeli, resmi, net ve ölçülü',
      strict: 'Stres mülakatı tarzı; adayın cevaplarını sıkıştıran, çelişkileri anında yüzüne vuran zorlayıcı bir üslup'
    }[config.committeeTone];

    const lawsContext = selectedLaws.map(law => {
      const articles = law.articles.map(a => `  - ${a.articleNumber} (${a.title}): ${a.text}`).join('\n');
      return `[KANUN: ${law.title} (${law.code})]\n${articles}`;
    }).join('\n\n');

    const resourcesContext = externalResources.map(r => {
      return `[KAYNAK: ${r.title} (${r.source})]\n${r.content}`;
    }).join('\n\n');

    return `Sen "MüfettişX" adında, Türkiye'nin en seçkin kariyer meslek sınavları ve teftiş kurulları (VDK, Sayıştay, SGK, İdari Yargı, BDDK vb.) için sözlü mülakat simülasyonu yapan Yüksek Mülakat Komisyon Heyetisin.

MÜLAKAT BİLGİLERİ:
- Hedef Kurum: ${config.targetInstitution || 'Teftiş Kurulu'}
- Kadro / Unvan: ${config.positionTitle || 'Müfettiş Yardımcılığı'}
- Aday Adı: ${config.candidateName || 'Aday'}
- İlan ve Başvuru Detayları: ${config.jobPostingDetails || 'Standart A Grubu Kariyer İlanı'}
- Komisyon Tavrı: ${toneText}

MÜLAKATTA KULLANILACAK KANUN VE MEVZUAT METİNLERİ:
${lawsContext}

EK KAYNAKLAR VE DENETİM REHBERLERİ:
${resourcesContext}

GÖREVLERİN:
1. Sen tek bir yapay zeka gibi değil; oturumu yöneten "Komisyon Başkanı" ve uzman "Komisyon Üyeleri" ağzıyla konuşursun.
2. Adayın verdiği cevabı analiz et: kanuni terimleri doğru kullandı mı? Mantık silsilesi sağlam mı?
3. Soru sorarken mutlaka yukarıda verilen KANUN MADDELERİNDEN ve gerçek denetim senaryolarından yararlan.
4. Sırasıyla şu aşamaları takip et:
   - Tanışma ve kariyer motivasyonu
   - Teorik kanun maddesi sorusu
   - Derinleştirici takip sorusu
   - Somut denetim vakası (Case Study)
   - Etik ikilem ve stres yönetimi sorusu
   - Sonuç ve komisyon değerlendirmesi
5. Yanıtlarını Türkçe, son derece prestijli, resmi ve hukuki ciddiyete uygun formatta ver.`;
  }

  // Gemini API çağrısı
  public async generateCommissionResponse(
    candidateText: string,
    history: ChatMessage[],
    config: InterviewConfig,
    laws: LawResource[],
    externalResources: ExternalResource[]
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API anahtarı tanımlı değil.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const systemPrompt = this.buildSystemPrompt(config, laws, externalResources);
    
    // Geçmiş mesajları formatla
    const conversationHistory = history.map(msg => 
      `${msg.role === 'commission' ? 'KOMİSYON' : 'ADAY'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${systemPrompt}

GEÇMİŞ MÜLAKAT DİYALOĞU:
${conversationHistory}

ADAYIN SON CEVABI:
"${candidateText}"

Lütfen komisyonun bir sonraki sorusunu veya cevaba yönelik değerlendirmesini üret.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }
}
