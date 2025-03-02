from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username_or_email: str
    password: str


class UserProfile(BaseModel):
    username: str
    email: str

    class Config:
        orm_mode = True


class ChangePassword(BaseModel):
    email: str
    old_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: datetime
    priority: Optional[str] = "Medium"  # ✅ AI will override this
    reason: Optional[str] = None  # ✅ AI will generate this
    completed: Optional[bool] = False


class TaskResponse(TaskCreate):
    id: int
    priority: str  # ✅ Include priority in response
    reason: Optional[str]  # ✅ Include AI-generated reason in response

    class Config:
        from_attributes = True


# ✅ UserResponse model to fix the error in main.py
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
