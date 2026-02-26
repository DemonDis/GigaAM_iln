import { useState } from 'react';
import { generateProtocol } from '../services/api';

export default function useProtocol() {
  const [protocol, setProtocol] = useState('');
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);

  const handleGenerateProtocol = async (transcription, agenda) => {
    if (!transcription) {
      alert('Сначала нужно получить транскрипцию');
      return;
    }

    setIsGeneratingProtocol(true);

    try {
      const result = await generateProtocol(transcription, agenda);
      setProtocol(result);
    } catch (error) {
      console.error('Error generating protocol:', error);
      setProtocol(`Ошибка при генерации протокола: ${error.message}`);
    } finally {
      setIsGeneratingProtocol(false);
    }
  };

  return {
    protocol,
    isGeneratingProtocol,
    handleGenerateProtocol,
  };
}
