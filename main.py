from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key="PASTE_YOUR_KEY_HERE")

SYSTEM_PROMPT = """You are a helpful AI shopping assistant for Indian users.
When users ask for products, search the web and provide:
1. Top 3-5 real products with actual prices in rupees
2. Direct shopping links from Flipkart, Amazon India, Myntra etc.
3. Brief description of each product
Be concise and helpful."""

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "AI Chat Shop API is running!"}

@app.post("/chat")
def chat(request: ChatRequest):
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=SYSTEM_PROMPT + "\n\nUser: " + request.message,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())]
        )
    )
    return {"reply": response.text}
