# GigaAM

## Tech stack
- **Python**: 3.13.12
- **ffmpeg**: version 7.1.1-essentials_build-www.gyan.dev

- **LM studio**: 0.4.2
- **Model**: qwen3-4b-instruct-2507-gabliterated

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

3. Установите зависимости:
```bash
python main.py
```

### Для образа python 3.10.10
```bash
# mac
pyenv exec python -m venv .venv && source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && pip install -e .
```

### Конвертация m4a в wav
```bash
ffmpeg -i input.m4a output.wav
```