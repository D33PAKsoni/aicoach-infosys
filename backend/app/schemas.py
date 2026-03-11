from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
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

class SlotRequest(BaseModel):
    user_id: int

class SlotResponse(BaseModel):
    status: str
    slot_id: Optional[int] = None
    wait_time_seconds: Optional[int] = 0
    message: Optional[str] = None

class WaitingStatus(BaseModel):
    active_users: int
    estimated_wait_minutes: float
    wait_time_seconds: int

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str