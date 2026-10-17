from typing import List, Optional
from pydantic import BaseModel, Field

class JobCreateSchema(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    category_id: Optional[str] = None
    description: str = Field(..., min_length=30, max_length=5000)
    employment_type: str = Field(..., pattern="^(full_time|part_time|contract)$")
    responsibilities: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(..., min_length=1)
    preferred_skills: List[str] = Field(default_factory=list)
    experience_requirements: str = Field(..., min_length=3, max_length=200) # e.g. "1-3 years in retail store operations"
    salary_min: float = Field(..., ge=0.0)
    salary_max: float = Field(..., ge=0.0)
    currency: str = Field("INR", max_length=5)
    pay_period: str = Field(..., pattern="^(month|year|week|day)$")
    benefits: List[str] = Field(default_factory=list) # e.g. ["PF & ESIC", "Paid Leaves", "Overtime Pay"]
    work_locality_id: str
    schedule: str = Field(..., min_length=3, max_length=100) # e.g. "Monday to Saturday, 9:30 AM - 6:30 PM"
    application_deadline: Optional[str] = None # YYYY-MM-DD
    image_url: Optional[str] = None
    publish_now: bool = False

class JobUpdateSchema(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=150)
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = Field(None, min_length=30, max_length=5000)
    employment_type: Optional[str] = Field(None, pattern="^(full_time|part_time|contract)$")
    responsibilities: Optional[List[str]] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    experience_requirements: Optional[str] = None
    salary_min: Optional[float] = Field(None, ge=0.0)
    salary_max: Optional[float] = Field(None, ge=0.0)
    pay_period: Optional[str] = Field(None, pattern="^(month|year|week|day)$")
    benefits: Optional[List[str]] = None
    work_locality_id: Optional[str] = None
    schedule: Optional[str] = None
    application_deadline: Optional[str] = None
