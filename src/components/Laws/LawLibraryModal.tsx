import React, { useState } from 'react';
import { LawResource } from '../../types';
import { 
  BookOpen, 
  Search, 
  X, 
  Scale, 
  ExternalLink,
  Filter
} from 'lucide-react';

interface LawLibraryModalProps {
  laws: LawResource[];
  isOpen: boolean;
  onClose: () => void;
}

export const LawLibraryModal: React.FC<LawLibraryModalProps> = ({
  laws,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLawId, setActiveLawId] = useState<string>(laws[0]?.id || '');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tüm Mevzuat' },
    { id: 'maliye', label: 'Maliye & Vergi' },
    { id: 'hukuk', label: 'Hukuk & Anayasa' },
    { id: 'kamu_yonetimi', label: 'Kamu & DMK' },
    { id: 'bankacilik', label: 'Bankacılık & Finans' }
  ];

  const filteredLaws = laws.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.articles.some(a => a.text.toLowerCase().includes(searchTerm.toLowerCase()) || a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeLaw = laws.find(l => l.id === activeLawId) || filteredLaws[0] || laws[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Başlık */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Hazır Kanun & Mevzuat Kütüphanesi
              </h2>
              <p className="text-xs text-slate-400">
                MüfettişX simülasyonunda kullanılan Türk mevzuatı ve teftiş normları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arama & Kategori Filtresi */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kanun adı, madde no veya metin içi ara... (Örn: Kaçakçılık, Zamanaşımı)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ana İçerik: Sol Kanun Listesi, Sağ Maddeler */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          
          {/* Sol: Kanun Listesi */}
          <div className="w-full sm:w-72 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {filteredLaws.map(law => (
              <div
                key={law.id}
                onClick={() => setActiveLawId(law.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  activeLaw?.id === law.id
                    ? 'bg-brand-950/60 border-brand-500/80 shadow-md shadow-brand-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-300">{law.code}</span>
                  <span className="text-[10px] text-slate-500">{law.articles.length} Madde</span>
                </div>
                <h4 className="text-xs font-semibold text-white mt-1 truncate">{law.title}</h4>
              </div>
            ))}
          </div>

          {/* Sağ: Seçili Kanunun Maddeleri */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeLaw ? (
              <div>
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <span className="text-xs font-bold text-brand-400 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                    {activeLaw.code}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{activeLaw.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{activeLaw.description}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Kritik Mülakat Maddeleri ({activeLaw.articles.length}):
                  </h4>

                  {activeLaw.articles.map(art => (
                    <div key={art.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-300">
                          {art.articleNumber}: {art.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                        {art.text}
                      </p>
                      {art.relevance && (
                        <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-900/50 p-2.5 rounded-xl">
                          <strong>Mülakat Değeri:</strong> {art.relevance}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Aramanıza uygun kanun bulunamadı.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
