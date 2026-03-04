import { useNotification } from '../hooks/useNotification';

export default function TranscriptionPanel({ transcription, isTranscribing }) {
  const { success, error } = useNotification();
  
  const copyText = async () => {
    const text = transcription || '';
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
      <div className="transcription-box" style={{ position: 'relative' }}>
        {isTranscribing ? (
          <div className="loading">Идёт транскрибация аудио...</div>
        ) : transcription ? (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{transcription}</pre>
        ) : (
          <div className="placeholder">
            Загрузите .WAV файл и нажмите "Транскрибировать"
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', marginTop: 8 }}>
        <button onClick={copyText} className="btn-copy">Копировать</button>
      </div>
    </div>
  );
 }
