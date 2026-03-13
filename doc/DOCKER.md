# Запуск Docker

# Запуск Docker compose
```bash
docker compose up -d --build
```

# Остановить
```bash
docker compose down
```

## BACKEND

### Собрать образ
```bash
docker build -t gigaam-backend .
```

### Запустить контейнер
```bash
docker run -d -p 8000:8000 --env-file .env --name backend gigaam-backend

```

## FRONTEND
### Собрать образ
```bash
docker build -t gigaam-frontend .
```

### Запустить контейнер
```bash
docker run -d -p 5173:5173 --env-file .env --name frontend gigaam-frontend
```
