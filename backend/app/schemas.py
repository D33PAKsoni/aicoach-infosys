from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

from typing import List, Optional

class TurnData(BaseModel):
    question: str
    answer: str
    wpm: int
    accuracy: float
    fillers: str
    commonBehavior: str

class InterviewSaveRequest(BaseModel):
    session_id: str
    user_id: Optional[int] = None
    turns: List[TurnData]