from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/save-session")
def save_interview_session(data: schemas.InterviewSaveRequest, db: Session = Depends(get_db)):
    try:
        session_record = db.query(models.InterviewSession).filter(
            models.InterviewSession.session_uuid == data.session_id
        ).first()

        if not session_record:
            session_record = models.InterviewSession(session_uuid=data.session_id, user_id=data.user_id)
            db.add(session_record)
            db.flush()

        for turn in data.turns:
            new_turn = models.InterviewTurn(
                session_id=session_record.id,
                question=turn.question,
                answer=turn.answer,
                wpm=turn.wpm,
                accuracy=turn.accuracy,
                fillers=turn.fillers,
                dominant_behavior=turn.commonBehavior
            )
            db.add(new_turn)
        
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-sessions")
def get_sessions(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(models.InterviewSession).filter(
        models.InterviewSession.user_id == user_id
    ).order_by(models.InterviewSession.created_at.desc()).all()
    
    return [{
        "id": s.id, "session_uuid": s.session_uuid, "created_at": s.created_at,
        "turn_count": db.query(models.InterviewTurn).filter(models.InterviewTurn.session_id == s.id).count()
    } for s in sessions]

@router.get("/session-details/{session_id}")
def get_session_details(session_id: int, db: Session = Depends(get_db)):
    return db.query(models.InterviewTurn).filter(models.InterviewTurn.session_id == session_id).all()