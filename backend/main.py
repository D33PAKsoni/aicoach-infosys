from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager 
import torch

from app.routes import auth_routes, analysis_routes, vision_routes, session_routes
from app.core.config import settings

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     torch.set_num_threads(1)
#     print("AI Interview Coach: Starting up and loading models...")
#     yield
#     print("AI Interview Coach: Shutting down...")



@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.database import SessionLocal
    from app.models import InterviewSlot

    torch.set_num_threads(1)
    print("AI Interview Coach: Starting up and loading models...")
    
    db = SessionLocal()
    if db.query(InterviewSlot).count() == 0:
        db.add(InterviewSlot(id=1, is_active=False))
        db.add(InterviewSlot(id=2, is_active=False))
        db.commit()
    db.close()
    
    yield
    print("AI Interview Coach: Shutting down...")

app = FastAPI(
    title="AI Interview Coach",
    lifespan=lifespan 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="none"
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis_routes.router, tags=["NLP & AI"])
app.include_router(vision_routes.router, tags=["Vision"])
app.include_router(session_routes.router, tags=["History"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=2)




