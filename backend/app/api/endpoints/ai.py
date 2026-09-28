from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

class FreshnessRequest(BaseModel):
    food_type: str
    quantity: str
    preparation_time: str
    storage_condition: Optional[str] = "Room Temperature"

@router.post("/assess-freshness")
def assess_food_freshness(
    request: FreshnessRequest,
    current_user: User = Depends(get_current_user)
):
    """
    AI Feature (Phase 5): Calculates estimated safe pickup window & safety recommendations.
    """
    food_lower = request.food_type.lower()

    if "cooked" in food_lower or "meal" in food_lower or "curry" in food_lower:
        suggested_hours = 4 if "room" in request.storage_condition.lower() else 24
        advice = "Cooked hot meals should be distributed within 4 hours if kept ambient, or chilled below 5°C."
    elif "bakery" in food_lower or "bread" in food_lower:
        suggested_hours = 48
        advice = "Keep baked items in dry, clean containers away from moisture."
    elif "produce" in food_lower or "fruit" in food_lower or "vegetable" in food_lower:
        suggested_hours = 72
        advice = "Inspect for bruises and keep in a cool, ventilated place."
    else:
        suggested_hours = 12
        advice = "Verify sealed packaging and inspect item condition prior to transfer."

    return {
        "suggested_pickup_window_hours": suggested_hours,
        "food_safety_advice": advice,
        "is_ai_generated": True
    }
