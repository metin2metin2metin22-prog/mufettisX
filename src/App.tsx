import React, { useState, useEffect } from 'react';
import { 
  InterviewConfig, 
  LawResource, 
  ExternalResource 
} from './types';
import { INITIAL_LAWS, INITIAL_EXTERNAL_RESOURCES } from './data/lawsData';
import { INTERVIEW_TEMPLATES } from './data/interviewTemplates';
import { SUBJECT_FIELDS } from './data/subjectFields';
import { GeminiService } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { SimpleHome } from './components/Home/SimpleHome';
import { SimulationRoom } from './components/Simulation/SimulationRoom';
import { LawLibraryModal } from './components/Laws/LawLibraryModal';
import { ResourceUploaderModal } from './components/Setup/ResourceUploaderModal';
import { SettingsModal } from './components/SettingsModal';

const LAWS_STORAGE_KEY = 'mufettisx_saved_laws';
const RES_STORAGE_KEY = 'mufettisx_saved_resources';

export const App: React.FC = () => {
  const geminiService = GeminiService.getInstance();

  // State (Gemini AI varsayılan olarak aktiftir)
  const [currentView, setCurrentView] = useState<'setup' | 'simulation'>('setup');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Kanunlar ve Kaynaklar
  const [laws, setLaws] = useState<LawResource[]>(() => {
    const saved = localStorage.getItem(LAWS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LAWS;
  });

  const [externalResources, setExternalResources] = useState<ExternalResource[]>(() => {
    const saved = localStorage.getItem(RES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXTERNAL_RESOURCES;
  });

  // Modallar
  const [isLawLibraryOpen, setIsLawLibraryOpen] = useState<boolean>(false);
  const [isResourceUploaderOpen, setIsResourceUploaderOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Kanunları yerel depolamaya kaydet
  useEffect(() => {
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
  }, [laws]);

  useEffect(() => {
    localStorage.setItem(RES_STORAGE_KEY, JSON.stringify(externalResources));
  }, [externalResources]);

  // Yeni Kanun Ekle
  const handleAddLaw = (newLaw: LawResource) => {
    setLaws(prev => [newLaw, ...prev]);
  };

  // Yeni Harici Kaynak Ekle
  const handleAddExternalResource = (newRes: ExternalResource) => {
    setExternalResources(prev => [newRes, ...prev]);
  };

  // Mülakatı Başlat
  const handleStartInterview = (config: InterviewConfig) => {
    setInterviewConfig(config);
    setCurrentView('simulation');
  };

  // Mülakatı Sıfırla
  const handleResetInterview = () => {
    setCurrentView('setup');
  };

  // Mock Modu Değiştir
  const handleMockModeChange = (useMock: boolean) => {
    setIsMockMode(useMock);
    geminiService.setMockMode(useMock);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Üst Navigasyon */}
      <Navbar
        currentView={currentView}
        isMockMode={isMockMode}
        onOpenLawLibrary={() => setIsLawLibraryOpen(true)}
        onOpenResourceUploader={() => setIsResourceUploaderOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetInterview={handleResetInterview}
        interviewTitle={interviewConfig?.positionTitle}
      />

      {/* Ana Görünüm Alanı */}
      <main className="flex-1">
        {currentView === 'setup' ? (
          <SimpleHome
            templates={INTERVIEW_TEMPLATES}
            subjects={SUBJECT_FIELDS}
            laws={laws}
            onStartInterview={handleStartInterview}
            onOpenResourceUploader={() => setIsResourceUploaderOpen(true)}
            onOpenLawLibrary={() => setIsLawLibraryOpen(true)}
          />
        ) : (
          interviewConfig && (
            <SimulationRoom
              config={interviewConfig}
              laws={laws}
              externalResources={externalResources}
              isMockMode={isMockMode}
              onRestartInterview={handleResetInterview}
            />
          )
        )}
      </main>

      {/* Modallar */}
      <LawLibraryModal
        laws={laws}
        isOpen={isLawLibraryOpen}
        onClose={() => setIsLawLibraryOpen(false)}
      />

      <ResourceUploaderModal
        isOpen={isResourceUploaderOpen}
        onClose={() => setIsResourceUploaderOpen(false)}
        onAddLaw={handleAddLaw}
        onAddExternalResource={handleAddExternalResource}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMockMode={isMockMode}
        onMockModeChange={handleMockModeChange}
      />
    </div>
  );
};
