
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
```
3. Установите зависимости:
```bash
python main.py
```

4. Для образа python 3.10.10
```bash
pyenv exec python -m venv .venv && source .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt
```