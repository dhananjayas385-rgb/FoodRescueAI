from fastapi import APIRouter
from app.api.endpoints import auth, listings, admin, ai

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(listings.router, prefix="/listings", tags=["Food Listings"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Portal"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Advisor"])
