import { useState } from 'react';
import './styles/index.css';
import UploadSection from './components/UploadSection';
import TranscriptionPanel from './components/TranscriptionPanel';
import ProtocolPanel from './components/ProtocolPanel';
import useTranscription from './hooks/useTranscription';
import useProtocol from './hooks/useProtocol';

function App() {
  const [agenda, setAgenda] = useState('');
  
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
    handleGenerateProtocol(transcription, agenda);
  };

  return (
    <div className="app-container">
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
      />
    </div>
  );
}

export default App;
