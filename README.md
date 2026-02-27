# GigaAM Транскрибация

Веб-приложение для транскрибации аудио с использованием модели GigaAM и генерации протоколов встреч с помощью ИИ.

## Возможности

- Загрузка .WAV файлов для транскрибации
- Генерация протокола встречи в стиле Рика Санчеза
- Переключение между светлой и тёмной темой
- Адаптивный дизайн

## Быстрый старт (Docker)

### Предварительные требования

- Docker
- Docker Compose

### Запуск

1. Скопируйте файл переменных окружения:
```bash
cp .env.docker .env
```

2. Отредактируйте `.env` и добавьте ваш API ключ:
```
VITE_API_KEY=your_api_key_here
```

3. Соберите и запустите контейнеры:
```bash
docker-compose up --build
```

4. Откройте в браузере:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Остановка

```bash
docker-compose down
```

## Запуск без Docker

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

## Структура проекта

```
├── backend/           # Python FastAPI сервер
│   ├── src/
│   │   ├── api.py    # API эндпоинты
│   │   └── transcribe.py  # Логика транскрибации
│   ├── main.py       # Точка входа
│   └── Dockerfile
│
├── frontend/         # React приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API вызовы
│   │   ├── constants/   # Конфигурация
│   │   └── styles/      # CSS стили
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── .env.docker
```
