from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.api import api_router

# Import models so Base.metadata knows about all tables before create_all
from app.models.user import User  # noqa
from app.models.listing import FoodListing  # noqa

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend API for FoodRescue AI platform connecting food donors with organizations."
)

# CORS configuration to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to FoodRescue AI Backend API",
        "docs": "/docs",
        "status": "healthy"
    }
