import { BACKEND_URL } from '../constants/config';

export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ошибка при транскрибации: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.transcription;
};

export const generateProtocol = async (transcription, agenda, modelId) => {
  const response = await fetch(`${BACKEND_URL}/generate-protocol`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcription,
      agenda,
      modelId,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Ошибка генерации протокола: ${response.status} ${text}`);
  }

  try {
    const data = JSON.parse(text);
    return data.protocol || 'Не удалось сгенерировать протокол';
  } catch {
    throw new Error(`Неверный ответ сервера: ${text}`);
  }
};

export const exportProtocol = async (protocol, format) => {
  const response = await fetch(`${BACKEND_URL}/export/${format}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ protocol }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Ошибка экспорта: ${response.status} ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Неверный ответ сервера: ${text}`);
  }
};
