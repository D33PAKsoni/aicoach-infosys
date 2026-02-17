from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Float, Text
from .database import Base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255))
    password_hash = Column(String(255))
    google_id = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
    interviews = relationship("InterviewSession", back_populates="user")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_uuid = Column(String(255), unique=True) 
    created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="interviews")
    turns = relationship("InterviewTurn", back_populates="session")

class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    question = Column(Text)
    answer = Column(Text)
    wpm = Column(Integer)
    accuracy = Column(Float)
    fillers = Column(String(255))
    dominant_behavior = Column(String(50))
    
    session = relationship("InterviewSession", back_populates="turns")