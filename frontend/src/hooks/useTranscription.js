import { useState } from 'react';
import { transcribeAudio } from '../services/api';
import { useNotification } from './useNotification';

export default function useTranscription() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { success, error, info, loading, dismiss } = useNotification();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.toLowerCase().split('.').pop();
      const supportedFormats = ['wav', 'mp3', 'flac', 'ogg', 'm4a', 'aac', 'wma', 'aiff', 'mp4', 'avi', 'mov', 'mkv'];
      if (!supportedFormats.includes(ext)) {
        error('Неподдерживаемый формат файла');
        return;
      }
      setAudioFile(file);
      setTranscription('');
      success(`Файл выбран: ${file.name}`);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      error('Пожалуйста, выберите файл');
      return;
    }

    setIsTranscribing(true);
    setTranscription('');

    const loadingToast = loading('Транскрибирую аудио...');

    try {
      const result = await transcribeAudio(audioFile);
      dismiss(loadingToast);
      if (result) {
        setTranscription(result);
        success('Транскрибация завершена');
      } else {
        setTranscription('Транскрибация завершена, но текст пуст');
        info('Транскрибация завершена, но текст пуст');
      }
    } catch (err) {
      dismiss(loadingToast);
      console.error('Error:', err);
      setTranscription(`Ошибка: ${err.message}`);
      error(`Ошибка транскрибации: ${err.message}`);
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
    setTranscription,
  };
}
