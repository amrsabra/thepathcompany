from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(
    title="Project X API",
    description="Backend API for Project X",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Project X API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}

class EmailCheckRequest(BaseModel):
    email: EmailStr

@app.post("/api/check-email")
async def check_email(request: EmailCheckRequest):
    try:
        result = supabase.table("profiles").select("email").eq("email", request.email).execute()
        if result.data:
            raise HTTPException(status_code=400, detail="Email already exists")
        return {"message": "Email available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Email already exists")

# Custom 404 error
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": f"Route {request.url.path} not found"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
