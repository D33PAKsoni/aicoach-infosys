# from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Float, Text, Boolean
# from .database import Base
# from sqlalchemy.orm import relationship
# from datetime import datetime, timezone
# from datetime import datetime, timezone

# class InterviewSlot(Base):
#     __tablename__ = "interview_slots"

#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
#     start_time = Column(TIMESTAMP, nullable=True)
#     is_active = Column(Boolean, default=False)


# class User(Base):

#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String(255))
#     password_hash = Column(String(255))
#     full_name = Column(String(100), nullable=False)
#     google_id = Column(String(255))
#     created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
#     interviews = relationship("InterviewSession", back_populates="user")


# class InterviewSession(Base):
#     __tablename__ = "interview_sessions"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     session_uuid = Column(String(255), unique=True) 
#     created_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
#     user = relationship("User", back_populates="interviews")
#     turns = relationship("InterviewTurn", back_populates="session")

# class InterviewTurn(Base):
#     __tablename__ = "interview_turns"

#     id = Column(Integer, primary_key=True, index=True)
#     session_id = Column(Integer, ForeignKey("interview_sessions.id"))
#     question = Column(Text)
#     answer = Column(Text)
#     wpm = Column(Integer)
#     accuracy = Column(Float)
#     fillers = Column(String(255))
#     dominant_behavior = Column(String(50))
    
#     session = relationship("InterviewSession", back_populates="turns")


# class Resume(Base):
#     __tablename__ = "resumes"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     file_name = Column(String(255))
#     file_path = Column(String(355))
#     uploaded_at = Column(TIMESTAMP, default=datetime.now(timezone.utc))
    
#     user = relationship("User")





from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Float, Text, Boolean, func
from .database import Base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class InterviewSlot(Base):
    __tablename__ = "interview_slots"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # Use timezone=True to help SQLAlchemy handle the UTC conversion
    start_time = Column(TIMESTAMP(timezone=True), nullable=True)
    is_active = Column(Boolean, default=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255))
    password_hash = Column(String(255))
    full_name = Column(String(100), nullable=False)
    google_id = Column(String(255))
    # FIX: Use func.now() so MySQL generates the timestamp at insertion
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    interviews = relationship("InterviewSession", back_populates="user")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_uuid = Column(String(255), unique=True) 
    # FIX: Removed parentheses from datetime.now
    created_at = Column(TIMESTAMP, default=func.now())
    
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

# ... repeat for Resume class ...
class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String(255))
    file_path = Column(String(355))
    # FIX: Use func.now()
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
    
    user = relationship("User")