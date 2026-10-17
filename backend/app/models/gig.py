from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class GigCreateSchema(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    category_id: str
    description: str = Field(..., min_length=20, max_length=3000)
    responsibilities: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(..., min_length=1)
    work_locality_id: str
    work_address: Optional[str] = Field(None, max_length=300)
    shift_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$") # YYYY-MM-DD
    start_time: str = Field(..., pattern=r"^\d{1,2}:\d{2}\s?(AM|PM|am|pm)?$") # e.g. "09:00 AM" or "09:00"
    end_time: str = Field(..., pattern=r"^\d{1,2}:\d{2}\s?(AM|PM|am|pm)?$") # e.g. "05:00 PM" or "17:00"
    is_overnight: bool = False
    duration_hours: float = Field(..., gt=0.0, le=48.0)
    openings: int = Field(..., ge=1, le=100)
    pay_amount: float = Field(..., gt=0.0)
    currency: str = Field("INR", max_length=5)
    pay_unit: str = Field(..., pattern="^(hour|shift|day)$")
    payment_conditions: Optional[str] = Field(None, max_length=300) # e.g. "Daily payout via UPI on shift completion"
    experience_requirements: Optional[str] = Field(None, max_length=300)
    application_deadline: Optional[str] = None # YYYY-MM-DD
    image_url: Optional[str] = None
    publish_now: bool = False

class GigUpdateSchema(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = Field(None, min_length=20, max_length=3000)
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    work_locality_id: Optional[str] = None
    work_address: Optional[str] = None
    shift_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    is_overnight: Optional[bool] = None
    duration_hours: Optional[float] = Field(None, gt=0.0, le=48.0)
    openings: Optional[int] = Field(None, ge=1, le=100)
    pay_amount: Optional[float] = Field(None, gt=0.0)
    pay_unit: Optional[str] = Field(None, pattern="^(hour|shift|day)$")
    payment_conditions: Optional[str] = None
    experience_requirements: Optional[str] = None
    application_deadline: Optional[str] = None
