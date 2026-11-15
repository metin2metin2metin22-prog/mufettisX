import { 
  InterviewConfig, 
  ChatMessage, 
  InterviewStage, 
  LawResource, 
  InterviewEvaluationReport 
} from '../types';

export interface NextStepResult {
  message: ChatMessage;
  nextStage: InterviewStage;
  evaluationReport?: InterviewEvaluationReport;
}

// Komisyon Üyeleri Rolleri
const COMMISSION_ROLES = [
  { role: 'Komisyon Başkanı', title: 'Başkan (Kıdemli Başmüfettiş)' },
  { role: 'Üye 1', title: 'Komisyon Üyesi (Maliye & Denetim Uzmanı)' },
  { role: 'Üye 2', title: 'Komisyon Üyesi (Hukuk Müşaviri)' },
  { role: 'Üye 3', title: 'Komisyon Üyesi (İnsan Kaynakları & Davranış Bilimleri)' }
];

export class InterviewEngine {
  private config: InterviewConfig;
  private laws: LawResource[];
  private currentStage: InterviewStage = 'welcome';
  private stepCount: number = 0;
  private candidateAnswers: { question: string; answer: string; score: number }[] = [];

  constructor(config: InterviewConfig, laws: LawResource[]) {
    this.config = config;
    this.laws = laws;
  }

  // İlk karşılama mesajını üretir (1. Sembolik Üye)
  public getInitialGreeting(): ChatMessage {
    const candidateName = this.config.candidateName ? `Sayın ${this.config.candidateName}` : 'Sayın Aday';

    const selectedLawTitles = this.laws
      .filter(l => this.config.selectedLaws.includes(l.id))
      .map(l => l.code)
      .slice(0, 3)
      .join(', ');

    return {
      id: `msg-${Date.now()}-0`,
      role: 'commission',
      speakerIndex: 0, // 1. Sembolik Kişi
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stage: 'welcome',
      content: `${candidateName}, mülakata hoş geldiniz.

Önünüzdeki başvuru dosyası ve ilan şartları incelenmiştir. Masadaki mevzuat gündeminde yer alan **${selectedLawTitles || 'ilgili kanunlar'}** çerçevesinde alan bilginiz ve muhakeme kabiliyetiniz değerlendirilecektir.

**İlk Soru:**
Kendinizi, eğitiminizi ve bu alandaki kariyer hedefinizi kısaca özetler misiniz? Buyrun, dinliyoruz.`
    };
  }

