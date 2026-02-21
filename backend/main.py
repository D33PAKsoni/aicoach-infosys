# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.sessions import SessionMiddleware

# from app.routes import auth_routes, analysis_routes, vision_routes, session_routes
# from app.core.config import settings

# app = FastAPI(title="AI Interview Coach")

# # Middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.add_middleware(
#     SessionMiddleware,
#     secret_key=settings.SECRET_KEY,
#     same_site="lax"
# )

# # Include Routers
# app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
# app.include_router(analysis_routes.router, tags=["NLP & AI"])
# app.include_router(vision_routes.router, tags=["Vision"])
# app.include_router(session_routes.router, tags=["History"])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)




















from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager # Added for lifespan

from app.routes import auth_routes, analysis_routes, vision_routes, session_routes
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load shared resources/models here if needed
    print("AI Interview Coach: Starting up and loading models...")
    yield
    # Shutdown: Clean up resources
    print("AI Interview Coach: Shutting down...")

app = FastAPI(
    title="AI Interview Coach",
    lifespan=lifespan # Register lifespan
)

# Middleware
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

# Include Routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis_routes.router, tags=["NLP & AI"])
app.include_router(vision_routes.router, tags=["Vision"])
app.include_router(session_routes.router, tags=["History"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)












# from fastapi import FastAPI, File, UploadFile, Form, HTTPException, WebSocket
# from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.sessions import SessionMiddleware
# from app.routes import auth_routes

# import os
# import io
# import uuid
# import numpy as np
# import json
# import pypdf
# import docx
# import whisper
# import pyttsx3
# import base64
# import cv2
# from collections import deque
# import base64
# import numpy as np
# from PIL import Image

# import speech_recognition as sr
# from gtts import gTTS
# from fastapi.responses import FileResponse
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity



# from pydub import AudioSegment

# from google import genai
# from google.genai import types


# from torchvision import models


# from vision.face_pipeline import analyze_face, crop_face
# from vision.emotion_model import predict_emotion
# from vision.behavior_metrics import get_interview_prediction
# from vision.gaze_and_pose import get_eye_direction, get_head_pose, detect_cheating

# from dotenv import load_dotenv

# from google import genai
# from google.genai import types

# import re


# from app.database import SessionLocal
# from app import models, schemas

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# app.add_middleware(
#     SessionMiddleware,
#     secret_key="aicoach_session",
#     same_site="lax"
# )

# app.include_router(auth_routes.router, prefix="/auth")


# load_dotenv()
# print("Loading NLP Model...")
# nlp_model = SentenceTransformer('all-mpnet-base-v2', device="cpu")
# print("Loading Whisper...")
# whisper_model = whisper.load_model("base")
# print("Models Ready.")

# AUDIO_DIR = "temp_audio"
# os.makedirs(AUDIO_DIR, exist_ok=True)



# def get_embedding(text):
#     words = text.split()
#     chunk_size = 300
#     chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
#     if not chunks: return np.zeros(768)
#     chunk_embeddings = nlp_model.encode(chunks)
#     return np.mean(chunk_embeddings, axis=0)

# async def extract_text_from_file(file: UploadFile):
#     content = await file.read()
#     if file.filename.endswith(".pdf"):
#         pdf_reader = pypdf.PdfReader(io.BytesIO(content))
#         return "".join([page.extract_text() or "" for page in pdf_reader.pages])
#     elif file.filename.endswith(".docx"):
#         doc = docx.Document(io.BytesIO(content))
#         return "\n".join([para.text for para in doc.paragraphs])
#     elif file.filename.endswith(".txt"):
#         return content.decode("utf-8")
#     return ""


# @app.post("/analyze")
# async def analyze_match(resume: UploadFile = File(...), jd_file: UploadFile = File(None), jd_text: str = Form(None)):
#     if not jd_file and not jd_text:
#         raise HTTPException(status_code=400, detail="Provide JD file or text.")
    
#     resume_content = await extract_text_from_file(resume)
#     jd_content = await extract_text_from_file(jd_file) if jd_file else jd_text

#     if not resume_content.strip() or not jd_content.strip():
#         raise HTTPException(status_code=400, detail="Extraction failed.")

#     r_emb = get_embedding(resume_content)
#     j_emb = get_embedding(jd_content)
#     score = cosine_similarity([r_emb], [j_emb])[0][0]
    
#     return {"match_percentage": round(float(score) * 100, 2), "status": "Success"}

# #     file_id = str(uuid.uuid4())
# #     temp_path = os.path.join(AUDIO_DIR, f"{file_id}_raw")
# #     pcm_path = os.path.join(AUDIO_DIR, f"{file_id}_fixed.wav")
    
# #     with open(temp_path, "wb") as f:
# #         f.write(audio.read())

# #     try:

# #         audio_segment = AudioSegment.from_file(temp_path)
# #         audio_segment.export(pcm_path, format="wav")
        
# #         transcript = ""
# #         try:
# #             r = sr.Recognizer()
# #             with sr.AudioFile(pcm_path) as source:
# #                 audio_data = r.record(source)
# #                 transcript = r.recognize_google(audio_data)
# #                 print("--- Success: System/Google STT ---")
# #         except Exception as e:
# #             print(f"System STT failed: {e}. Falling back to Whisper...")
# #             result = whisper_model.transcribe(pcm_path)
# #             transcript = result['text']
# #             print("--- Success: Local Whisper ---")

# #         return {"transcript": transcript}

# #     except Exception as e:
# #         print(f"Audio conversion failed: {e}")
# #         result = whisper_model.transcribe(temp_path)
# #         return {"transcript": result['text']}
        
# #     finally:
# #         for path in [temp_path, pcm_path]:
# #             if os.path.exists(path): os.remove(path)

# @app.post("/speak")
# async def speak_text(text: str = Form(...)):
#     file_id = str(uuid.uuid4())
#     audio_path = os.path.join(AUDIO_DIR, f"{file_id}.mp3")
    
#     success = False

#     try:
#         engine = pyttsx3.init()
#         wav_path = os.path.join(AUDIO_DIR, f"{file_id}.wav")
#         engine.save_to_file(text, wav_path)
#         engine.runAndWait()
        
#         if os.path.exists(wav_path):
#             audio_path = wav_path 
#             success = True
#             print("Generated speech using system pyttsx3")
#     except Exception as e:
#         print(f"System TTS failed: {e}. Falling back to gTTS...")


#     if not success:
#         try:
#             tts = gTTS(text=text, lang='en')
#             tts.save(audio_path)
#             success = True
#             print("Generated speech using gTTS")
#         except Exception as e:
#             raise HTTPException(status_code=500, detail="All TTS engines failed.")

#     return FileResponse(audio_path, media_type="audio/mpeg" if audio_path.endswith(".mp3") else "audio/wav")



# client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# MODEL_ID = "gemini-2.5-flash" 

# chat_sessions = {}


# def extract_json(text):
#     match = re.search(r'\{.*\}', text, re.DOTALL)
#     return match.group(0) if match else text

# @app.post("/transcribe")
# def transcribe_audio(audio: UploadFile = File(...)):
#     file_id = str(uuid.uuid4())
#     temp_path = os.path.join(AUDIO_DIR, f"{file_id}_raw")
#     pcm_path = os.path.join(AUDIO_DIR, f"{file_id}_fixed.wav")
    
#     with open(temp_path, "wb") as f:
#         f.write(audio.file.read())

#     duration_seconds = 0
#     try:
#         audio_segment = AudioSegment.from_file(temp_path)
#         duration_seconds = audio_segment.duration_seconds
#         audio_segment.export(pcm_path, format="wav")
        
#         transcript = ""
#         try:
#             r = sr.Recognizer()
#             with sr.AudioFile(pcm_path) as source:
#                 audio_data = r.record(source)
#                 transcript = r.recognize_google(audio_data)
#         except Exception as e:
#             print(f"System STT failed: {e}. Falling back to Whisper...")
#             result = whisper_model.transcribe(pcm_path)
#             transcript = result['text']


#         return {"transcript": transcript, "duration": duration_seconds}

#     except Exception as e:
#         print(f"Audio processing failed: {e}")
#         try:
#             result = whisper_model.transcribe(temp_path)
#             return {"transcript": result['text'], "duration": 0}
#         except:
#             return {"transcript": "", "duration": 0}
        
#     finally:
#         for path in [temp_path, pcm_path]:
#             if os.path.exists(path): os.remove(path)

# @app.post("/generate-question")
# def generate_question(
#     transcript: str = Form(...), 
#     session_id: str = Form(...),
#     resume_context: str = Form(""), 
#     jd_context: str = Form("")
# ):
#     try:
#         if session_id not in chat_sessions:
#             system_instruction = (
#                 f"You are a technical interviewer for this Job: {jd_context}. "
#                 f"Candidate Resume: {resume_context}. "
#                 "For every response, return ONLY a JSON object with these keys: "
#                 "'question' (your next brief technical follow-up), "
#                 "'accuracy' (score from 0-100 based on technical correctness), "
#                 "'filler_words' (list of filler words like 'um', 'uh', 'like' detected)."
#             )

#             chat_sessions[session_id] = client.chats.create(
#                 model=MODEL_ID,
#                 config=types.GenerateContentConfig(system_instruction=system_instruction)
#             )

#         response = chat_sessions[session_id].send_message(transcript)
        
#         clean_json = extract_json(response.text)
#         try:
#             analysis = json.loads(clean_json)
#         except Exception as json_err:
#             print(f"JSON Parse Error: {json_err}. Raw text: {response.text}")
#             analysis = {
#                 "question": response.text, 
#                 "accuracy": 0, 
#                 "filler_words": []
#             }

#         return analysis

#     except Exception as e:
#         print(f"Gemini API Error: {e}")
#         return {
#             "question": "Please check API Key or Internet connection?", 
#             "accuracy": 0, 
#             "filler_words": []
#         }


# @app.websocket("/ws/vision")
# async def vision_ws(websocket: WebSocket):
#     await websocket.accept()

#     emotion_buffer = deque(maxlen=5)

#     try:
#         while True:
#             data = await websocket.receive_text()
#             img_bytes = base64.b64decode(data)
#             np_arr = np.frombuffer(img_bytes, np.uint8)
#             frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

#             face_data = analyze_face(frame)

#             behavior = "No Face"
#             eye_direction = "Unknown"
#             yaw, pitch, roll = 0, 0, 0
#             possible_cheating = False

#             if face_data["face_detected"]:
#                 face_crop = crop_face(frame, face_data["landmarks"][0])
#                 if face_crop is None or face_crop.size == 0:
#                     continue

#                 face_crop = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
#                 face_crop = cv2.equalizeHist(face_crop)
#                 face_crop = cv2.cvtColor(face_crop, cv2.COLOR_GRAY2RGB)

#                 face_img = Image.fromarray(face_crop)
#                 probs = predict_emotion(face_img)

#                 emotion_buffer.append(probs.cpu().numpy())
#                 avg_probs = np.mean(emotion_buffer, axis=0)
#                 behavior = get_interview_prediction(avg_probs)


#                 eye_direction = get_eye_direction(
#                     face_data["landmarks"][0],
#                     frame.shape[1]
#                 )

#                 yaw, pitch, roll = get_head_pose(
#                     face_data["transform_matrix"]
#                 )
#                 possible_cheating = detect_cheating(yaw, pitch)

#             print("Behavior:", behavior)

#             await websocket.send_json({
#                 "faceDetected": face_data["face_detected"],
#                 "eyesTracked": face_data["eye_tracked"],
#                 "eyeDirection": eye_direction,
#                 "behaviorMetric": behavior,
#                 "headPose": {
#                     "yaw": round(yaw, 2),
#                     "pitch": round(pitch, 2),
#                     "roll": round(roll, 2)
#                 },
#                 "possibleCheating": possible_cheating
#             })

#     except Exception as e:
#         print("WebSocket closed:", e)
#         await websocket.close()


# @app.post("/save-session")
# def save_interview_session(data: schemas.InterviewSaveRequest):
#     db = SessionLocal()
#     try:
#         # 1. Create or find the session
#         session_record = db.query(models.InterviewSession).filter(
#             models.InterviewSession.session_uuid == data.session_id
#         ).first()

#         if not session_record:
#             session_record = models.InterviewSession(
#                 session_uuid=data.session_id,
#                 user_id=data.user_id
#             )
#             db.add(session_record)
#             db.flush() # Get session_record.id

#         # 2. Save all turns in the session
#         for turn in data.turns:
#             new_turn = models.InterviewTurn(
#                 session_id=session_record.id,
#                 question=turn.question,
#                 answer=turn.answer,
#                 wpm=turn.wpm,
#                 accuracy=turn.accuracy,
#                 fillers=turn.fillers,
#                 dominant_behavior=turn.commonBehavior
#             )
#             db.add(new_turn)
        
#         db.commit()
#         return {"status": "success", "message": "Session saved"}
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         db.close()



# @app.get("/get-sessions")
# def get_sessions(user_id: int):
#     db = SessionLocal()
#     sessions = db.query(models.InterviewSession).filter(
#         models.InterviewSession.user_id == user_id
#     ).order_by(models.InterviewSession.created_at.desc()).all()
    
#     result = []
#     for s in sessions:
#         turn_count = db.query(models.InterviewTurn).filter(models.InterviewTurn.session_id == s.id).count()
#         result.append({
#             "id": s.id,
#             "session_uuid": s.session_uuid,
#             "created_at": s.created_at,
#             "turn_count": turn_count
#         })
#     db.close()
#     return result

# @app.get("/session-details/{session_id}")
# def get_session_details(session_id: int):
#     db = SessionLocal()
#     turns = db.query(models.InterviewTurn).filter(
#         models.InterviewTurn.session_id == session_id
#     ).all()
#     db.close()
#     return turns



