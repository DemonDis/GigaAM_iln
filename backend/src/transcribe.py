import os
import tempfile
import gigaam


class TranscriptionService:
    def __init__(self, model_name: str = "v3_e2e_rnnt"):
        self.model_name = model_name
        self._model = None

    @property
    def model(self):
        if self._model is None:
            print(f"Loading model: {self.model_name}...")
            self._model = gigaam.load_model(self.model_name)
            print("Model loaded successfully!")
        return self._model

    def transcribe(self, audio_path: str) -> str:
        utterances = self.model.transcribe_longform(audio_path)
        transcription_text = " ".join(utt["transcription"] for utt in utterances)
        return transcription_text.strip()

    def transcribe_file(self, file_content: bytes) -> str:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        try:
            return self.transcribe(temp_file_path)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)


transcription_service = TranscriptionService()
