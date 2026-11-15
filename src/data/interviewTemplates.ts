import { InterviewTemplate, SubjectField } from '../types';

export const SUBJECT_FIELDS: SubjectField[] = [
  {
    id: 'subj-maliye',
    name: 'Maliye & Vergi Hukuku',
    category: 'Mali Bilimler',
    description: 'Kamu Maliyesi, Vergi Teorisi, Türk Vergi Sistemi, VUK, Bütçe ve Maliye Politikası.',
    iconName: 'Receipt'
  },
  {
    id: 'subj-hukuk',
    name: 'Kamu & Özel Hukuk',
    category: 'Hukuk',
    description: 'Anayasa Hukuku, İdare Hukuku & İYUK, Ceza Hukuku, Borçlar ve Ticaret Hukuku.',
    iconName: 'Scale'
  },
  {
    id: 'subj-iktisat',
    name: 'İktisat & Ekonomi',
    category: 'İktisadi Bilimler',
    description: 'Mikroiktisat, Makroiktisat, Para-Banka-Kredi, Uluslararası İktisat ve Türkiye Ekonomisi.',
    iconName: 'TrendingUp'
  },
  {
    id: 'subj-muhasebe',
    name: 'Muhasebe & Finansal Raporlama',
    category: 'Finans',
    description: 'Genel Muhasebe, Mali Tablolar Analizi, Maliyet Muhasebesi ve Denetim Standartları.',
    iconName: 'BarChart3'
  },
  {
    id: 'subj-kurum',
    name: 'Kurumsal Mevzuat & Teşkilat',
    category: 'Mevzuat',
    description: 'Başvurulan kurumun teşkilat kanunu, görev alanı, vizyonu ve güncel faaliyetleri.',
    iconName: 'Building2'
  },
  {
    id: 'subj-vaka-etik',
    name: 'Denetim Vakası, Liyakat & Stres',
    category: 'Uygulama',
    description: 'Olay çözümü, kanunsuz emir ve etik ikilemler karşısında soğukkanlı karar alma yetisi.',
    iconName: 'ShieldAlert'
  }
];

