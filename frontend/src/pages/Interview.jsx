import React, { useState, useRef, useEffect, useContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Loader2, Video, Eye, UserCheck, PhoneOff, AlertTriangle } from 'lucide-react';
import API from '../api'; 
import { AuthContext } from "../context/AuthContext";
import '../styles/Interview.css';

const calculateMostCommon = (arr) => {
  if (!arr || arr.length === 0) return "NA";
  const frequency = {};
  let maxFreq = 0;
  let mode = arr[0];
  for (const val of arr) {
    frequency[val] = (frequency[val] || 0) + 1;
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      mode = val;
    }
  }
  return mode;
};

const SILENCE_THRESHOLD = 15;
const SILENCE_DURATION = 1500;
const INITIAL_TIMER = 900;

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  

  const interviewHistory = useRef([]);
  const currentQuestionRef = useRef("Hello! I am your AI Interviewer. Please introduce yourself.");
  const isListeningRef = useRef(false);
  const behaviorLogRef = useRef([]);
  const sessionIdRef = useRef(`session_${Math.random().toString(36).substring(2, 11)}`);
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timeRef = useRef(null);
  const secondsLeft = useRef(INITIAL_TIMER);

  const [showWarning, setShowWarning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState(currentQuestionRef.current);
  const [lastMetrics, setLastMetrics] = useState(null);
  const [metrics, setMetrics] = useState({
    faceDetected: false,
    eyesTracked: false,
    eyeDirection: "Center",
    behaviorMetric: "Analyzing",
    headPose: { yaw: 0, pitch: 0, roll: 0 },
    possibleCheating: false
  });

  const { resume } = location.state || {};


  useEffect(() => {
    if (!resume) {
      alert("No Resume JD data found. Please upload a Resume and JD first.");
      navigate('/dashboard');
    } else {
      startWebcam();
      speakAndListen(aiResponse);
    }
    return () => stopAll();
  }, []);


  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);


  useEffect(() => {
    const handleFocusLoss = () => setShowWarning(true);
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setShowWarning(true);
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      secondsLeft.current -= 1;
      if (timeRef.current) {
        const minutes = Math.floor(secondsLeft.current / 60);
        const seconds = secondsLeft.current % 60;
        timeRef.current.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
      if (secondsLeft.current <= 0) {
        clearInterval(interval);
        alert("Interview time is up!");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/vision");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
      if (isListeningRef.current && data.faceDetected) {
        behaviorLogRef.current.push(data.behaviorMetric);
      }
    };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN && videoRef.current?.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
        wsRef.current.send(base64);
      }
    }, 300);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopAll = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioContextRef.current) audioContextRef.current.close();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processTurn(blob);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      startSilenceDetection(stream);
    } catch (e) {
      console.error("Mic access denied", e);
    }
  };

  const startSilenceDetection = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    source.connect(analyserRef.current);
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const checkVolume = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      
      if (volume > SILENCE_THRESHOLD) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => stopRecording(), SILENCE_DURATION);
      }
      
      if (mediaRecorderRef.current?.state === 'recording') {
        requestAnimationFrame(checkVolume);
      }
    };
    checkVolume();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processTurn = async (blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob);
      
      const transRes = await API.post("/transcribe", formData);
      const { transcript, duration } = transRes.data;

      const wordCount = transcript.trim().split(/\s+/).filter(w => w.length > 0).length;
      const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

      const chatData = new FormData();
      chatData.append("transcript", transcript);
      chatData.append("session_id", sessionIdRef.current);
      
      const chatRes = await API.post("/generate-question", chatData);

      const topBehavior = calculateMostCommon(behaviorLogRef.current);
      const turnResult = {
        question: currentQuestionRef.current,
        answer: transcript,
        wpm,
        accuracy: chatRes.data.accuracy || 0,
        fillers: chatRes.data.filler_words?.join(", ") || "None",
        commonBehavior: topBehavior
      };

      interviewHistory.current.push(turnResult);
      setLastMetrics(turnResult);
      setTranscript(transcript);
      
      const nextQuestion = chatRes.data.question;
      setAiResponse(nextQuestion);
      currentQuestionRef.current = nextQuestion;
      behaviorLogRef.current = [];
      
      speakAndListen(nextQuestion);
    } catch (err) {
      console.error("Error processing interview turn:", err);
    } finally {
      setLoading(false);
    }
  };

  const speakAndListen = async (text) => {
    try {
      const speakFormData = new FormData();
      speakFormData.append("text", text);
      const speakRes = await API.post("/speak", speakFormData, { responseType: 'blob' });
      const audio = new Audio(URL.createObjectURL(speakRes.data));
      audio.onended = () => startRecording();
      audio.play();
    } catch (err) {
      console.error("Speech synthesis failed:", err);
    }
  };

  const handleQuit = async () => {
      try {
        await API.post("/save-session", {
          session_id: sessionIdRef.current,
          user_id: user?.id,
          turns: interviewHistory.current
        });
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to save session:", err);
        alert("Error saving session. Please try again.");
      }
  };

  
  const behaviorColor = useMemo(() => {
    const map = { Composed: "white", Stressed: "yellow", Confident: "green" };
    return map[metrics.behaviorMetric] || "red";
  }, [metrics.behaviorMetric]);

  if (!resume) return <div>Redirecting to dashboard...</div>;

  return (
    <div className="interview-conatiner">         
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline muted className="webcam-feed" />
      </div>
      <div className="interview-dash">
        <div className="interview-dash-head">
          <div className="recording-video">
            <div className="red-dot"></div>
            <p>Recording</p>
          </div>
          <div>
            <div className="timer"><p>Time Left :</p><span ref={timeRef}>15:00</span></div>
            <div className="quit" onClick={handleQuit}> 
              <div className="quit-dot"><PhoneOff color='white'/></div>
              <p>Quit Interview</p>
            </div>
          </div>
        </div>

        <div className="ai-window">
          <p className="ai-coach-label">AI Coach</p>
          {isListening ? (
            <>
              <p>Listening</p>
              <Mic color='green' />
            </>
          ) : (
            <>
              <p>Processing...</p>
              <span className='spinner'><Loader2 color='white' size={30} /></span>
            </>
          )}
        </div>

        <div className="transcription-windows">
          <div className="ai-interviewer">
            <p className="name-label">AI Interviewer:</p>
            <p className='response'>{aiResponse}</p>
          </div>
          <div className="user-response">
            <p className="name-label">Previous Answer:</p>
            <p className='response'>{transcript}</p>
          </div>
        </div>

        <div className="answer-metrics">
          {lastMetrics ? (
            <>
              <div className="wpm"><p>Words Per Minute: {lastMetrics.wpm}</p></div>
              <div className="filler-words"><p>Filler Words: {lastMetrics.fillers}</p></div>
              <div className="accuracy"><p>Answer Accuracy: {lastMetrics.accuracy}%</p></div>
              <div className="confidence"><p>Confidence Level: {lastMetrics.commonBehavior}</p></div>
            </>
          ) : (
            <p>Metrics will appear after your first response.</p>
          )}
        </div>

        <div className="metrics-panel">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className='metric-name'>
                <Eye size={40} color={metrics.eyeDirection === "Center" ? "white" : "red"}/>
                <span>Eye Direction</span>
              </div>
              <span className="metric-value">{metrics.faceDetected ? metrics.eyeDirection : "Face Not Detected"}</span>
            </div>

            <div className="metric-card">
              <div className='metric-name'>
                <UserCheck size={40} color={behaviorColor}/>
                <span>Behavior</span>
              </div>
              <span className="metric-value">{metrics.faceDetected ? metrics.behaviorMetric : "Face Not Detected"}</span>
            </div>

            <div className="metric-card">
              <div className='metric-name'>
                <Video size={40} color={metrics.possibleCheating ? "red" : "white"}/>
                <span>Attention</span>
              </div>
              <span className="metric-value">
                {metrics.faceDetected ? (metrics.possibleCheating ? "Suspicious" : "Normal") : "Face Not Detected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="security-overlay">
          <div className="security-popup">
            <AlertTriangle size={60} color="#f87171" />
            <h2>Not Allowed</h2>
            <p>Your session is being monitored. Please stay within the interview window to avoid disqualification.</p>
            <button className="return-btn" onClick={() => setShowWarning(false)}>
              Return to Interview
            </button>
          </div>
        </div>
      )}
    </div> 
  );
};

export default Interview;