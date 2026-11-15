import { LawResource, ExternalResource } from '../types';

export const INITIAL_LAWS: LawResource[] = [
  {
    id: 'law-vuk-213',
    code: '213 Sayılı VUK',
    title: 'Vergi Usul Kanunu',
    category: 'maliye',
    description: 'Vergilendirme ilkeleri, mükellef ödevleri, yoklama, inceleme, değerleme kuralları ve vergi suç-cezaları.',
    articles: [
      {
        id: 'vuk-3',
        articleNumber: 'Madde 3',
        title: 'İspat ve İktisadi Yaklaşım İlkesi',
        text: 'Vergilendirmede vergiyi doğuran olay ve bu olaya ilişkin muamelelerin gerçek mahiyeti esastır. Vergiyi doğuran olay ve hukuki muamelelerin gerçek mahiyeti yemin hariç her türlü delille ispatlanabilir.',
        relevance: 'Vergi müfettişliği mülakatlarının 1 numaralı soru kaynağıdır; şekilciliğe karşı iktisadi yaklaşım ilkesini düzenler.'
      },
      {
        id: 'vuk-114',
        articleNumber: 'Madde 114',
        title: 'Tarh Zamanaşımı',
        text: 'Vergi alacağının doğduğu takvim yılını takip eden yılın başından başlayarak beş yıl içinde tarh ve mükellefe tebliğ edilmeyen vergiler zamanaşımına uğrar.',
        relevance: 'Vergi incelemelerinde süre sınırlarının tespiti ve tarhiyat hakkının düşmesi açısından esastır.'
      },
      {
        id: 'vuk-134',
        articleNumber: 'Madde 134',
        title: 'Vergi İncelemesinin Amacı',
        text: 'Vergi incelemesinden maksat, ödenmesi gereken vergilerin doğruluğunu araştırmak, tespit etmek ve sağlamaktır. İncelemeye yetkili olanlar, mükellefin aleyhine olan hususlar kadar lehine olan hususları da dikkate alırlar.',
        relevance: 'Müfettişin tarafsızlık ve mükellef lehine delil toplama yükümlülüğünün yasal dayanağıdır.'
      },
      {
        id: 'vuk-344',
        articleNumber: 'Madde 344',
        title: 'Vergi Ziyaı Cezası',
        text: 'Vergi ziyaına sebebiyet verildiği hallerde, ziyaa uğratılan vergi tutarı kadar vergi ziyaı cezası kesilir. Ziyaa 359 uncu maddede yazılı fiillerle sebebiyet verilmesi halinde ceza üç kat olarak uygulanır.',
        relevance: 'Vergi kaybı durumunda uygulanacak temel idari yaptırımdır.'
      },
      {
        id: 'vuk-359',
        articleNumber: 'Madde 359',
        title: 'Kaçakçılık Suçları ve Cezaları',
        text: 'Vergi kanunlarına göre tutulan veya düzenlenen ve saklanma ve ibraz mecburiyeti bulunan defter ve kayıtlarda hesap ve muhasebe hileleri yapanlar, sahte veya muhteviyatı itibariyle yanıltıcı belge (SMİYB) düzenleyenler veya kullananlar hakkında hapis cezası öngörülür.',
        relevance: 'Hürriyeti bağlayıcı ceza gerektiren adli vergi suçlarının merkezidir; Vergi Suçu Raporu (VSR) tanziminde temeldir.'
      }
    ]
  },
  {
    id: 'law-anayasa-1982',
    code: '1982 Anayasası',
    title: 'Türkiye Cumhuriyeti Anayasası',
    category: 'hukuk',
    description: 'Devletin temel organları, temel hak ve hürriyetler, mali ve ekonomik hükümler ile yargı denetimi.',
    articles: [
      {
        id: 'ay-73',
        articleNumber: 'Madde 73',
        title: 'Vergi Ödevi ve Yasallık İlkesi',
        text: 'Herkes, kamu giderlerini karşılamak üzere, mali gücüne göre, vergi ödemekle yükümlüdür. Vergi yükünün adaletli ve dengeli dağılımı, maliye politikasının sosyal amacıdır. Vergi, resim, harç ve benzeri mali yükümlülükler kanunla konulur, değiştirilir veya kaldırılır.',
        relevance: 'Maliye ve Hukuk mülakatlarının vazgeçilmez Anayasal ilkesidir.'
      },
      {
        id: 'ay-125',
        articleNumber: 'Madde 125',
        title: 'İdari İşlemlerde Yargı Yolu ve Tazmin',
        text: 'İdarenin her türlü eylem ve işlemlerine karşı yargı yolu açıktır. İdare, kendi eylem ve işlemlerinden doğan zararı ödemekle yükümlüdür.',
        relevance: 'İdari yargı ve kamu denetçiliği açısından hukuk devleti teminatıdır.'
      },
      {
        id: 'ay-128',
        articleNumber: 'Madde 128',
        title: 'Kamu Hizmeti Görevlileriyle İlgili Hükümler',
        text: 'Devletin, kamu iktisadi teşebbüsleri ve diğer kamu tüzelkişilerinin genel idare esaslarına göre yürütmekle yükümlü oldukları kamu hizmetlerinin gerektirdiği asli ve sürekli görevler, memurlar ve diğer kamu görevlileri eliyle görülür.',
        relevance: 'Kariyer meslek memurluğunun Anayasal statüsü ve güvencesidir.'
      },
      {
        id: 'ay-160',
        articleNumber: 'Madde 160',
        title: 'Sayıştay Denetimi',
        text: 'Sayıştay, merkezi yönetim bütçesi kapsamındaki kamu idareleri ile sosyal güvenlik kurumlarının bütün gelir ve giderleri ile mallarını Türkiye Büyük Millet Meclisi adına denetlemek ve sorumluların hesap ve işlemlerini kesin hükme bağlamakla görevlidir.',
        relevance: 'Sayıştay denetçiliği ve dış denetim mülakatlarının kurucu hükmüdür.'
      }
    ]
  },
  {
    id: 'law-5018',
    code: '5018 Sayılı Kanun',
    title: 'Kamu Malî Yönetimi ve Kontrol Kanunu',
    category: 'maliye',
    description: 'Bütçe hazırlama, uygulama, harcama yetkilisi, muhasebe yetkilisi, iç denetim ve mali saydamlık esasları.',
    articles: [
      {
        id: '5018-8',
        articleNumber: 'Madde 8',
        title: 'Hesap Verme Sorumluluğu',
        text: 'Her türlü kamu kaynağının elde edilmesi ve kullanılmasında görevli ve yetkili olanlar, kaynakların etkili, ekonomik, verimli ve hukuka uygun olarak elde edilmesinden, kullanılmasından, muhasebeleştirilmesinden ve raporlanmasından sorumludur.',
        relevance: 'Kamu denetimi ve iç/dış denetçilerin dayandığı ana hesap verebilirlik ilkesidir.'
      },
      {
        id: '5018-31',
        articleNumber: 'Madde 31',
        title: 'Harcama Yetkisi ve Yetkilisi',
        text: 'Bütçeyle ödenek tahsis edilen her bir harcama biriminin en üst yöneticisi harcama yetkilisidir. Harcama yetkilileri, harcama talimatlarının bütçe ilke ve esaslarına, kanun ve diğer mevzuata uygun olmasından sorumludur.',
        relevance: 'Kamudaki harcama süreçlerinin karar mercisini belirler.'
      },
      {
        id: '5018-60',
        articleNumber: 'Madde 60-61',
        title: 'Mali Hizmetler Birimi ve Muhasebe Yetkilisi',
        text: 'Muhasebe yetkilisi; gelirlerin ve alacakların tahsili, giderlerin hak sahiplerine ödenmesi ve bunların muhasebeleştirilmesinden sorumludur. Ödeme emri belgesinde yetkili imzaların tamam olup olmadığını denetler.',
        relevance: 'Harcama yetkilisi ile muhasebe yetkilisi arasındaki ayrılık ve kontrol mekanizmasıdır.'
      },
      {
        id: '5018-63',
        articleNumber: 'Madde 63',
        title: 'İç Denetim ve İç Denetçinin Bağımsızlığı',
        text: 'İç denetim, kamu idaresinin çalışmalarına değer katmak ve geliştirmek için kaynakların ekonomiklik, etkililik ve verimlilik esaslarına göre yönetilip yönetilmediğini değerlendirmek üzere yapılan nesnel bir güvence sağlama ve danışmanlık faaliyetidir.',
        relevance: 'Teftiş ve iç denetim kavram farkını açıklarken temel alınan kanuni tanımdır.'
      }
    ]
  },
  {
    id: 'law-657',
    code: '657 Sayılı DMK',
    title: 'Devlet Memurları Kanunu',
    category: 'kamu_yonetimi',
    description: 'Kamu personel rejimi, memur hak ve ödevleri, yasaklar, disiplin cezaları ve görevden uzaklaştırma.',
    articles: [
      {
        id: '657-6',
        articleNumber: 'Madde 6-11',
        title: 'Devlet Memurlarının Ödev ve Sorumlulukları',
        text: 'Sadakat, tarafsızlık ve devlete bağlılık esastır. Devlet memurları siyasi partiye üye olamazlar. Amirler maiyetindeki memurlara kanunlara aykırı emir veremez; kanunsuz emir halinde memur durumu amirine bildirir.',
        relevance: 'Mülakatlardaki "Kanunsuz emir aldığınızda ne yaparsınız?" stres sorusunun cevabıdır.'
      },
      {
        id: '657-125',
        articleNumber: 'Madde 125',
        title: 'Disiplin Cezaları',
        text: 'Devlet memurlarına verilecek disiplin cezaları: Uyarma, Kınama, Aylıktan Kesme, Kademe İlerlemesinin Durdurulması ve Devlet Memurluğundan Çıkarma cezalarıdır.',
        relevance: 'Disiplin soruşturmalarında ve teftiş raporlarında müfettişin önerdiği ceza skalasıdır.'
      },
      {
        id: '657-137',
        articleNumber: 'Madde 137-138',
        title: 'Görevden Uzaklaştırma ve Müfettiş Yetkisi',
        text: 'Görevden uzaklaştırma, Devlet kamu hizmetlerinin gerektirdiği hallerde, görevi başında kalmasında sakınca görülecek Devlet memurları hakkında alınan ihtiyati bir tedbirdir. Müfettişler tahkikat sırasında doğrudan görevden uzaklaştırabilirler.',
        relevance: 'Müfettişlik mesleğinin en kritik operasyonel yetkilerinden biridir.'
      }
    ]
  },
  {
    id: 'law-iyuk-2577',
    code: '2577 Sayılı İYUK',
    title: 'İdari Yargılama Usulü Kanunu',
    category: 'hukuk',
    description: 'İptal ve tam yargı davaları, dava açma süreleri, yürütmenin durdurulması ve kanun yolları.',
    articles: [
      {
        id: 'iyuk-2',
        articleNumber: 'Madde 2',
        title: 'İdari Dava Türleri',
        text: 'İptal davaları: İdari işlemler hakkında yetki, şekil, sebep, konu ve maksat yönlerinden biri ile hukuka aykırı olduklarından dolayı iptalleri için açılan davalardır. Tam yargı davaları: İdari eylem ve işlemlerden dolayı kişisel hakları doğrudan muhtel olanlar tarafından açılan davalardır.',
        relevance: 'İdari yargı ve müfettişlik mülakatlarının temel usul bilgisidir.'
      },
      {
        id: 'iyuk-7',
        articleNumber: 'Madde 7',
        title: 'Dava Açma Süreleri',
        text: 'Dava açma süresi, özel kanunlarında ayrı süre gösterilmeyen hallerde Danıştayda ve idare mahkemelerinde altmış ve vergi mahkemelerinde otuz gündür.',
        relevance: 'Vergi ve idare mahkemesi süre farkı mülakatlarda çok sık sorulur.'
      },
      {
        id: 'iyuk-27',
        articleNumber: 'Madde 27',
        title: 'Yürütmenin Durdurulması',
        text: 'İdari mahkemeler, idari işlemin uygulanması halinde telafisi güç veya imkânsız zararların doğması ve idari işlemin açıkça hukuka aykırı olması şartlarının birlikte gerçekleşmesi durumunda gerekçe göstererek yürütmenin durdurulmasına karar verebilirler.',
        relevance: 'Yürütmenin durdurulması için iki kümülatif şart her aday tarafından ezbere bilinmelidir.'
      }
    ]
  },
  {
    id: 'law-ttk-6102',
    code: '6102 Sayılı TTK',
    title: 'Türk Ticaret Kanunu',
    category: 'hukuk',
    description: 'Ticari işletme, şirketler hukuku, anonim ve limited şirket organları, denetim ve tacir yükümlülükleri.',
    articles: [
      {
        id: 'ttk-18',
        articleNumber: 'Madde 18',
        title: 'Basiretli İş Adamı İlkesi',
        text: 'Her tacirin, ticaretine ait bütün faaliyetlerinde basiretli bir iş adamı gibi hareket etmesi gerekir. Tacirler arasındaki diğer tarafa temerrüt veya fesih ihbarlarının noter veya kayıtlı elektronik posta ile yapılması zorunludur.',
        relevance: 'Ticaret hukuku ve şirket denetiminde objektif özen ölçüsünü tayin eder.'
      },
      {
        id: 'ttk-397',
        articleNumber: 'Madde 397',
        title: 'Anonim Şirketlerde Denetim',
        text: 'Cumhurbaşkanınca belirlenen ölçütleri aşan anonim şirketler bağımsız denetime tabidir. Bağımsız denetçi, şirketin finansal tablolarının Türkiye Denetim Standartlarına uygunluğunu ve gerçeği dürüst bir şekilde yansıtıp yansıtmadığını inceler.',
        relevance: 'SPK, BDDK ve VDK teftişinde kurumsal yönetim ilkelerinin odağıdır.'
      }
    ]
  },
  {
    id: 'law-tck-5237',
    code: '5237 Sayılı TCK',
    title: 'Türk Ceza Kanunu (Kamu İdaresine Karşı Suçlar)',
    category: 'hukuk',
    description: 'Kamu görevlilerinin işleyebileceği suçlar: Zimmet, irtikap, rüşvet, görevi kötüye kullanma ve sır saklama.',
    articles: [
      {
        id: 'tck-247',
        articleNumber: 'Madde 247',
        title: 'Zimmet Suçu',
        text: 'Görevi nedeniyle zilyetliği kendisine devredilmiş olan veya koruma ve gözetimiyle yükümlü olduğu malı kendisinin veya başkasının zimmetine geçiren kamu görevlisi hapis cezası ile cezalandırılır.',
        relevance: 'Müfettiş soruşturmalarında kamu zararı ve adli ihbarın en temel dayanağıdır.'
      },
      {
        id: 'tck-250',
        articleNumber: 'Madde 250',
        title: 'İrtikap Suçu',
        text: 'Görevinin sağladığı nüfuzu kötüye kullanmak suretiyle, kendisine veya başkasına yarar sağlanmasına veya bu yolda vaatte bulunulmasına bir kimseyi icbar eden (zorlayan) veya hatasından yararlanan kamu görevlisi cezalandırılır.',
        relevance: 'Rüşvet ile irtikap arasındaki rıza ve cebir farkı klasik mülakat sorusudur.'
      },
      {
        id: 'tck-257',
        articleNumber: 'Madde 257',
        title: 'Görevi Kötüye Kullanma',
        text: 'Kanunda ayrıca suç olarak tanımlanan haller dışında, görevinin gereklerine aykırı hareket etmek suretiyle, kişilerin mağduriyetine veya kamunun zararına neden olan kamu görevlisi cezalandırılır.',
        relevance: 'Genel ve tamamlayıcı ceza hükmüdür; kamu zararı unsuru esastır.'
      }
    ]
  },
  {
    id: 'law-banka-5411',
    code: '5411 Sayılı Kanun',
    title: 'Bankacılık Kanunu',
    category: 'bankacilik',
    description: 'Banka kuruluş ve faaliyetleri, gözetim, sır saklama, risk yönetimi ve bankacılık suçları.',
    articles: [
      {
        id: 'banka-73',
        articleNumber: 'Madde 73',
        title: 'Sırların Saklanması',
        text: 'Sıfat ve görevleri dolayısıyla öğrendikleri bankalara veya müşterilerine ait sırları bu Kanuna ve özel kanunlarına göre yetkili olanlardan başkasına açıklayamazlar. Bu yükümlülük görevden ayrıldıktan sonra da devam eder.',
        relevance: 'Banka müfettişliği ve BDDK mülakatlarında meslek ahlakının temelidir.'
      },
      {
        id: 'banka-160',
        articleNumber: 'Madde 160',
        title: 'Bankacılık Zimmeti',
        text: 'Görevi dolayısıyla bankaya ait para veya para hükmündeki evrak ve senetleri veya diğer malları kendisinin veya başkasının zimmetine geçiren banka mensupları ağır hapis ve adli para cezası ile cezalandırılır.',
        relevance: 'Özel ceza normu olarak genel TCK zimmetinden ayrılan yönleri sıkça sorgulanır.'
      }
    ]
  }
];

