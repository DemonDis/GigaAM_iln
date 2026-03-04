import uvicorn
import torch
from src.api import create_app as create_app_func
from src.api import create_app as create_app  # fallback if needed
from dotenv import load_dotenv
import os

load_dotenv()

def get_device():
    if not torch.cuda.is_available():
        print("CUDA недоступна, использование CPU")
        return torch.device("cpu")
    return torch.device("cpu")

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    device = get_device()
    # Создать приложение с указанием устройства
    app = create_app_func(device=device)
    uvicorn.run(app, host=host, port=port)
