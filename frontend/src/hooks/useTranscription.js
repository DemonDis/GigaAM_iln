import { useState } from 'react';
import { transcribeAudio } from '../services/api';

export default function useTranscription() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.wav')) {
        alert('Пожалуйста, выберите файл .WAV');
        return;
      }
      setAudioFile(file);
      setTranscription('');
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      alert('Пожалуйста, выберите файл .WAV');
      return;
    }

    setIsTranscribing(true);
    setTranscription('');

    try {
      const result = await transcribeAudio(audioFile);
      setTranscription(result || 'Транскрибация завершена, но текст пуст');
    } catch (error) {
      console.error('Error:', error);
      setTranscription(`Ошибка: ${error.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    audioFile,
    transcription,
    isTranscribing,
    handleFileChange,
    handleTranscribe,
  };
}
