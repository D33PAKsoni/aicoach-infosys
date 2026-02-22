import os
import io
import uuid
import json
import re
import numpy as np
import whisper
import pypdf
import docx
import anyio 
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pydub import AudioSegment
import speech_recognition as sr
from gtts import gTTS
import pyttsx3
from google import genai
from google.genai import types

from ..core.config import settings

router = APIRouter()

nlp_model = SentenceTransformer('all-mpnet-base-v2', device="cpu")
whisper_model = whisper.load_model("base")
client = genai.Client(api_key=settings.GEMINI_API_KEY)

MODEL_ID = "gemini-2.5-flash" 
chat_sessions = {}
AUDIO_DIR = "temp_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

def get_embedding(text):
    words = text.split()
    chunk_size = 300
    chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
    if not chunks: return np.zeros(768)
    chunk_embeddings = nlp_model.encode(chunks)
    return np.mean(chunk_embeddings, axis=0)

async def extract_text_from_file(file: UploadFile):
    content = await file.read()
    if file.filename.endswith(".pdf"):
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        return "".join([page.extract_text() or "" for page in pdf_reader.pages])
    elif file.filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(content))
        return "\n".join([para.text for para in doc.paragraphs])
    elif file.filename.endswith(".txt"):
        return content.decode("utf-8")
    return ""

def extract_json(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return match.group(0) if match else text

@router.post("/analyze")
async def analyze_match(resume: UploadFile = File(...), jd_file: UploadFile = File(None), jd_text: str = Form(None)):
    if not jd_file and not jd_text:
        raise HTTPException(status_code=400, detail="Provide JD file or text.")
    
    resume_content = await extract_text_from_file(resume)
    jd_content = await extract_text_from_file(jd_file) if jd_file else jd_text

    if not resume_content.strip() or not jd_content.strip():
        raise HTTPException(status_code=400, detail="Extraction failed.")

    r_emb = await anyio.to_thread.run_sync(get_embedding, resume_content)
    j_emb = await anyio.to_thread.run_sync(get_embedding, jd_content)
    
    score = cosine_similarity([r_emb], [j_emb])[0][0]
    
    return {"match_percentage": round(float(score) * 100, 2), "status": "Success"}

@router.post("/transcribe")
def transcribe_audio(audio: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    temp_path = os.path.join(AUDIO_DIR, f"{file_id}_raw")
    pcm_path = os.path.join(AUDIO_DIR, f"{file_id}_fixed.wav")
    
    with open(temp_path, "wb") as f:
        f.write(audio.file.read())

    try:
        audio_segment = AudioSegment.from_file(temp_path)
        duration = audio_segment.duration_seconds
        audio_segment.export(pcm_path, format="wav")
        
        try:
            r = sr.Recognizer()
            with sr.AudioFile(pcm_path) as source:
                audio_data = r.record(source)
                transcript = r.recognize_google(audio_data)
        except:
            result = whisper_model.transcribe(pcm_path)
            transcript = result['text']

        return {"transcript": transcript, "duration": duration}
    except Exception as e:
        return {"transcript": "", "duration": 0}
    finally:
        for path in [temp_path, pcm_path]:
            if os.path.exists(path): os.remove(path)








@router.post("/speak")
async def speak_text(text: str = Form(...)):
    file_id = str(uuid.uuid4())
    audio_path = os.path.join(AUDIO_DIR, f"{file_id}.mp3")
    success = False

    try:
        engine = pyttsx3.init()
        wav_path = os.path.join(AUDIO_DIR, f"{file_id}.wav")
        engine.save_to_file(text, wav_path)
        engine.runAndWait()
        if os.path.exists(wav_path):
            audio_path, success = wav_path, True
    except: pass

    if not success:
        try:
            tts = gTTS(text=text, lang='en')
            tts.save(audio_path)
            success = True
        except:
            raise HTTPException(status_code=500, detail="TTS failed.")

    return FileResponse(audio_path, media_type="audio/mpeg" if audio_path.endswith(".mp3") else "audio/wav")






@router.post("/generate-question")
def generate_question(transcript: str = Form(...), session_id: str = Form(...), resume_context: str = Form(""), jd_context: str = Form("")):
    try:
        if session_id not in chat_sessions:
            system_instruction = (
                f"You are a technical interviewer for: {jd_context}. Resume: {resume_context}. "
                "Return ONLY a JSON object: {'question': str, 'accuracy': int, 'filler_words': list}"
            )
            chat_sessions[session_id] = client.chats.create(
                model=MODEL_ID,
                config=types.GenerateContentConfig(system_instruction=system_instruction)
            )

        response = chat_sessions[session_id].send_message(transcript)
        analysis = json.loads(extract_json(response.text))
        return analysis
    except Exception as e:
        return {"question": "Could not generate question.", "accuracy": 0, "filler_words": []}
