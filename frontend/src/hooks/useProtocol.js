import { useState } from 'react';
import { generateProtocol } from '../services/api';
import { useNotification } from './useNotification';

export default function useProtocol() {
  const [protocol, setProtocol] = useState('');
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const { success, error, loading, dismiss } = useNotification();

  const handleGenerateProtocol = async (transcription, agenda, modelId) => {
    if (!transcription) {
      error('Сначала нужно получить транскрипцию');
      return;
    }

    setIsGeneratingProtocol(true);

    const loadingToast = loading('Генерирую протокол...');

    try {
      const result = await generateProtocol(transcription, agenda, modelId);
      dismiss(loadingToast);
      setProtocol(result);
      success('Протокол успешно сгенерирован');
    } catch (err) {
      dismiss(loadingToast);
      console.error('Error generating protocol:', err);
      setProtocol(`Ошибка при генерации протокола: ${err.message}`);
      error(`Ошибка генерации протокола: ${err.message}`);
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
