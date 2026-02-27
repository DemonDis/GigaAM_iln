import { BACKEND_URL } from '../constants/config';

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Ошибка при транскрибации');
  }

  const data = await response.json();
  return data.transcription;
};

export const generateProtocol = async (transcription, agenda) => {
  const response = await fetch(`${BACKEND_URL}/generate-protocol`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcription,
      agenda,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.protocol || 'Не удалось сгенерировать протокол';
};

export const exportProtocol = async (protocol, format) => {
  const response = await fetch(`${BACKEND_URL}/export/${format}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ protocol }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
