import { useNotification } from '../hooks/useNotification';

import { useState, useEffect } from 'react';
export default function TranscriptionPanel({ transcription, isTranscribing, onTranscriptionChange }) {
  const { success, error } = useNotification();
  const [customText, setCustomText] = useState(transcription || '');
  useEffect(() => {
    setCustomText(transcription || '');
  }, [transcription]);
  
  const copyText = async () => {
    const text = customText || '';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      success('Текст скопирован');
    } catch (e) {
      console.error(e);
      error('Не удалось скопировать текст');
    }
  };
  return (
    <div className="transcription-section">
      <h2>Транскрипция</h2>
      <div className="transcription-box">
        {isTranscribing ? (
            <div className="loading">Идёт транскрибация аудио...</div>
          ) : (
            <textarea
              className="textarea-box"
              placeholder="Ввод текста для протокола"
              value={customText}
              onChange={(e) => { setCustomText(e.target.value); if (onTranscriptionChange) onTranscriptionChange(e.target.value); }}
            />
          )}
      </div>
      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <button onClick={copyText} className="btn-copy">Копировать</button>
      </div>
    </div>
  );
 }
