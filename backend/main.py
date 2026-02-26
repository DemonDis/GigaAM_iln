import uvicorn
from src.api import app


if __name__ == "__main__":
    uvicorn.run(app, host="192.168.91.162", port=8000)
