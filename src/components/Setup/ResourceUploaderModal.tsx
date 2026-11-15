import React, { useState } from 'react';
import { LawResource, ExternalResource } from '../../types';
import { 
  PlusCircle, 
  X, 
  FileText, 
  Scale, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ResourceUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLaw: (law: LawResource) => void;
  onAddExternalResource: (res: ExternalResource) => void;
}

export const ResourceUploaderModal: React.FC<ResourceUploaderModalProps> = ({
  isOpen,
  onClose,
  onAddLaw,
  onAddExternalResource
}) => {
  const [activeTab, setActiveTab] = useState<'law' | 'external'>('law');

  // Kanun Form State
  const [lawCode, setLawCode] = useState('');
  const [lawTitle, setLawTitle] = useState('');
  const [lawCategory, setLawCategory] = useState<'maliye' | 'hukuk' | 'iktisat' | 'kamu_yonetimi' | 'bankacilik' | 'diger'>('hukuk');
  const [articleNumber, setArticleNumber] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleText, setArticleText] = useState('');
  const [articleRelevance, setArticleRelevance] = useState('');

  // Harici Kaynak Form State
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'teblig' | 'genelge' | 'makale' | 'vaka_notu' | 'yonetmelik'>('teblig');
  const [resSource, setResSource] = useState('');
  const [resContent, setResContent] = useState('');

  if (!isOpen) return null;

  const handleSaveLaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawTitle.trim() || !articleText.trim()) return;

    const newLaw: LawResource = {
      id: `custom-law-${Date.now()}`,
      code: lawCode.trim() || 'Özel Mevzuat',
      title: lawTitle.trim(),
      category: lawCategory,
      description: 'Kullanıcı tarafından sisteme eklenen mevzuat metni.',
      isCustom: true,
      articles: [
        {
          id: `art-${Date.now()}`,
          articleNumber: articleNumber.trim() || 'Madde 1',
          title: articleTitle.trim() || 'Genel Hüküm',
          text: articleText.trim(),
          relevance: articleRelevance.trim() || 'Kullanıcı tarafından eklenen özel inceleme maddesi.'
        }
      ]
    };

    onAddLaw(newLaw);
    onClose();
  };

  const handleSaveExternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resContent.trim()) return;

    const newRes: ExternalResource = {
      id: `custom-res-${Date.now()}`,
      title: resTitle.trim(),
      type: resType,
      source: resSource.trim() || 'Kullanıcı Notu',
      content: resContent.trim(),
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onAddExternalResource(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Başlık */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Yeni Kaynak veya Kanun Yükle</h2>
              <p className="text-xs text-slate-400">Yapay zeka simülasyonuna özel kanun veya tebliğ ekleyin</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('law')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'law'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Kanun / Kanun Maddesi</span>
          </button>

          <button
            onClick={() => setActiveTab('external')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'external'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kanun Dışı Kaynak (Tebliğ / Not)</span>
          </button>
        </div>

        {/* Kanun Formu */}
        {activeTab === 'law' ? (
          <form onSubmit={handleSaveLaw} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Kanun Kodu</label>
                <input
                  type="text"
                  placeholder="Örn: 4734 Sayılı KİK"
                  value={lawCode}
                  onChange={(e) => setLawCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Kategori</label>
                <select
                  value={lawCategory}
                  onChange={(e: any) => setLawCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="hukuk">Hukuk & İdare</option>
                  <option value="maliye">Maliye & Vergi</option>
                  <option value="iktisat">İktisat</option>
                  <option value="kamu_yonetimi">Kamu Yönetimi</option>
                  <option value="bankacilik">Bankacılık & Finans</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Kanun Adı</label>
              <input
                type="text"
                placeholder="Örn: Kamu İhale Kanunu"
                value={lawTitle}
                onChange={(e) => setLawTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Madde No</label>
                <input
                  type="text"
                  placeholder="Örn: Madde 5"
                  value={articleNumber}
                  onChange={(e) => setArticleNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-400 mb-1">Madde Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: Temel İlkeler"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Madde Metni</label>
              <textarea
                rows={3}
                placeholder="Madde fıkralarını ve metnini buraya yapıştırınız..."
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-mono text-[11px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Kanunu Kütüphaneye ve Mülakata Ekle</span>
            </button>
          </form>
        ) : (
          /* Harici Kaynak Formu */
          <form onSubmit={handleSaveExternal} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Kaynak Türü</label>
                <select
                  value={resType}
                  onChange={(e: any) => setResType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="teblig">Genel Tebliğ</option>
                  <option value="genelge">Genelge / Yönerge</option>
                  <option value="vaka_notu">Vaka / Olay Örneği</option>
                  <option value="yonetmelik">Yönetmelik</option>
                  <option value="makale">Makale / Çalışma Notu</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Kurum / Kaynak Merci</label>
                <input
                  type="text"
                  placeholder="Örn: Gelir İdaresi Başkanlığı"
                  value={resSource}
                  onChange={(e) => setResSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Kaynak Başlığı</label>
              <input
                type="text"
                placeholder="Örn: 1 Sıra Nolu Transfer Fiyatlandırması Tebliği"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Kaynak İçeriği / Özet</label>
              <textarea
                rows={4}
                placeholder="Önemli hükümleri, tebliğ açıklamasını veya vaka notunu buraya yapıştırınız..."
                value={resContent}
                onChange={(e) => setResContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-mono text-[11px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Harici Kaynağı Mülakat Havuzuna Kaydet</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
