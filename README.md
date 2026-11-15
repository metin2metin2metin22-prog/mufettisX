# MüfettişX - Yapay Zeka Destekli Mülakat Simülasyonu 🏛️⚖️

**MüfettişX**, Türkiye'nin en seçkin A Grubu kariyer meslek sınavları ve teftiş kurulları (Vergi Müfettiş Yardımcılığı, Sayıştay Denetçi Yardımcılığı, SGK Müfettişliği, İdari Yargı Hâkimliği, Banka Müfettişliği, BDDK & SPK vb.) için geliştirilmiş yeni nesil mülakat simülasyon platformudur.

---

## 🌟 Öne Çıkan Özellikler

1. **Mülakat ve Kurum Yapılandırması**
   - Popüler kariyer sınavları için hazır şablonlar (VDK, Sayıştay, SGK, İdari Yargı, Banka Teftiş vb.).
   - Özel mülakat oluşturma: Kurum, unvan ve sınav ilan metnini girerek kişiselleştirilmiş simülasyon başlatma.

2. **Yüklü Kanun Kütüphanesi & Mevzuat Entegrasyonu**
   - **213 Sayılı Vergi Usul Kanunu (VUK):** İspat, zamanaşımı, inceleme, kaçakçılık (Md. 359).
   - **1982 Türkiye Cumhuriyeti Anayasası:** Vergi ödevi (Md. 73), idari yargı (Md. 125), memur güvencesi (Md. 128), Sayıştay (Md. 160).
   - **5018 Sayılı Kamu Malî Yönetimi ve Kontrol Kanunu:** Hesap verme sorumluluğu, harcama ve muhasebe yetkilileri, iç denetim.
   - **657 Sayılı Devlet Memurları Kanunu:** Ödev ve yasaklar, disiplin cezaları, görevden uzaklaştırma.
   - **6102 Sayılı Türk Ticaret Kanunu (TTK):** Basiretli tacir, bağımsız denetim.
   - **2577 Sayılı İdari Yargılama Usulü Kanunu (İYUK):** Dava süreleri, yürütmenin durdurulması.
   - **5237 Sayılı Türk Ceza Kanunu (TCK):** Zimmet, irtikap, rüşvet, görevi kötüye kullanma.
   - **5411 Sayılı Bankacılık Kanunu:** Bankacılık sırrı ve zimmet hükümleri.

3. **Kanun Dışı Kaynaklar ve Özel Not Ekleme**
   - Adaylar istedikleri genel tebliğleri, kurum içi denetim rehberlerini veya özel ders notlarını sisteme ekleyebilir. Yapay zeka komisyonu bu kaynakları simülasyona dahil eder.

4. **Gerçekçi Komisyon Heyeti & Aşamalı Simülasyon**
   - **Aşama 1: Tanışma & Motivasyon:** Heyet Başkanı tarafından adayın karşılanması ve özgeçmiş değerlendirmesi.
   - **Aşama 2: Teorik Kanun Sorusu:** Seçilen mevzuattan doğrudan madde hükmü ve yorumu.
   - **Aşama 3: Derinleştirici Teknik Soru:** Adayın cevabındaki boşlukları yakalayan takip sorusu.
   - **Aşama 4: Denetim Vakası (Case Study):** Teftiş esnasında karşılaşılan somut olay analizi.
   - **Aşama 5: Etik & Kriz Yönetimi:** Kanunsuz emir ve baskı altında soğukkanlı karar alma.
   - **Aşama 6: Komisyon Kararı & Karne:** Mevzuat bilgisi, muhakeme yetisi, ifade ve meslek etiği üzerinden puanlama.

5. **Modüler Mimari (Oto-Cevap / Mock vs. Canlı Gemini AI)**
   - Varsayılan olarak kotasız ve hazır **Akıllı Oto-Cevap (Mock Engine)** ile çalışır.
   - Ayarlar panelinden istenildiğinde tek tıkla **Google Gemini API** moduna geçiş yapılabilir.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Depoyu klonlayın
git clone https://github.com/metin2metin2metin22-prog/mufettisX.git
cd mufettisX

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açarak simülasyonu hemen deneyimleyebilirsiniz.

---

## 🛠️ Teknoloji Yığını

- **Frontend:** React 18, TypeScript, Vite
- **Stil & Tasarım:** Tailwind CSS, Lucide Icons, Canvas Confetti
- **Yapay Zeka Altyapısı:** Google Generative AI (`@google/generative-ai`), Yerleşik Simülasyon Durum Makinesi
- **Mevzuat Motoru:** Modüler Türk Mevzuatı & RAG Bağlam Yapılandırması

---

## 📄 Lisans

MIT © MüfettişX Projesi
