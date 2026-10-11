from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field

class UserRegisterSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    password: str = Field(..., min_length=6, max_length=100)
    preferred_language: str = Field("en", max_length=10)
    role: str = Field("worker", pattern="^(worker|customer|employer)$")

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    preferred_language: Optional[str] = Field(None, max_length=10)

class RoleAddSchema(BaseModel):
    role: str = Field(..., pattern="^(worker|customer|employer)$")
