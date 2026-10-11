from typing import Optional
from pydantic import BaseModel, Field

class ApplicationSubmitSchema(BaseModel):
    listing_type: str = Field(..., pattern="^(gig|job)$")
    listing_id: str
    cover_note: Optional[str] = Field(None, max_length=1000)

class ApplicationStatusActionSchema(BaseModel):
    employer_notes: Optional[str] = Field(None, max_length=1000)
    reason: Optional[str] = Field(None, max_length=500)
