from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas
from datetime import datetime, timezone, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()



def refresh_slots(db: Session):
    expiry_time = datetime.now(timezone.utc) - timedelta(minutes=12)
    expired_slots = db.query(models.InterviewSlot).filter(
        models.InterviewSlot.is_active == True,
        models.InterviewSlot.start_time < expiry_time
    ).all()
    
    for slot in expired_slots:
        slot.is_active = False
        slot.user_id = None
    db.commit()

def available_slots(db: Session):
    refresh_slots(db)
    return db.query(models.InterviewSlot).filter(
        models.InterviewSlot.is_active == False
    ).first()



@router.get("/check-slots")
def check_slots(db: Session = Depends(get_db)):

    available_slot = available_slots(db)
    if available_slot:
        return {"status": "available", "slot_id": available_slot.id}
    
    
    earliest_session = db.query(models.InterviewSlot).filter(
        models.InterviewSlot.is_active == True
    ).order_by(models.InterviewSlot.start_time.asc()).first()

    if not earliest_session:
        return {"status": "error", "message": "No slots configured."}

    now = datetime.now(timezone.utc)
    start_time = earliest_session.start_time
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
        
    elapsed = now - start_time
    total_duration_seconds = 15 * 60
    remaining_seconds = max(0, total_duration_seconds - elapsed.total_seconds())


    return {"status": "full", 
            "wait_time_seconds": int(remaining_seconds),
            "message": "All interview slots are currently full."}


@router.post("/acquire-slot")
def acquire_slot(data: schemas.SlotRequest, db: Session = Depends(get_db)):

    available_slot = available_slots(db)

    if available_slot:
        available_slot.user_id = data.user_id
        available_slot.start_time = datetime.now(timezone.utc)
        available_slot.is_active = True
        db.commit()
        return {"status": "success", "slot_id": available_slot.id}
    else:
        return {
        "status": "full",
        "message": "All interview slots are currently full. Please wait and try again."}




@router.post("/release-slot/{user_id}")
def release_slot(user_id: int, db: Session = Depends(get_db)):
    slot = db.query(models.InterviewSlot).filter(
        models.InterviewSlot.user_id == user_id
    ).first()
    if slot:
        slot.is_active = False
        slot.user_id = None
        db.commit()
    return {"status": "released"}






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