  // Kullanıcının cevabına göre komisyonun sonraki hamlesini belirler
  public processCandidateResponse(candidateText: string, currentStage: InterviewStage): NextStepResult {
    this.stepCount++;
    const activeLaws = this.laws.filter(l => this.config.selectedLaws.includes(l.id));
    const fallbackLaw = activeLaws[0] || this.laws[0];

    // Cevabın kalitesini basit heuristiklerle analiz edelim (kelime sayısı, anahtar kelime eşleşmesi)
    const wordCount = candidateText.trim().split(/\s+/).length;
    let accuracyScore = 70;
    if (wordCount > 35) accuracyScore += 15;
    if (wordCount < 10) accuracyScore -= 25;
    
    // Hukuk ve mevzuat kelimeleri geçiyor mu?
    const hasLawKeywords = /(kanun|madde|hüküm|mevzuat|sorumluluk|yetki|müfettiş|denetim|tutanak|rapor|hukuk|anayasa|usul|kamu)/i.test(candidateText);
    if (hasLawKeywords) accuracyScore += 10;
    accuracyScore = Math.min(98, Math.max(45, accuracyScore));

    this.candidateAnswers.push({
      question: `Aşama ${currentStage}`,
      answer: candidateText,
      score: accuracyScore
    });

    let nextStage: InterviewStage = currentStage;
    let speaker = COMMISSION_ROLES[1].title;
    let replyContent = '';
    let referencedLawSnippet: { lawCode: string; articleNumber: string; snippet: string } | undefined = undefined;
    let tip = '';

    switch (currentStage) {
      case 'welcome':
      case 'introduction': {
        nextStage = 'legal_theory';
        speaker = COMMISSION_ROLES[1].title; // Maliye/Hukuk Üyesi
        
        // Rastgele veya ilk kanundan kritik bir madde seç
        const randomArticle = fallbackLaw.articles[0] || {
          articleNumber: 'Madde 3',
          title: 'İspat ve Gerçek Mahiyet',
          text: 'Vergilendirmede vergiyi doğuran olay ve bu olaya ilişkin muamelelerin gerçek mahiyeti esastır.',
          relevance: 'Temel prensip'
        };

        referencedLawSnippet = {
          lawCode: fallbackLaw.code,
          articleNumber: randomArticle.articleNumber,
          snippet: randomArticle.text
        };

        tip = 'Komisyona cevap verirken kanun numarası veya madde adını anmak size ekstra puan kazandırır.';

        replyContent = `Teşekkür ederiz. İfade kabiliyetiniz ve motivasyonunuz komisyonumuzca not edildi. 

Şimdi doğrudan mesleki yeterlilik ve mevzuat bilginize geçelim. Masamızdaki kanun kütüphanenizden "${fallbackLaw.title} (${fallbackLaw.code})" üzerinde duralım.

Sorumuz şu: **${fallbackLaw.code} ${randomArticle.articleNumber}** kapsamında yer alan **"${randomArticle.title}"** konusunu nasıl yorumlarsınız? Bir denetim/soruşturma esnasında bu hüküm müfettişin elini nasıl yönlendirir?`;
        break;
      }

      case 'legal_theory': {
        nextStage = 'followup_deep';
        speaker = COMMISSION_ROLES[2].title; // Hukuk Müşaviri

        const secondLaw = activeLaws[1] || fallbackLaw;
        const secondArticle = secondLaw.articles[1] || secondLaw.articles[0];

        referencedLawSnippet = {
          lawCode: secondLaw.code,
          articleNumber: secondArticle.articleNumber,
          snippet: secondArticle.text
        };

        tip = 'Komisyon üyesi verdiğiniz cevabı daraltıp köşeye sıkıştırmaya çalışabilir; soğukkanlılığınızı koruyun.';

        replyContent = `Cevabınız fena değil, teorik çerçeveye değindiniz. Ancak bir müfettiş adayı olarak konuyu biraz daha derinleştirmemiz gerekiyor.

${candidateText.length > 100 ? 'Az önce bahsettiğiniz ayrıntıyı dikkate alarak' : 'Verdiğiniz kısa izahatın üzerine'}, şu kritik noktayı netleştirelim:

Eğer mükellef veya ilgili kamu görevlisi kanunun aradığı şartları şeklen yerine getirmiş gibi gösterip, özünde kanunun arkasından dolanmışsa (${secondLaw.code} ${secondArticle.articleNumber} bağlamında), salt şekli evraklar sizi bağlar mı? Yoksa iktisadi ve fiili gerçeği mi ararsınız? Bu süreçte ispat külfeti kime aittir?`;
        break;
      }

      case 'followup_deep': {
        nextStage = 'case_study';
        speaker = COMMISSION_ROLES[0].title; // Başkan tekrar devralır

        const caseLaw = activeLaws.find(l => l.code.includes('VUK') || l.code.includes('5018') || l.code.includes('657')) || fallbackLaw;
        
        tip = 'Olay sorularında adım adım (kronolojik) aksiyon planı sunmak en yüksek puanı getirir.';

        replyContent = `Güzel, hukuk normlarının amacına ve lafzına uygun bir yaklaşım sergilediniz. Şimdi size somut bir **Denetim Vakası (Case Study)** sunuyoruz:

Görevlendirildiğiniz bir teftiş/inceleme esnasında, kurumun en üst düzey bürokratının veya teftiş edilen şirketin yönetim kurulu başkanının, harcama kalemlerinde veya faturalarda kaynağı belirsiz ciddi meblağları kişisel hesaplarına aktardığına dair güçlü delillere ulaştınız. Ancak inceleme henüz bitmeden, ilgili kişi sizi makamına davet edip "raporunuzdaki bazı tespitleri yumuşatmanız" yönünde örtülü bir baskıda bulundu.

**Soru:**
1) Maddi olayın tespitinde hangi tutanak ve belgeleri derhal güvenceye alırsınız?
2) Karşılaştığınız bu baskı veya kanunsuz talep karşısında 657/5018 sayılı mevzuat ve teftiş etiği uyarınca ilk 24 saatteki hareket tarzınız ne olur?`;
        break;
      }

      case 'case_study': {
        nextStage = 'ethics_stress';
        speaker = COMMISSION_ROLES[3].title; // İK ve Davranış Bilimleri

        tip = 'Stres ve etik sorularında hem devlete sadakat hem de hukuki güvence dengesini kurun.';

        replyContent = `Çok net ve cesur bir tavır. Müfettişlik mesleğinin omurgası bağımsızlıktır; tutumunuz bu açıdan tatmin edici.

Son sorumuz ise **Kriz Yönetimi ve Mesleki Yargı** üzerine:

Bir denetim heyetinde kıdemsiz müfettiş yardımcısı olarak yer alıyorsunuz. Heyet başkanınız olan kıdemli üstat, incelediğiniz raporda bariz bir suç unsurunu (örneğin TCK 247 zimmet veya VUK 359 sahte belge kullanımı) "kurumun yıpranmaması gerekçesiyle" rapora yazmamayı tercih ettiğini söyledi ve sizin de muhalefet şerhi koymamanızı rica etti.

Kıdem silsilesi, meslek teamülleri ve hukuki vicdanınız arasında kaldığınız bu an için tavrınız ne olurdu? İmzalar mısınız, çekince mi koyarsınız, yoksa adli ihbarda mı bulunursunuz?`;
        break;
      }

      case 'ethics_stress':
      default: {
        nextStage = 'evaluation';
        speaker = COMMISSION_ROLES[0].title; // Komisyon Başkanı

        replyContent = `Sayın ${this.config.candidateName || 'Aday'}, sorularımıza verdiğiniz samimi, tutarlı ve teknik derinliği olan yanıtlar için teşekkür ederiz. 

Komisyonumuz tüm aşamaları (Mevzuat Hakimiyeti, Muhakeme Yeteneği, Temsil Kabiliyeti ve Meslek Etiği) değerlendirmeye almıştır. Oturumumuz tamamlanmıştır.

Şimdi komisyonun ortak kanaat raporunu ve puan kartınızı görüntülüyorsunuz.`;
        break;
      }
    }

    const responseMessage: ChatMessage = {
      id: `msg-${Date.now()}-${this.stepCount}`,
      role: 'commission',
      speakerTitle: speaker,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stage: nextStage,
      content: replyContent,
      referencedLaw: referencedLawSnippet,
      feedback: {
        accuracyScore: accuracyScore,
        toneScore: Math.floor(Math.random() * 15) + 82,
        tip: tip
      }
    };

    let evaluationReport: InterviewEvaluationReport | undefined = undefined;
    if (nextStage === 'evaluation') {
      evaluationReport = this.generateEvaluationReport();
    }

    return {
      message: responseMessage,
      nextStage,
      evaluationReport
    };
  }

  // Mülakat bittiğinde karne raporu üretir
  public generateEvaluationReport(): InterviewEvaluationReport {
    const totalScoreAvg = Math.round(
      this.candidateAnswers.reduce((acc, curr) => acc + curr.score, 0) / Math.max(1, this.candidateAnswers.length)
    );

    const legalKnowledgeScore = Math.min(96, Math.max(60, totalScoreAvg + 2));
    const logicalReasoningScore = Math.min(98, Math.max(65, totalScoreAvg - 1));
    const expressionScore = Math.min(95, Math.max(70, totalScoreAvg + 4));
    const ethicsScore = Math.min(100, Math.max(75, totalScoreAvg + 3));

    const finalScore = Math.round((legalKnowledgeScore + logicalReasoningScore + expressionScore + ethicsScore) / 4);

    let verdict: 'BAŞARILI' | 'YEDEKLERDE' | 'YETERSİZ' = 'BAŞARILI';
    if (finalScore < 70) verdict = 'YETERSİZ';
    else if (finalScore < 80) verdict = 'YEDEKLERDE';

    return {
      overallScore: finalScore,
      verdict,
      candidateName: this.config.candidateName || 'Aday',
      position: this.config.positionTitle || 'Müfettiş Yardımcılığı',
      institution: this.config.targetInstitution || 'Hazine ve Maliye Bakanlığı',
      scores: {
        legalKnowledge: legalKnowledgeScore,
        logicalReasoning: logicalReasoningScore,
        expressionAndDiction: expressionScore,
        ethicsAndStressManagement: ethicsScore
      },
      keyStrengths: [
        'Mevzuat maddelerine ve kanuni kavramlara hakimiyet',
        'Stres ve otorite baskısı altında hukukun üstünlüğünden ödün vermeyen duruş',
        'Cevapları kronolojik ve sistematik gerekçelendirme becerisi'
      ],
      areasToDevelop: [
        'Özel ceza kanunlarındaki zamanaşımı ve dava süreleri üzerine ek tekrar yapılmalı',
        'Denetim tutanağı tanziminde somut delil tasnifini daha detaylı formüle etmeli'
      ],
      commissionNotes: `Adayın ${this.config.targetInstitution} bünyesindeki göreve ve müfettişlik nosyonuna hazır olduğu, ifade yeteneğinin mesleki vakar ile örtüştüğü müşahede edilmiştir.`,
      recommendedLawArticles: [
        '213 Sayılı VUK Madde 359 (Kaçakçılık)',
        '5018 Sayılı Kanun Madde 8 (Hesap Verme Sorumluluğu)',
        '657 Sayılı Kanun Madde 137 (Görevden Uzaklaştırma)'
      ]
    };
  }
}
