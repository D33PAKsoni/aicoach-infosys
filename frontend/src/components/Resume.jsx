import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUp, FileText, CheckCircle2, AlertCircle, RefreshCw, Search, Library, Layers, Stars, Lightbulb, Award, BrainCircuit} from 'lucide-react';
import '../styles/Resume.css';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const Resume = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);
    const [jdText, setJdText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [savedResumes, setSavedResumes] = useState([]);
    const [multiple, setMultiple] = useState(false);
    const [aimode, setAiMode] = useState(false);
    const [batch, setBatch] = useState(false);
    const [batchData, setBatchData] = useState({});
    const [expand, setExpand] = useState(null);



    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await API.get(`/resumes?user_id=${user.id}`);
                setSavedResumes(res.data);
            } catch (err) { console.error("Error fetching resumes", err); }
        };
        if (user) fetchResumes();
    }, [user]);
    


    const handleSelectFromLibrary = async (e) => {
        const resumeId = e.target.value;
        if (!resumeId) return;

        try {
            const response = await API.get(`/resumes/download/${resumeId}`, { responseType: 'blob' });
            
            const selectedInfo = savedResumes.find(r => r.id === parseInt(resumeId));
            
            const file = new File([response.data], selectedInfo.file_name, { type: response.data.type });
            setResumeFile(file);
        } catch (err) {
            alert("Could not load the selected resume.");
        }
    };


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
            if (aimode){
                const aiResponse = await API.post("/aianalyze", formData);
                setResult(aiResponse.data);
            }
            // else if (multiple){
            //     formData.append("user_id", user?.id);
            //     const multiResponse = await API.post("/multiplematch", formData);
            //     console.log(multiResponse.data);

            //     // setResult(multiResponse.data);
            // }
            else {
                const response = await API.post("/analyze", formData);
                setResult(response.data);
            }
        } catch (err) {
            if (aimode) setError("AI Analysis failed. Try again without AI mode.");
            else setError("Analysis failed. Please check your file formats.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleMultiAnalyze = async (e) => {
        e.preventDefault();
        if (!jdFile && !jdText) {
            setError("Please provide a Job Description.");
            return;
        }        

        setError("");
        setLoading(true);
        const formData = new FormData();
        formData.append("user_id", user?.id);
        if (jdFile) formData.append("jd_file", jdFile);
        if (jdText) formData.append("jd_text", jdText);

        try {
            if (aimode){
                const aiMultiResponse = await API.post("/aimultianalyse", formData);
                // setResult(aiResponse.data);
                console.log(aiMultiResponse.data);
                setBatchData(aiMultiResponse.data);
            }
            else {
                const multiResponse = await API.post("/multiplematch", formData);
                console.log(multiResponse.data);
                setBatchData(multiResponse.data);

                // setResult(multiResponse.data);
            }
        } catch (err) {
            if (aimode) setError("AI Analysis failed. Try again without AI mode.");
            else setError("Analysis failed. Please check your file formats.");
            console.error(err);
        } finally {
            setLoading(false);
            setBatch(true);
            console.log(batch);
        }
    };





    return (
        <div className="resume-match-page">
            <h2 className="match-title">Resume JD Matcher</h2>
            
            <div className="match-grid">
                <form className="upload-container" onSubmit={multiple ? handleMultiAnalyze : handleAnalyze}>
                    <div className="upload-card">
                        <div className="card-label"><FileText size={18} /> Resume</div>
                        <label className="file-drop-zone" >
                            <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={(e) => setResumeFile(e.target.files[0])} />
                            <FileUp className={resumeFile ? "active-icon" : ""} />
                            <p>{resumeFile ? resumeFile.name : "Upload Resume (PDF/DOCX)"}</p>
                        </label>
                        <div className="separator"><span>OR</span></div>
                        <div className="library-select-wrapper">
                            <Library size={30} />
                            <select onChange={handleSelectFromLibrary} className="resume-dropdown">
                                <option value="" className='select-menu'>Select one from your Library...</option>
                                {savedResumes.map(r => (
                                    <option className='select-menu' key={r.id} value={r.id}>{r.file_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="multiple-select">
                            <Layers size={25} />
                            <span className={`slide-switch ${multiple ? 'active' : ''}`} onClick={() => (savedResumes.length > 0) ? setMultiple(!multiple) : setError("Please upload a resume in My Resumes tab first.")}></span>
                            <p>Select all for multiple matching</p>
                        </div>

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

                    <div className="submit-div">
                        <button type="submit" className="analyze-btn" disabled={loading}>
                            {loading ? <RefreshCw className="spinning" /> : "Start Analysis"}
                        </button>
                        <p>Switch to AI Mode for Detailed Analysis</p>
                        <Stars size={40}  className={`stars ${aimode ? 'active' : ''}`}/>
                        <span className={`slide-switch ${aimode ? 'activeAI' : ''}`} onClick={() => setAiMode(!aimode)}></span>

                    </div>
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
                                <button className="reset-btn" onClick={() => setResult(null)}>New Scan</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {batch && 
            (<div className="batchWindow">
                <div className="resultWindow">
                <div className="resultHead"><h3>Batch Analysis Results</h3><span onClick={()=>setBatch(false)}>X</span></div>
                <ul>
                    {batchData.results?.map((res) => (
                        <li key={res.resume_id} className="batch-item">
                            {/* <div > */}
                                <div className="main-result"><div><FileText size={20}/><p>{res.file_name} : </p></div><p style={{ color: res.match_percentage > 50 ? 'lightgreen' : 'orange' }}>{res.match_percentage}%  Match {res.brief_reason &&<button onClick={()=> setExpand(expand == res.resume_id ? null : res.resume_id)}>View Details</button>}</p></div>
                                    {res.brief_reason && (
                                        <div className={`sub-result ${expand == res.resume_id ? 'is-open' : ''}`}>
                                            <div><div><BrainCircuit size={20}/><strong>Reason:</strong></div> <p>{res.brief_reason}</p></div>
                                            <div><div><Award size={20}/><strong>Top Skills:</strong></div> <p>{res.top_skills.join(", ")}</p></div>
                                            <div><div><Lightbulb size={20}/><strong>Improvement Suggestions:</strong></div> <p>{res.improvement_suggestions}</p></div>
                                        </div>
                                    )}
                            {/* </div> */}
                        </li>
                    ))}
                </ul>
                </div>
            </div>)
            }
        </div>
    );
};                 
export default Resume;