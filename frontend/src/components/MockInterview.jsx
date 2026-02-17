import React, { useState } from 'react';
import axios from 'axios';
import { FileUp, FileText, CheckCircle2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import '../styles/Resume.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MockInterview = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);
    const [jdText, setJdText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    


    const navigate = useNavigate();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!resumeFile || (!jdFile && !jdText)) {
            setError("Please provide both a Resume and a Job Description.");
            return;
        }

        setError("");
        setLoading(true);
        const formData = new FormData();
        formData.append("resume", resumeFile);
        if (jdFile) formData.append("jd_file", jdFile);
        if (jdText) formData.append("jd_text", jdText);

        try {
            const response = await axios.post("http://localhost:8000/analyze", formData);
            setResult(response.data);
        } catch (err) {
            setError("Analysis failed. Please check your file formats.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-match-page">
            <h2 className="match-title">Mock Interview</h2>
            
            <div className="match-grid">
                <form className="upload-container" onSubmit={handleAnalyze}>
                    <div className="upload-card">
                        <div className="card-label"><FileText size={18} /> Resume</div>
                        <label className="file-drop-zone" >
                            <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={(e) => setResumeFile(e.target.files[0])} />
                            <FileUp className={resumeFile ? "active-icon" : ""} />
                            <p>{resumeFile ? resumeFile.name : "Upload Resume (PDF/DOCX)"}</p>
                        </label>
                    </div>

                    <div className="upload-card">
                        <div className="card-label"><Search size={18} /> Job Description</div>
                        <label className="file-drop-zone" >
                            <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={(e) => setJdFile(e.target.files[0])} />
                            <FileUp className={jdFile ? "active-icon" : ""} />
                            <p>{jdFile ? jdFile.name : "Upload JD File"}</p>
                        </label>
                        <div className="separator"><span>OR</span></div>
                        <textarea 
                            placeholder="Paste Job Description text here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            className="jd-textarea"
                        />
                    </div>

                    <button type="submit" className="analyze-btn" disabled={loading}>
                        {loading ? <RefreshCw className="spinning" /> : "Start Analysis"}
                    </button>
                    {error && <p className="error-msg"><AlertCircle size={14} /> {error}</p>}
                </form>

                <div className="result-display">
                    {!result ? (
                        <div className="score-card placeholder">
                            <div className="pulse-circle"></div>
                            <p>Analyse a Resume and Job Description to see match score</p>
                        </div>
                    ) : (
                        <div className="score-card">
                            <div className="score-gauge">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="circle" 
                                        strokeDasharray={`${result.match_percentage}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    />
                                    <text x="18" y="20.35" className="percentage">{result.match_percentage}%</text>
                                </svg>
                            </div>
                            <div className="score-info">
                                <h3>Match Score</h3>
                                <div className={`status-badge ${result.match_percentage > 70 ? 'high' : 'low'}`}>
                                    {result.match_percentage > 70 ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                                    {result.match_percentage > 70 ? "Strong Fit" : "Needs Optimization"}
                                </div>
                                {result.match_percentage > 50 && 
                                <button className="reset-btn" onClick={() => navigate('/instructions',{ state: { resume: resumeFile, jd:jdFile, score: result } })}>Proceed to Interview</button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockInterview;