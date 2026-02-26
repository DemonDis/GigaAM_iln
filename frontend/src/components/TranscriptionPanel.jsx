export default function TranscriptionPanel({ transcription, isTranscribing }) {
  return (
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
  );
}
