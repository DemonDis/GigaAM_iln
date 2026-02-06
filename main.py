
import os
from dotenv import load_dotenv
import gigaam

load_dotenv()  # Загружает переменные окружения из .env

# Загрузка тестового аудио
audio_path = gigaam.utils.download_short_audio()
long_audio_path = gigaam.utils.download_long_audio()

# Аудио-эмбеддинги
model_name = "v3_e2e_rnnt"       # Варианты: `v1_ssl`, `v2_ssl`, `v3_ssl`
model = gigaam.load_model(model_name)
embedding, _ = model.embed_audio(audio_path)
print(embedding)

# Используем HF_TOKEN из окружения
HF_TOKEN = os.getenv("HF_TOKEN", "")

# Распознавание на длинном аудио
os.environ["HF_TOKEN"] = HF_TOKEN
if hasattr(model, 'transcribe_longform'):
    utterances = model.transcribe_longform(long_audio_path)
else:
    print("Метод 'transcribe_longform' отсутствует в объекте 'model'. Пожалуйста, используйте альтернативный метод.")
    utterances = None
for utt in utterances:
   transcription, (start, end) = utt["transcription"], utt["boundaries"]
   print(f"[{gigaam.format_time(start)} - {gigaam.format_time(end)}]: {transcription}")

# Распознавание эмоций
model = gigaam.load_model("emo")
emotion2prob = model.get_probs(audio_path)
print(", ".join([f"{emotion}: {prob:.3f}" for emotion, prob in emotion2prob.items()]))
