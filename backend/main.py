from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager 

from app.routes import auth_routes, analysis_routes, vision_routes, session_routes
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("AI Interview Coach: Starting up and loading models...")
    yield
    print("AI Interview Coach: Shutting down...")

app = FastAPI(
    title="AI Interview Coach",
    lifespan=lifespan 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    same_site="lax"
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis_routes.router, tags=["NLP & AI"])
app.include_router(vision_routes.router, tags=["Vision"])
app.include_router(session_routes.router, tags=["History"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
