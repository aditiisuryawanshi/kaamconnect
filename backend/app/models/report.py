from typing import Optional
from pydantic import BaseModel, Field

class ReportCreateSchema(BaseModel):
    target_type: str = Field(..., pattern="^(service|gig|job|user|profile)$")
    target_id: str
    reason: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=10, max_length=1500)

class ReportResolveSchema(BaseModel):
    resolution: str = Field(..., pattern="^(dismissed|action_taken|content_removed|user_suspended)$")
    resolution_notes: str = Field(..., min_length=5, max_length=1000)