export const INTERVIEW_TEMPLATES: InterviewTemplate[] = [
  {
    id: 'temp-vdk',
    title: 'Vergi Müfettiş Yardımcılığı (VDK)',
    institution: 'T.C. Hazine ve Maliye Bakanlığı Vergi Denetim Kurulu',
    category: 'Denetim & Teftiş',
    popular: true,
    description: 'A Grubu kariyer meslek mülakatı. Vergi Usul Kanunu, Türk Vergi Hukuku, muhasebe hileleri ve iktisadi yaklaşım ilkesi ağırlıklıdır.',
    defaultSubjects: ['subj-maliye', 'subj-muhasebe', 'subj-hukuk', 'subj-vaka-etik'],
    suggestedLaws: ['law-vuk-213', 'law-anayasa-1982', 'law-5018', 'law-657'],
    sampleQuestions: [
      'VUK 359 kapsamındaki Kaçakçılık fiilleri ile Vergi Ziyaı arasındaki ilişkiyi açıklayınız.',
      'İktisadi yaklaşım ilkesi (VUK Md. 3) vergi incelemelerinde müfettişe nasıl bir serbesti ve sorumluluk yükler?',
      'Vergi inceleme tutanağını imzalamaktan imtina eden mükellef hakkında izlenecek hukuki usul nedir?'
    ]
  },
  {
    id: 'temp-sayistay',
    title: 'Sayıştay Denetçi Yardımcılığı',
    institution: 'T.C. Sayıştay Başkanlığı',
    category: 'Denetim & Teftiş',
    popular: true,
    description: 'TBMM adına kamu idarelerini mali denetime tabi tutan anayasal yüksek yargı ve denetim organı mülakatı.',
    defaultSubjects: ['subj-maliye', 'subj-hukuk', 'subj-muhasebe', 'subj-kurum'],
    suggestedLaws: ['law-5018', 'law-anayasa-1982', 'law-657', 'law-iyuk-2577'],
    sampleQuestions: [
      '5018 sayılı Kanun kapsamında harcama yetkilisi ile muhasebe yetkilisinin sorumluluk sınırlarını karşılaştırınız.',
      'Düzenlilik denetimi ile performans denetimi arasındaki metodolojik farklar nelerdir?',
      'Sayıştay ilamlarının niteliği ve Anayasa 160. madde uyarınca kesinliği ne anlama gelir?'
    ]
  },
  {
    id: 'temp-sgk',
    title: 'SGK Müfettiş Yardımcılığı',
    institution: 'T.C. Sosyal Güvenlik Kurumu Rehberlik ve Teftiş Başkanlığı',
    category: 'Denetim & Teftiş',
    popular: false,
    description: 'Sosyal güvenlik mevzuatı, 5510 sayılı Kanun, iş hukuku, kayıt dışı istihdam ile mücadele ve sahte sigortalılık denetimleri.',
    defaultSubjects: ['subj-hukuk', 'subj-maliye', 'subj-kurum', 'subj-vaka-etik'],
    suggestedLaws: ['law-657', 'law-anayasa-1982', 'law-tck-5237'],
    sampleQuestions: [
      'Fiili çalışma olmaksızın gösterilen sigortalılık (sahte sigortalılık) durumunda müfettişin tanzim edeceği rapor türleri nelerdir?',
      'Müfettişin işyerinde yapacağı yerel denetim ve tanık dinleme yetkisinin sınırları nelerdir?'
    ]
  },
  {
    id: 'temp-idari-yargi',
    title: 'İdari Yargı Hâkim Adaylığı',
    institution: 'T.C. Adalet Bakanlığı / HSK',
    category: 'Yargı & Hukuk',
    popular: true,
    description: 'Danıştay, İdare ve Vergi Mahkemelerinde görev alacak hâkim adayları için derinlemesine usul hukuku ve idare hukuku mülakatı.',
    defaultSubjects: ['subj-hukuk', 'subj-maliye'],
    suggestedLaws: ['law-iyuk-2577', 'law-anayasa-1982', 'law-vuk-213', 'law-tck-5237'],
    sampleQuestions: [
      'İYUK 27. madde uyarınca yürütmenin durdurulması kararının şartları ve hukuk alemindeki tesirleri nelerdir?',
      'İdarenin takdir yetkisi ile yargısal denetimin sınırı olan "yerindelik denetimi yasağı"nı bir örnekle açıklayınız.'
    ]
  },
  {
    id: 'temp-bddk-spk',
    title: 'BDDK & SPK Uzman / Murakıp Yrd.',
    institution: 'BDDK / SPK Başkanlığı',
    category: 'Finans & Banka',
    popular: false,
    description: 'Bankacılık ve Sermaye Piyasası Kanunları, finansal türevler, manipülasyon ve içeriden öğrenenlerin ticareti (insider trading) incelemeleri.',
    defaultSubjects: ['subj-iktisat', 'subj-muhasebe', 'subj-hukuk', 'subj-kurum'],
    suggestedLaws: ['law-banka-5411', 'law-ttk-6102', 'law-tck-5237'],
    sampleQuestions: [
      '5411 sayılı Bankacılık Kanunu Madde 73 çerçevesinde müşteri sırrı ile banka sırrı ayrımını izah ediniz.',
      'Sermaye piyasasında örtülü kazanç aktarımı (TTK ve SPK hükümleri) incelemesinde dikkat edilecek göstergeler nelerdir?'
    ]
  },
  {
    id: 'temp-banka-teftis',
    title: 'Banka Müfettiş Yardımcılığı (Kamu & Özel Bankalar)',
    institution: 'Ziraat Bankası / Halkbank / Vakıfbank / Türkiye İş Bankası Teftiş Kurulu',
    category: 'Finans & Banka',
    popular: true,
    description: 'Şube ve genel müdürlük birim teftişi, kredi tahsis riskleri, suistimal incelemeleri ve MASAK mevzuatı.',
    defaultSubjects: ['subj-muhasebe', 'subj-iktisat', 'subj-hukuk', 'subj-vaka-etik'],
    suggestedLaws: ['law-banka-5411', 'law-ttk-6102', 'law-tck-5237'],
    sampleQuestions: [
      'Bir şube müdürünün yetki limitlerini aşarak ilişkili bir holdinge teminatsız kredi kullandırdığını teftiş sırasında tespit ettiniz. İlk 24 saatte atacağınız adımlar nelerdir?',
      'Şüpheli İşlem Bildirimi (MASAK) yükümlülüğünün ihlali halinde banka ve müfettişin sorumluluğu nedir?'
    ]
  },
  {
    id: 'temp-kaymakamlik',
    title: 'Kaymakam Adaylığı',
    institution: 'T.C. İçişleri Bakanlığı',
    category: 'Mülki İdare',
    popular: true,
    description: 'İl ve ilçe idaresi, kolluk kuvvetleri yönetimi, kriz masası, genel idare esasları ve devlet protokolü.',
    defaultSubjects: ['subj-hukuk', 'subj-kurum', 'subj-vaka-etik'],
    suggestedLaws: ['law-anayasa-1982', 'law-657', 'law-5018', 'law-tck-5237'],
    sampleQuestions: [
      'İlçede meydana gelen ani bir doğal afet veya toplumsal olayda mülki amir olarak kolluk kuvvetleri üzerindeki yetkiniz nedir?',
      '5442 sayılı İl İdaresi Kanunu uyarınca Kaymakamın genel emir çıkarma yetkisi ve sınırları nelerdir?'
    ]
  },
  {
    id: 'temp-custom',
    title: 'Özel / Diğer Mülakat Simülasyonu',
    institution: 'Kullanıcı Tanımlı Kurum / Kuruluş',
    category: 'Özel',
    popular: false,
    description: 'Kendi gireceğiniz mülakatın kurum, unvan ve ilan bilgilerini serbestçe girerek özel simülasyon başlatın.',
    defaultSubjects: ['subj-hukuk', 'subj-kurum', 'subj-vaka-etik'],
    suggestedLaws: ['law-anayasa-1982', 'law-657'],
    sampleQuestions: [
      'Kendinizi ve bu kariyer hedefine yönelmenizi sağlayan temel motivasyonu kısaca anlatır mısınız?'
    ]
  }
];
