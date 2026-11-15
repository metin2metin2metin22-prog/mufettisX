import React from 'react';

interface AnonymousBenchProps {
  activeSpeakerIndex: number; // 0, 1, 2, 3, 4
}

// 5 Hazır Telifsiz Silüet Aseti (Kullanıcının yüklediği asete birebir uygun)
const COMMITTEE_AVATARS = [
  '/avatars/avatar-1.png', // Kullanıcının yüklediği orijinal silüet
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
  '/avatars/avatar-5.svg',
];

export const AnonymousBench: React.FC<AnonymousBenchProps> = ({
  activeSpeakerIndex
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 shadow-md backdrop-blur-sm">
      <div className="max-w-xl mx-auto flex items-center justify-between sm:justify-center sm:gap-6">
        {COMMITTEE_AVATARS.map((avatarSrc, index) => {
          const isSpeaking = activeSpeakerIndex === index;

          return (
            <div 
              key={index}
              className="flex flex-col items-center group relative transition-all duration-300"
            >
              {/* Yuvarlak Silüet Aset Çerçevesi */}
              <div 
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden transition-all duration-300 relative ${
                  isSpeaking
                    ? 'ring-4 ring-brand-500 shadow-lg shadow-brand-500/40 scale-110 z-10'
                    : 'ring-2 ring-slate-700 opacity-60 hover:opacity-90'
                }`}
              >
                <img
                  src={avatarSrc}
                  alt={`Heyet Üyesi ${index + 1}`}
                  className="w-full h-full object-cover bg-white"
                  onError={(e) => {
                    // Fallback to SVG if PNG fails
                    (e.target as HTMLImageElement).src = `/avatars/avatar-${(index % 5) + 1}.svg`;
                  }}
                />
              </div>

              {/* Konuşan Üye Baloncuk Ok Belirteci */}
              {isSpeaking && (
                <div className="flex flex-col items-center mt-1.5 animate-in fade-in duration-200">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping mb-0.5"></span>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
