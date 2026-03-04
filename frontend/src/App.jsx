import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';
import UploadSection from './components/UploadSection';
import TranscriptionPanel from './components/TranscriptionPanel';
import ProtocolPanel from './components/ProtocolPanel';
import ThemeToggle from './components/ThemeToggle';
import useTranscription from './hooks/useTranscription';
import useProtocol from './hooks/useProtocol';
import useTheme from './hooks/useTheme';
import { ModelProvider } from './context/ModelContext';
import { useModel } from './context/ModelContext';

function AppContent() {
  const [agenda, setAgenda] = useState('');
  const { selectedModel, setSelectedModel } = useModel();
  const { theme, toggleTheme } = useTheme();
  
  const { 
    audioFile, 
    transcription, 
    isTranscribing, 
    handleFileChange, 
    handleTranscribe 
  } = useTranscription();
  
  const { 
    protocol, 
    isGeneratingProtocol, 
    handleGenerateProtocol 
  } = useProtocol();

  const onGenerateProtocol = () => {
    handleGenerateProtocol(transcription, agenda, selectedModel);
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      
      <div className="main-panel">
        <h1>GigaAM Транскрибация</h1>
        
        <UploadSection 
          audioFile={audioFile}
          onFileChange={handleFileChange}
          onTranscribe={handleTranscribe}
          isTranscribing={isTranscribing}
        />

        <TranscriptionPanel 
          transcription={transcription}
          isTranscribing={isTranscribing}
        />
      </div>

      <ProtocolPanel 
        agenda={agenda}
        onAgendaChange={setAgenda}
        transcription={transcription}
        isGeneratingProtocol={isGeneratingProtocol}
        onGenerateProtocol={onGenerateProtocol}
        protocol={protocol}
        modelId={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
}

export default function App() {
  return (
    <ModelProvider>
      <AppContent />
    </ModelProvider>
  );
}
