import os
import datetime
from dotenv import load_dotenv
import gigaam

load_dotenv()

def log_to_md(content: str, file_path: str):
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(content + "\n")

# === Тестовые аудио ===
long_audio_path = "./voice/test.wav"
# long_audio_path = gigaam.utils.download_long_audio()
print(f"Long audio:  {long_audio_path}")

# Рекомендуемые имена в доке: "rnnt", "ctc", "v2_rnnt", "v2_ctc" и т.п.
asr_model_name = "rnnt"
asr_model = gigaam.load_model(asr_model_name)

# Prepare dynamic filename for output
now_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
audio_name = os.path.splitext(os.path.basename(long_audio_path))[0]
result_dir = "./voice/result"
os.makedirs(result_dir, exist_ok=True)
log_file_path = os.path.join(result_dir, f"{now_str}_{asr_model_name}_{audio_name}.md")

# === Распознавание на длинном аудио (longform) ===
HF_TOKEN = os.getenv("HF_TOKEN", "")
os.environ["HF_TOKEN"] = HF_TOKEN or ""

utterances = []

if not HF_TOKEN:
    print("WARNING: HF_TOKEN не задан, transcribe_longform может не работать.")
else:
    if hasattr(asr_model, "transcribe_longform"):
        try:
            print("Starting longform transcription...")
            utterances = asr_model.transcribe_longform(long_audio_path)

            for utt in utterances:
                transcription = utt["transcription"]
                start, end = utt["boundaries"]
                # time_str = f"[{gigaam.format_time(start)} - {gigaam.format_time(end)}]: {transcription}"
                time_str = f"{transcription}"
                # print(time_str)
                log_to_md(time_str, log_file_path)

        except Exception as e:
            print(f"Ошибка при transcribe_longform: {e}")
    else:
        print("Метод 'transcribe_longform' отсутствует у модели. Попробуйте gigaam.load_model('ctc').")
