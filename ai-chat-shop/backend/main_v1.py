from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key="AIzaSyB1nCNKhHmmNwTGeh6Nxi1Pt0jl_4O6ncU")

SYSTEM_PROMPT = """You are a helpful AI shopping assistant.
Help users find products, compare prices, and make purchase
decisions. Be friendly and concise."""

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "AI Chat Shop API is running!"}

@app.post("/chat")
def chat(request: ChatRequest):
    response = client.models.generate_content(
        model="models/gemini-2.5-flash-lite",
        contents=SYSTEM_PROMPT + "\n\nUser: " + request.message,
    )
    return {"reply": response.text}
