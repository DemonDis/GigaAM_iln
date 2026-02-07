# GigaAM

## Tech stack
- **Python**: 3.10.10
- **ffmpeg**: ffmpeg version 7.1.1
- **pyenv**: 2.6.20

- **LM studio**: 0.4.2
- **Model**: Llama 3 8B Gpt 4o Ru1.0 GGUF Q3_K_M

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
# Установить зависимости
pip install -e .
```

3. Установите зависимости:
```bash
python main.py
```

### Для образа python 3.10.10
```bash
pyenv exec python -m venv .venv && source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && pip install -e .
```

### Конвертация m4a в wav
```bash
ffmpeg -i input.m4a output.wav
```