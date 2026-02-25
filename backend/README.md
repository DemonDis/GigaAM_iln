# GigaAM

## Tech stack
- **Python**: 3.13.12
- **ffmpeg**: version 7.1.1-essentials_build-www.gyan.dev

- **LM studio**: 0.4.2
- **Model**: [josiefied-qwen3-4b-instruct-2507-gabliterated-v2-i1](https://huggingface.co/mradermacher/Josiefied-Qwen3-4B-Instruct-2507-gabliterated-v2-i1-GGUF)

1. Создайте виртуальное окружение (рекомендуется):
```bash
python -m venv .venv
# Для Linux/macOS
source venv/bin/activate
# Для Windows
./.venv/Scripts/activate 
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
# Обновить pip (если требуется)
pip install --upgrade pip
# Установить зависимости
pip install -e .
```

3. Запуск:
```bash
python main.py
```

### Конвертация m4a в wav
```bash
ffmpeg -i input.m4a output.wav
```