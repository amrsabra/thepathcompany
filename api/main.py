from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import stripe

# Load environment variables from .env
load_dotenv()

# Supabase credentials from environment
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY

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

class StripeCheckoutRequest(BaseModel):
    price: float
    billing_cycle: str  # 'monthly' or 'yearly'
    email: EmailStr

@app.post("/api/create-stripe-checkout-session")
async def create_stripe_checkout_session(data: StripeCheckoutRequest = Body(...)):
    try:
        # You should use Stripe Price IDs in production, but for demo, use amount
        amount = int(data.price * 100)  # Stripe expects cents
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription" if data.billing_cycle in ["monthly", "yearly"] else "payment",
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"TPC Premium ({data.billing_cycle.capitalize()})"
                    },
                    "unit_amount": amount,
                    "recurring": {"interval": "month" if data.billing_cycle == "monthly" else "year"} if data.billing_cycle in ["monthly", "yearly"] else None
                },
                "quantity": 1
            }],
            customer_email=data.email,
            success_url="http://localhost:3000/plans?success=true",
            cancel_url="http://localhost:3000/plans?canceled=true"
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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