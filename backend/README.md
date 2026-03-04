# GigaAM

## Tech stack
- **Python**: 3.12.3
- **Node**: 22.12.0
- **ffmpeg**: version 7.1.1-essentials_build-www.gyan.dev


- **Model**: []()

1. Создайте виртуальное окружение (рекомендуется):
```bash
python3 -m venv .venv
# Для Linux/macOS
source .venv/bin/activate
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

## API

- `POST /transcribe` — принимает `.wav` файл и возвращает текст транскрипции.
- `POST /generate-protocol` — принимает текст транскрипции и повестку, генерирует протокол.
- `POST /metrics/quantitative` — принимает `reference` и `hypothesis` и возвращает количественные метрики качества распознавания/перевода: WER, BLEU, ROUGE-1/2/L, а также длины токенов.
