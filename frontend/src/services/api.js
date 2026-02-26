import { BACKEND_URL, BASE_URL, API_KEY, LLM_NAME, RICK_PROMPT } from '../constants/config';

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
  const userMessage = transcription 
    ? `Транскрипт встречи:\n${transcription}\n\nПовестка дня:\n${agenda || 'Не указана'}`
    : 'Нет транскрипта для обработки.';

  const messages = [
    { role: 'system', content: RICK_PROMPT },
    { role: 'user', content: userMessage }
  ];

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_NAME,
      messages: messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Не удалось сгенерировать протокол';
};
