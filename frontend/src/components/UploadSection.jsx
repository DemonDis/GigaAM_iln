import { useNotification } from '../hooks/useNotification';

export default function UploadSection({ audioFile, onFileChange, onTranscribe, isTranscribing }) {
  useNotification();

  return (
    <div className="upload-section">
      <input
        type="file"
        accept=".wav,.mp3,.flac,.ogg,.m4a,.aac,.wma,.aiff,.mp4,.avi,.mov,.mkv,audio/*,video/*"
        onChange={onFileChange}
        className="file-input"
        id="file-input"
      />
      <label htmlFor="file-input" className="file-label">
        {audioFile ? audioFile.name : 'Выберите аудиофайл'}
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
