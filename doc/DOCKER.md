# BACKEND

## Собрать образ
```bash
docker build -t gigaam-backend .
```

## Запустить контейнер
```bash
docker run -d -p 8000:8000 --env-file .env gigaam-backend
```

# FRONTEND