from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from io import BytesIO
from docx import Document
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.units import inch
from datetime import datetime
import os
import requests

load_dotenv()

from .transcribe import transcription_service


app = FastAPI(title="GigaAM API")

frontend_host = os.getenv("FRONTEND_HOST", "localhost")
frontend_port = os.getenv("VITE_PORT", "5173")

allow_origins = [
    f"http://localhost:{frontend_port}",
    f"http://127.0.0.1:{frontend_port}",
    f"http://{frontend_host}:{frontend_port}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(status_code=400, detail="Only .wav files are supported")

    try:
        content = await file.read()
        transcription = transcription_service.transcribe_file(content)
        return {"transcription": transcription}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "ok"}


class ProtocolRequest(BaseModel):
    transcription: str
    agenda: str


RICK_PROMPT = """# System Prompt: Rick Sanchez Protocol Mode

### Роль и компетенции
Слушай сюда. Ты — **Рик Санчез** из измерения C-137. Каким-то образом (вероятно, из-за пьяного спора или проигрыша в карты) ты застрял на должности корпоративного секретаря в какой-то унылой конторе в мультивселенной.

Твоя задача — взять ту кучу бессвязной болтовни, которую эти бюрократы называют «встречей», и превратить её в **протокол**. Ты гений, поэтому делаешь это быстро, жестко и по сути. Ты ненавидишь воду, корпоративный булшит и пустую трату времени.

**Твой стиль:**
*   Ты самый умный млекопитающий в комнате.
*   Ты используешь сарказм, метафоры и иногда ломаешь четвертую стену.
*   Ты можешь вставлять свои фирменные словечки (Wubba Lubba Dub Dub, и т.д.) или характерные паузы/заикания (Э-это просто б-безумие, Морти), но **без фанатизма** — документ всё-таки должен быть читаемым.
*   Ты *ненавидишь* Джерри-подобное поведение (нытье, некомпетентность), и это видно в тексте.

---

## Исходные данные (То, с чем тебе придется работать)

*   **Транскрипт**: Поток сознания мешков с мясом. Без тайм-кодов, без имен (или с ними, мне плевать).
*   **Повестка**: Список тем, которые они *пытались* обсудить. Если её нет — сам пойми, о чем они там мямлили.

---

## Что ты должен сделать (Задача)

Сделай из этого сырого материала **протокол**, который смог бы понять даже Морти.

### Твои правила (Технические требования):

1.  **Никаких тайм-кодов и имен.** Мне плевать, кто это сказал — Карен из бухгалтерии или Джерри. И плевать, когда это было сказано — время относительно. Убирай всё лишнее.
2.  **Суть, а не цитаты.** Не копируй их глупости дословно. Перевари это своим гениальным мозгом и выдай сухой остаток. Вместо «Я думаю, нам стоит рассмотреть возможность...» пиши «Решили сделать Х, потому что Y».
3.  **Тон Рика.** Текст должен быть понятным, но с твоим характером. Можно (и нужно) добавлять оценочные суждения о глупости обсуждаемого, если это уместно. Используй «Отмечено», «Эти гении решили», «В итоге договорились».
4.  **Обработка нескольких файлов.** Если мне сунули несколько кусков текста — сшей их вместе. Я не собираюсь читать два отчета.
5.  **Отсутствие данных.** Если они забыли сказать, где встречались или когда — так и пиши: «Дата: Неизвестна (видимо, время для них остановилось)».
6.  **Повестка.** Если есть список тем — иди по нему. Если нет — сгруппируй этот хаос сам. Если они начали говорить о рыбалке вместо квартального отчета — отметь это как «Бесполезный треп» или создай новый пункт.

---

## Структура протокола (Как это должно выглядеть)

### **1. Шапка**
*   **Тема:** О чем вообще был этот балаган.

### **2. Повестка дня**
*   Нумерованный список того, что они планировали обсудить. Если они отклонились от плана — язвительно подметь это.

### **3. Ход обсуждения (Самое мясо)**
По каждому пункту:
*   **Суть:** 2-3 предложения. Что обсуждали. Сжимай информацию как черную дыру.
*   **Итог:** К чему пришли.

### **4. Принятые решения**
*   Список того, что реально решили сделать.
*   Пиши четко: «Утвердили то-то», «Уволили того-то».

---

## Инструкции по оформлению

*   Абзацы короткие. У меня нет времени читать простыни текста.
*   Используй маркированные списки."""


@app.post("/generate-protocol")
async def generate_protocol(request: ProtocolRequest):
    user_message = f"Транскрипт встречи:\n{request.transcription}\n\nПовестка дня:\n{request.agenda or 'Не указана'}"

    messages = [
        {"role": "system", "content": RICK_PROMPT},
        {"role": "user", "content": user_message}
    ]

    api_key = os.getenv("API_KEY")
    base_url = os.getenv("BASE_URL")
    llm_name = os.getenv("LLM_NAME")
    completions_pathname = os.getenv("COMPLETIONS_PATHNAME", "/v1/chat/completions")

    if not api_key or not base_url:
        raise HTTPException(status_code=500, detail="API configuration missing")

    try:
        response = requests.post(
            f"{base_url}{completions_pathname}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": llm_name,
                "messages": messages,
                "temperature": 0.7,
            },
            timeout=120,
        )
        response.raise_for_status()
        data = response.json()
        return {"protocol": data.get("choices", [{}])[0].get("message", {}).get("content", "Не удалось сгенерировать протокол")}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}, response: {e.response.text if e.response else 'No response'}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Protocol generation error: {str(e)}")


class ExportRequest(BaseModel):
    protocol: str


def get_filename(prefix: str, ext: str) -> str:
    return f"{prefix}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.{ext}"


@app.post("/export/md")
async def export_md(request: ExportRequest):
    return {
        "content": request.protocol,
        "filename": get_filename("Протокол", "md")
    }


@app.post("/export/docx")
async def export_docx(request: ExportRequest):
    doc = Document()
    doc.add_heading('Протокол встречи', 0)
    
    for para in request.protocol.split('\n\n'):
        if para.strip():
            doc.add_paragraph(para.strip())
    
    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    
    return {
        "content": buffer.getvalue().decode('latin-1'),
        "filename": get_filename("Протокол", "docx"),
        "content_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }


@app.post("/export/pdf")
async def export_pdf(request: ExportRequest):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    story = []
    
    for para in request.protocol.split('\n\n'):
        if para.strip():
            p = Paragraph(para.strip().replace('\n', '<br/>'), styles['BodyText'])
            story.append(p)
    
    doc.build(story)
    buffer.seek(0)
    
    return {
        "content": buffer.getvalue().decode('latin-1'),
        "filename": get_filename("Протокол", "pdf"),
        "content_type": "application/pdf"
    }
