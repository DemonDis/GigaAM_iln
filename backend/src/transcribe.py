import os
import tempfile
import subprocess
import gigaam
import torchaudio
from typing import Optional


SUPPORTED_FORMATS = {'.wav', '.mp3', '.flac', '.ogg', '.m4a', '.aac', '.wma', '.aiff', '.mp4', '.avi', '.mov', '.mkv'}


def get_audio_format(file_content: bytes) -> Optional[str]:
    """Detect audio format from file content magic bytes."""
    if len(file_content) < 12:
        return None
    
    header = file_content[:12]
    
    if header[:4] == b'RIFF' and header[8:12] == b'WAVE':
        return '.wav'
    elif header[:3] == b'ID3' or (header[:2] == b'\xff\xfb') or (header[:2] == b'\xff\xf3') or (header[:2] == b'\xff\xf2'):
        return '.mp3'
    elif header[:4] == b'fLaC':
        return '.flac'
    elif header[:4] == b'OggS':
        return '.ogg'
    elif header[:4] == b'ftyp':
        return '.m4a'
    elif header[:4] == b'\x89PNG':
        return '.png'
    
    return None


def convert_to_wav(content: bytes, input_format: str) -> bytes:
    """Convert audio/video file content to WAV format."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=input_format) as temp_input:
        temp_input.write(content)
        temp_input_path = temp_input.name

    temp_wav_path = temp_input_path + '.wav'
    
    try:
        video_formats = {'.mp4', '.avi', '.mov', '.mkv'}
        
        if input_format in video_formats:
            subprocess.run(
                ['ffmpeg', '-i', temp_input_path, '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', '-y', temp_wav_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True
            )
        else:
            waveform, sample_rate = torchaudio.load(temp_input_path)
            
            if sample_rate != 16000:
                resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
                waveform = resampler(waveform)
            
            torchaudio.save(temp_wav_path, waveform, 16000)
        
        with open(temp_wav_path, 'rb') as f:
            wav_content = f.read()
        
        return wav_content
    finally:
        if os.path.exists(temp_input_path):
            os.remove(temp_input_path)
        if os.path.exists(temp_wav_path):
            os.remove(temp_wav_path)


class TranscriptionService:
    def __init__(self, model_name: str = "v3_e2e_rnnt", download_root: str = None):
        self.model_name = model_name
        cache_dir = os.getenv("CACHE_DIR", "/media/sdd/Новый_том/Linux/PROG/gigaam")
        self.download_root = download_root or cache_dir
        self._model = None

    @property
    def model(self):
        if self._model is None:
            print(f"Loading model: {self.model_name}...")
            self._model = gigaam.load_model(self.model_name, device="cpu", fp16_encoder=False, download_root=self.download_root)
            print("Model loaded successfully!")
        return self._model

    def transcribe(self, audio_path: str) -> str:
        utterances = self.model.transcribe_longform(audio_path)
        transcription_text = " ".join(utt["transcription"] for utt in utterances)
        return transcription_text.strip()

    def transcribe_file(self, file_content: bytes, filename: str = None) -> str:
        detected_format = get_audio_format(file_content)
        
        if detected_format is None and filename:
            ext = os.path.splitext(filename.lower())[1] if filename else ''
            if ext in SUPPORTED_FORMATS:
                detected_format = ext
        
        if detected_format is None:
            raise ValueError("Не удалось определить формат аудиофайла")
        
        if detected_format not in SUPPORTED_FORMATS:
            raise ValueError(f"Неподдерживаемый формат: {detected_format}")
        
        if detected_format != '.wav':
            file_content = convert_to_wav(file_content, detected_format)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        try:
            return self.transcribe(temp_file_path)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)


transcription_service = TranscriptionService()