export const INITIAL_EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    id: 'res-1',
    title: 'Vergi Denetim Kurulu (VDK) Küçük ve Orta Ölçekli Mükellefler Grup Başkanlığı Denetim Rehberi',
    type: 'yonetmelik',
    source: 'VDK Başkanlığı Genelgesi',
    content: 'İnceleme tutanaklarında mükellefe itiraz hakkının hatırlatılması, sahte belge kullanımında kast ve bilerek kullanma kıstasları (306 seri nolu VUK Genel Tebliği).',
    dateAdded: '2026-01-10'
  },
  {
    id: 'res-2',
    title: 'Sayıştay Performans ve Düzenlilik Denetimi Rehberi (INTOSAI Standartları)',
    type: 'makale',
    source: 'Sayıştay Araştırma ve Geliştirme Birimi',
    content: 'Mali tabloların güvenilirliği ile kamu idarelerinin gelir, gider ve mallarına ilişkin hesap ve işlemlerinin kanunlara ve diğer hukuki düzenlemelere uygunluğunun incelenmesi usulü.',
    dateAdded: '2026-02-15'
  },
  {
    id: 'res-3',
    title: 'Kamu Görevlileri Etik Davranış İlkeleri ile Başvuru Usul ve Esasları Hakkında Yönetmelik',
    type: 'yonetmelik',
    source: 'Resmi Gazete / Kamu Görevlileri Etik Kurulu',
    content: 'Hediye alma yasağı, çıkar çatışmasından kaçınma, kamu malları ve kaynaklarının kullanımı ile nezaket ve saygı kuralları.',
    dateAdded: '2026-03-01'
  },
  {
    id: 'res-4',
    title: 'Örnek Teftiş Vakası: Örtülü Sermaye ve Transfer Fiyatlandırması Yoluyla Örtülü Kazanç Dağıtımı',
    type: 'vaka_notu',
    source: 'Müfettişlik Mülakat Havuzu',
    content: 'Kurumlar Vergisi Kanunu Madde 12 ve 13 kapsamında ilişkili kişilere emsallere uygunluk ilkesine aykırı fiyatla mal/hizmet satışı yapılması durumunda tarhiyat ve KDV düzeltmesi senaryosu.',
    dateAdded: '2026-04-12'
  }
];
