
import os
from dotenv import load_dotenv
import gigaam

load_dotenv()  # Загружает переменные окружения из .env

# Файл для записи результата в формате .md
log_file_path = "transcriptions.md"

def log_to_md(content: str):
    with open(log_file_path, "a", encoding="utf-8") as f:
        f.write(content + "\n")

# Загрузка тестового аудио
audio_path = gigaam.utils.download_short_audio()
long_audio_path = gigaam.utils.download_long_audio()

# Аудио-эмбеддинги
model_name = "v3_e2e_rnnt"       # Варианты: `v1_ssl`, `v2_ssl`, `v3_ssl`
model = gigaam.load_model(model_name)
embedding, _ = model.embed_audio(audio_path)
print(embedding)
log_to_md(f"### Embedding:\n{embedding}")

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
   time_str = f"[{gigaam.format_time(start)} - {gigaam.format_time(end)}]: {transcription}"
   print(time_str)
   log_to_md(time_str)

# Распознавание эмоций
model = gigaam.load_model("emo")
emotion2prob = model.get_probs(audio_path)
emotion_str = ", ".join([f"{emotion}: {prob:.3f}" for emotion, prob in emotion2prob.items()])
print(emotion_str)
log_to_md(f"### Emotions:\n{emotion_str}")
