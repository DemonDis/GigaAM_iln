# Frontend для GigaAM Транскрибации

## Установка и запуск

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Запустите React dev сервер:
```bash
npm run dev
```

3. Запустите backend API (в отдельном терминале):
```bash
cd ../backend
pip install fastapi uvicorn python-multipart
python main.py
```

## Использование

1. Откройте http://localhost:5173
2. Загрузите .WAV файл
3. Нажмите "Транскрибировать"
4. После получения транскрипции, введите повестку (опционально)
5. Нажмите "Сгенерировать протокол" для получения протокола в стиле Рика Санчеза
