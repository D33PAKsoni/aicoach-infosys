# InterviewMinutes : AI Powered Interview Coach

AI Interview Coach is a full-stack application designed to help candidates prepare for technical interviews. It leverages AI for resume matching, real-time question generation, speech-to-text transcription, and computer vision to analyze interviewee behavior and emotions.

## Features

* **Resume & JD Analysis**: Calculates a match percentage between a user's resume and a job description using sentence embeddings.
* **AI-Powered Mock Interviews**: Generates dynamic technical follow-up questions using Google Gemini based on the candidate's resume and job description.
* **Real-time Transcription**: Converts speech to text using Google STT with a local Whisper fallback.
* **Vision-Based Behavior Metrics**: Uses computer vision to track eye direction, head pose, and detect emotions (e.g., confidence, anxiety) during the interview.
* **Speech Synthesis**: Provides text-to-speech capabilities using `pyttsx3` and `gTTS`.
* **Secure Authentication**: Includes JWT-based authentication and Google OAuth integration.
* **Session History**: Saves and retrieves previous interview performance statistics, including accuracy and filler word detection.

## Tech Stack

### Frontend

* **React 19** with **Vite**

### Backend

* **FastAPI**: High-performance Python framework.
* **SQLAlchemy & MySQL**: Database management.
* **AI/ML Libraries**:
* **OpenAI Whisper**: Local speech-to-text.
* **Sentence-Transformers**: NLP embeddings.
* **OpenCV & PyTorch**: Vision and emotion detection.
* **Google Gemini API**: Dynamic question generation.



---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher)
* **Python** (3.10 or higher)
* **MySQL Server**
* **FFmpeg** (required for Whisper and audio processing)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/D33PAKsoni/aicoach-infosys.git
cd ai-interview-coach

```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend

```


2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```


3. Install dependencies:
```bash
pip install -r requirements.txt

```


4. Create a `.env` file in the `backend/` directory and configure your variables:
```env
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_DB=interview_coach_db
SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=optional_for_oauth
GOOGLE_CLIENT_SECRET=optional_for_oauth

```



### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend

```


2. Install dependencies:
```bash
npm install

```


3. Ensure your API configuration in `src/api.js` points to your backend URL (default is `http://localhost:8000`).

---

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
python main.py

```

The server will start at `http://localhost:8000`.

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev

```

The application will be available at `http://localhost:5173`.

---

## Project Structure

* `/frontend`: React application using Vite.
* `/backend/main.py`: FastAPI entry point and WebSocket handlers.
* `/backend/app/routes`: API endpoints for authentication, vision, and analysis.
* `/backend/vision`: Custom computer vision pipelines for emotion and behavior tracking.
* `/backend/app/core/config.py`: Centralized configuration using Pydantic Settings.

## License

This project is licensed under the MIT License.