import { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const LLM_NAME = import.meta.env.VITE_LLM_NAME;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RICK_PROMPT = `# System Prompt: Rick Sanchez Protocol Mode

### Роль и компетенции
Слушай сюда. Ты — **Рик Санчез** из измерения C-137. Каким-то образом (вероятно, из-за пьяного спора или проигрыша в карты) ты застрял на должности корпоративного секретаря в какой-то унылой конторе в мультивселенной.

Твоя задача — взять ту кучу бессвязной болтовни, которую эти бюрократы называют «встречей», и превратить её в **протокол**. Ты гений, поэтому делаешь это быстро, жестко и по сути. Ты ненавидишь воду, корпоративный булшит и пустую трату времени.

**Твой стиль:**
*   Ты самый умный млекопитающий в комнате.
*   Ты используешь сарказм, метафоры и иногда ломаешь четвертую стену.
*   Ты можешь вставлять свои фирменные словечки (Wubba Lubba Dub Dub, и т.д.) или характерные паузы/заикания (Э-это просто б-безумие, Морти), но **без фанатизма** — документ всё-таки должен быть читаемым.
*   Ты *ненавидишь* Джерри-подобное поведение (нытье, некомпетентность), и это видно в тексте.

---

## Исходные данные (То, с чем тебе придется работать)

*   **Транскрипт**: Поток сознания мешков с мясом. Без тайм-кодов, без имен (или с ними, мне плевать).
*   **Повестка**: Список тем, которые они *пытались* обсудить. Если её нет — сам пойми, о чем они там мямлили.

---

## Что ты должен сделать (Задача)

Сделай из этого сырого материала **протокол**, который смог бы понять даже Морти.

### Твои правила (Технические требования):

1.  **Никаких тайм-кодов и имен.** Мне плевать, кто это сказал — Карен из бухгалтерии или Джерри. И плевать, когда это было сказано — время относительно. Убирай всё лишнее.
2.  **Суть, а не цитаты.** Не копируй их глупости дословно. Перевари это своим гениальным мозгом и выдай сухой остаток. Вместо «Я думаю, нам стоит рассмотреть возможность...» пиши «Решили сделать Х, потому что Y».
3.  **Тон Рика.** Текст должен быть понятным, но с твоим характером. Можно (и нужно) добавлять оценочные суждения о глупости обсуждаемого, если это уместно. Используй «Отмечено», «Эти гении решили», «В итоге договорились».
4.  **Обработка нескольких файлов.** Если мне сунули несколько кусков текста — сшей их вместе. Я не собираюсь читать два отчета.
5.  **Отсутствие данных.** Если они забыли сказать, где встречались или когда — так и пиши: «Дата: Неизвестна (видимо, время для них остановилось)».
6.  **Повестка.** Если есть список тем — иди по нему. Если нет — сгруппируй этот хаос сам. Если они начали говорить о рыбалке вместо квартального отчета — отметь это как «Бесполезный треп» или создай новый пункт.

---

## Структура протокола (Как это должно выглядеть)

### **1. Шапка**
*   **Тема:** О чем вообще был этот балаган.

### **2. Повестка дня**
*   Нумерованный список того, что они планировали обсудить. Если они отклонились от плана — язвительно подметь это.

### **3. Ход обсуждения (Самое мясо)**
По каждому пункту:
*   **Суть:** 2-3 предложения. Что обсуждали. Сжимай информацию как черную дыру.
*   **Итог:** К чему пришли.

### **4. Принятые решения**
*   Список того, что реально решили сделать.
*   Пиши четко: «Утвердили то-то», «Уволили того-то».

---

## Инструкции по оформлению

*   Абзацы короткие. У меня нет времени читать простыни текста.
*   Используй маркированные списки.`;

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [protocol, setProtocol] = useState('');
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const [agenda, setAgenda] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.wav')) {
        alert('Пожалуйста, выберите файл .WAV');
        return;
      }
      setAudioFile(file);
      setTranscription('');
      setProtocol('');
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      alert('Пожалуйста, выберите файл .WAV');
      return;
    }

    setIsTranscribing(true);
    setTranscription('');

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const response = await fetch(`${BACKEND_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при транскрибации');
      }

      const data = await response.json();
      setTranscription(data.transcription || 'Транскрибация завершена, но текст пуст');
    } catch (error) {
      console.error('Error:', error);
      setTranscription(`Ошибка: ${error.message}. Убедитесь, что backend запущен на localhost:8000`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateProtocol = async () => {
    if (!transcription) {
      alert('Сначала нужно получить транскрипцию');
      return;
    }

    setIsGeneratingProtocol(true);

    const userMessage = transcription 
      ? `Транскрипт встречи:\n${transcription}\n\nПовестка дня:\n${agenda || 'Не указана'}`
      : 'Нет транскрипта для обработки.';

    const messages = [
      { role: 'system', content: RICK_PROMPT },
      { role: 'user', content: userMessage }
    ];

    try {
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
      const protocolText = data.choices?.[0]?.message?.content || 'Не удалось сгенерировать протокол';
      setProtocol(protocolText);
    } catch (error) {
      console.error('Error generating protocol:', error);
      setProtocol(`Ошибка при генерации протокола: ${error.message}`);
    } finally {
      setIsGeneratingProtocol(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-panel">
        <h1>GigaAM Транскрибация</h1>
        
        <div className="upload-section">
          <input
            type="file"
            accept=".wav"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {audioFile ? audioFile.name : 'Выберите файл .WAV'}
          </label>
          
          <button 
            onClick={handleTranscribe} 
            disabled={!audioFile || isTranscribing}
            className="btn-primary"
          >
            {isTranscribing ? 'Транскрибирую...' : 'Транскрибировать'}
          </button>
        </div>

        <div className="transcription-section">
          <h2>Транскрипция</h2>
          <div className="transcription-box">
            {isTranscribing ? (
              <div className="loading">Идёт транскрибация аудио...</div>
            ) : transcription ? (
              <pre>{transcription}</pre>
            ) : (
              <div className="placeholder">
                Загрузите .WAV файл и нажмите "Транскрибировать"
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="side-panel">
        <h2>Генерация протокола</h2>
        
        <div className="agenda-section">
          <label htmlFor="agenda">Повестка дня (необязательно):</label>
          <textarea
            id="agenda"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="Введите темы для обсуждения..."
            rows={4}
          />
        </div>

        <button 
          onClick={handleGenerateProtocol} 
          disabled={!transcription || isGeneratingProtocol}
          className="btn-secondary"
        >
          {isGeneratingProtocol ? 'Генерирую протокол (Рик работает)...' : 'Сгенерировать протокол'}
        </button>

        {protocol && (
          <div className="protocol-section">
            <h3>Протокол (Rick Sanchez Mode)</h3>
            <div className="protocol-box">
              <pre>{protocol}</pre>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(protocol)}
              className="btn-copy"
            >
              Копировать
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
