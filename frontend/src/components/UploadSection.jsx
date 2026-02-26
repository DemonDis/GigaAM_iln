export default function UploadSection({ audioFile, onFileChange, onTranscribe, isTranscribing }) {
  return (
    <div className="upload-section">
      <input
        type="file"
        accept=".wav"
        onChange={onFileChange}
        className="file-input"
        id="file-input"
      />
      <label htmlFor="file-input" className="file-label">
        {audioFile ? audioFile.name : 'Выберите файл .WAV'}
      </label>
      
      <button 
        onClick={onTranscribe} 
        disabled={!audioFile || isTranscribing}
        className="btn-primary"
      >
        {isTranscribing ? 'Транскрибирую...' : 'Транскрибировать'}
      </button>
    </div>
  );
}
