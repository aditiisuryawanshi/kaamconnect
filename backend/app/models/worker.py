from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WorkerOnboardingSchema(BaseModel):
    headline: str = Field(..., min_length=3, max_length=120)
    bio: str = Field(..., min_length=10, max_length=1000)
    profile_photo_url: Optional[str] = None
    preferred_locality_ids: List[str] = Field(default_factory=list)
    work_preferences: List[str] = Field(..., min_length=1) # e.g. ["services", "gigs", "jobs"]
    skills: List[str] = Field(default_factory=list)
    experience_years: float = Field(0.0, ge=0.0, le=50.0)
    available_weekdays: List[str] = Field(default_factory=list) # e.g. ["mon", "tue", "wed", "thu", "fri", "sat"]
    preferred_shifts: List[str] = Field(default_factory=list) # e.g. ["morning", "afternoon", "evening", "night"]

class WorkerProfileUpdateSchema(BaseModel):
    headline: Optional[str] = Field(None, min_length=3, max_length=120)
    bio: Optional[str] = Field(None, min_length=10, max_length=1000)
    profile_photo_url: Optional[str] = None
    preferred_locality_ids: Optional[List[str]] = None
    work_preferences: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[float] = Field(None, ge=0.0, le=50.0)
    profile_visibility: Optional[str] = Field(None, pattern="^(public|private)$")
    available_weekdays: Optional[List[str]] = None
    preferred_shifts: Optional[List[str]] = None
