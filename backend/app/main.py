# backend/app/main.py

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.model_service import predict_url  # noqa: E402
from app.db.repo import (  # noqa: E402
    save_prediction,
    get_history,
    stats_summary,
    stats_top_domains,
    stats_timeline,
)
from app.auth import (  # noqa: E402
    create_user,
    get_user,
    verify_password,
    create_access_token,
    verify_token,
    update_last_login,
    get_user_predictions,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_admin_user
)

try:
    from app.llm_service import generate_explanation  # type: ignore  # noqa: E402
    LLM_AVAILABLE = True
except Exception:
    LLM_AVAILABLE = False


app = FastAPI(
    title="URL Phishing Detection API",
    version="1.1.0",
    description="Predict phishing URLs using ML + optional LLM explanations + MongoDB history + analytics.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    url: str = Field(..., examples=["https://example.com/login?verify=true"])
    include_features: bool = True
    include_llm_explanation: bool = True
    threshold: float = Field(0.5, ge=0.0, le=1.0)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: str
    username: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: str


class PredictRequest(BaseModel):
    url: str = Field(..., examples=["https://example.com/login?verify=true"])
    include_features: bool = True
    include_llm_explanation: bool = True
    threshold: float = Field(0.5, ge=0.0, le=1.0)


class PredictResponse(BaseModel):
    url: str
    prediction: int
    label: str
    risk_score: float
    threshold: float
    explanation: Optional[str] = None
    features: Optional[Dict[str, Any]] = None
    timestamp: str
    saved_id: Optional[str] = None


security = HTTPBearer()


def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        return None  # Return None for unauthenticated requests
    email: str = payload.get("sub")
    if email is None:
        return None
    user = get_user(email=email)
    if user is None:
        return None
    return user


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = get_user(email=email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    try:
        print(f"Registration attempt for email: {user.email}")
        user_id = create_user(user.email, user.username, user.password)
        if user_id is None:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Return the created user
        response = UserResponse(
            id=user_id,
            email=user.email,
            username=user.username,
            created_at=datetime.utcnow().isoformat() + "Z"
        )
        print(f"Registration successful for: {user.email}")
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = get_user(email=user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not db_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update last login time
    update_last_login(user.email)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.on_event("startup")
async def startup_event():
    """Create admin user on startup."""
    create_admin_user()


@app.get("/")
def home():
    return {
        "message": "URL Phishing Detection API is running✅",
        "docs": "/docs",
        "endpoints": ["/health", "/predict", "/history", "/stats/summary", "/stats/top-domains", "/stats/timeline", "/register", "/login"],
        "llm_available": LLM_AVAILABLE,
    }


@app.get("/health")
def health():
    return {"status": "ok", "llm_available": LLM_AVAILABLE}


@app.post("/create-admin")
def create_admin_user_endpoint():
    """Manually create admin user."""
    try:
        from app.auth import create_admin_user
        create_admin_user()
        return {"status": "success", "message": "Admin user created"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/list-users")
def list_users():
    """List all users in the database."""
    try:
        from app.db.mongo import get_collection
        users_col = get_collection("users")
        users = list(users_col.find({}, {"hashed_password": 0}))  # Exclude passwords
        
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user["_id"] = str(user["_id"])
            if isinstance(user.get("created_at"), datetime):
                user["created_at"] = user["created_at"].isoformat()
            if isinstance(user.get("last_login"), datetime):
                user["last_login"] = user["last_login"].isoformat() if user["last_login"] else None
        
        return {
            "status": "success",
            "users": users,
            "count": len(users)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/test-db")
def test_db():
    """Test database connection and user operations."""
    try:
        from app.db.mongo import get_collection
        users_col = get_collection("users")
        user_count = users_col.count_documents({})
        sample_user = users_col.find_one()
        
        return {
            "status": "Database connection successful",
            "user_count": user_count,
            "sample_user": str(sample_user) if sample_user else None,
            "collections": [col for col in users_col.database.list_collection_names()]
        }
    except Exception as e:
        return {"status": "Database error", "error": str(e)}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, current_user: Optional[dict] = Depends(get_current_user_optional)):
    url = (req.url or "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        result = predict_url(url, threshold=req.threshold)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    explanation = None
    if req.include_llm_explanation and LLM_AVAILABLE:
        try:
            explanation = generate_explanation(
                url=url,
                label=result["label"],
                risk_score=result["risk_score"],
                features=result["features"],
            )
        except Exception:
            explanation = None

    payload = {
        "url": url,
        "prediction": result["prediction"],
        "label": result["label"],
        "risk_score": result["risk_score"],
        "threshold": req.threshold,
        "explanation": explanation,
        "features": result["features"] if req.include_features else None,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

    # Add user ID to the payload if authenticated
    if current_user:
        payload["user_id"] = str(current_user["_id"])
        payload["user_email"] = current_user["email"]
    else:
        # For unauthenticated requests, use a temporary identifier
        payload["user_id"] = "anonymous"
        payload["user_email"] = "anonymous"

    # Save in MongoDB
    try:
        saved_id = save_prediction(payload)
    except Exception as e:
        # If DB fails, still return prediction (don't break API)
        saved_id = None

    payload["saved_id"] = saved_id
    return payload


@app.get("/user/history")
def user_history(limit: int = 20, current_user: dict = Depends(get_current_user)):
    """
    Fetch last N predictions for the authenticated user.
    """
    try:
        return get_user_predictions(str(current_user["_id"]), limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User history fetch failed: {e}")


@app.get("/history")
def history(limit: int = 20, label: Optional[str] = None):
    """
    Fetch last N predictions from MongoDB.
    label: phishing | legitimate | None
    """
    try:
        return get_history(limit=limit, label=label)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"History fetch failed: {e}")


@app.get("/stats/summary")
def stats_summary_api(days: int = 30):
    """
    Summary stats for last N days.
    """
    try:
        return stats_summary(days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats summary failed: {e}")


@app.get("/stats/top-domains")
def stats_top_domains_api(days: int = 30, limit: int = 10, label: str = "phishing"):
    """
    Top domains by count (phishing by default).
    """
    try:
        return stats_top_domains(days=days, limit=limit, label=label)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Top domains failed: {e}")


@app.get("/stats/timeline")
def stats_timeline_api(days: int = 30):
    """
    Daily counts timeline for last N days.
    """
    try:
        return stats_timeline(days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timeline failed: {e}")