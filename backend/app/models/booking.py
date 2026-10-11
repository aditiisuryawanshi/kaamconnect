from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class BookingCreateSchema(BaseModel):
    service_listing_id: str
    scheduled_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$") # YYYY-MM-DD
    scheduled_time_slot: str = Field(..., min_length=3, max_length=50) # e.g. "10:00 AM - 12:00 PM"
    service_locality_id: str
    service_address: str = Field(..., min_length=10, max_length=500)
    customer_instructions: Optional[str] = Field(None, max_length=1000)
    estimated_hours: Optional[float] = Field(1.0, ge=0.5, le=24.0)

class BookingCancelSchema(BaseModel):
    reason: str = Field(..., min_length=5, max_length=300)

class BookingStatusUpdateSchema(BaseModel):
    notes: Optional[str] = Field(None, max_length=300)
