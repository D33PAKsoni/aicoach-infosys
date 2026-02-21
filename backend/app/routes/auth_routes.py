from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas, auth
from ..oauth import oauth
from fastapi.responses import RedirectResponse, JSONResponse
from jose import jwt, JWTError
from ..core.config import settings



router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        return {"error": "User exists"}

    new_user = models.User(
        email=user.email,
        password_hash=auth.hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    # return {"message": "User registered"}
    token = auth.create_token({"sub": new_user.email})

    response = JSONResponse({"message": "User registered"})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return response


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        return {"error": "Invalid credentials"}
    if not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_token({"sub": db_user.email})

    response = JSONResponse({"message": "Login success"})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return response


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):

    token = await oauth.google.authorize_access_token(request)
    user_info = token["userinfo"]

    db_user = db.query(models.User).filter(
        models.User.email == user_info["email"]
    ).first()

    if not db_user:
        db_user = models.User(
            email=user_info["email"],
            google_id=user_info["sub"]
        )
        db.add(db_user)
        db.commit()

    jwt_token = auth.create_token({"sub": user_info["email"]})


    response = RedirectResponse("http://localhost:5173/dashboard/")

    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

    return response


def get_current_user(request: Request):

    token = request.cookies.get("access_token")

    if not token:
        return None

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")

    except JWTError:
        return None



@router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):

    user_email = get_current_user(request)

    if not user_email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    db_user = db.query(models.User).filter(models.User.email == user_email).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": db_user.id,
        "email": user_email
    }



@router.post("/logout")
def logout():

    response = JSONResponse({"message": "Logged out"})

    response.delete_cookie(
        key="access_token",
        path="/"
    )

    return response

