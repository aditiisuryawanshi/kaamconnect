from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ServicePricingSchema(BaseModel):
    amount: float = Field(..., gt=0.0)
    currency: str = Field("INR", max_length=5)
    unit: str = Field(..., pattern="^(hour|task|visit|day)$")
    minimum_charge: Optional[float] = Field(None, ge=0.0)
    additional_notes: Optional[str] = Field(None, max_length=200)

class ServiceListingCreateSchema(BaseModel):
    category_id: str
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=20, max_length=3000)
    pricing: ServicePricingSchema
    service_area_ids: List[str] = Field(..., min_length=1)
    available_days: List[str] = Field(default_factory=lambda: ["mon", "tue", "wed", "thu", "fri", "sat"])
    time_slots: List[str] = Field(default_factory=lambda: ["09:00 - 13:00", "14:00 - 18:00"])
    booking_lead_time_hours: int = Field(2, ge=0, le=72)
    image_urls: List[str] = Field(default_factory=list)
    publish_now: bool = False

class ServiceListingUpdateSchema(BaseModel):
    category_id: Optional[str] = None
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    description: Optional[str] = Field(None, min_length=20, max_length=3000)
    pricing: Optional[ServicePricingSchema] = None
    service_area_ids: Optional[List[str]] = None
    available_days: Optional[List[str]] = None
    time_slots: Optional[List[str]] = None
    booking_lead_time_hours: Optional[int] = Field(None, ge=0, le=72)
    image_urls: Optional[List[str]] = None
