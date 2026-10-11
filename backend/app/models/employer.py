from typing import Optional
from pydantic import BaseModel, Field

class EmployerProfileSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    employer_type: str = Field(..., pattern="^(individual|business)$")
    description: str = Field(..., min_length=10, max_length=2000)
    logo_url: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    locality_id: Optional[str] = None
    address: Optional[str] = None

class EmployerUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    employer_type: Optional[str] = Field(None, pattern="^(individual|business)$")
    description: Optional[str] = Field(None, min_length=10, max_length=2000)
    logo_url: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    locality_id: Optional[str] = None
    address: Optional[str] = None
