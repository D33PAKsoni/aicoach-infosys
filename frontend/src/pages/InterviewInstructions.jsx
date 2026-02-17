import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ShieldCheck, Camera, Mic, Wifi, Maximize, 
    Play, ArrowLeft, Info, AlertTriangle, Monitor 
} from 'lucide-react';
import '../styles/InterviewInstructions.css';

const InterviewInstructions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { resume, jd, score } = location.state || {};

    const handleStartInterview = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        }

        navigate('/interview', { state: { resume, jd, score } });
    };

    return (
        <div className="instructions-page">
            <div className="video-background">
                <video
                  autoPlay
                  muted
                  loop
                >
                  <source src="src/assets/videoplayback5.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
            </div>
            <div className="instructions-overlay">
   

                <div className="instructions-card">
                    <div className="header-section">
                        <ShieldCheck size={48} color="#4ade80" />
                        <h2>Interview Guidelines</h2>
                        <p>Please read the following requirements carefully to ensure a smooth experience.</p>
                    </div>

                    <div className="guidelines-grid">
                        <div className="guideline-item">
                            <Monitor size={24} className="g-icon" />
                            <div>
                                <h4>Fullscreen Mode</h4>
                                <p>The interview will run in fullscreen. Exiting fullscreen may flag the session for suspicious activity.</p>
                            </div>
                        </div>

                        <div className="guideline-item">
                            <Camera size={24} className="g-icon" />
                            <div>
                                <h4>Camera & Mic</h4>
                                <p>Ensure your camera is at eye level and your microphone is working in a quiet environment.</p>
                            </div>
                        </div>

                        <div className="guideline-item">
                            <Wifi size={24} className="g-icon" />
                            <div>
                                <h4>Connectivity</h4>
                                <p>A stable internet connection is required for real-time AI transcription and behavior analysis.</p>
                            </div>
                        </div>

                        <div className="guideline-item">
                            <Info size={24} className="g-icon" />
                            <div>
                                <h4>Behavioral Tracking</h4>
                                <p>The AI will monitor gaze, posture, and expressions to provide comprehensive feedback.</p>
                            </div>
                        </div>
                    </div>

                    <div className="warning-box">
                        <AlertTriangle size={20} color="#f87171" />
                        <span>Do not refresh the page or switch tabs once the interview starts.</span>
                    </div>

                    <div className="action-section">
                        <button className="start-interview-btn" onClick={handleStartInterview}>
                            <Play size={20} fill="black" /> Start Mock Interview
                        </button>
                        <p className="fullscreen-hint">Clicking will enter Fullscreen mode automatically</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewInstructions;