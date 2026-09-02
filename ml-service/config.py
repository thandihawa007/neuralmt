from dotenv import load_dotenv
import os

load_dotenv()

# Model identifier on Hugging Face Hub
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "Helsinki-NLP/opus-mt-en-hi")

# Host / port used by uvicorn (reference only; actual binding is in CLI)
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
