import React from 'react'
import "../styles/ResumeMatcher.css"

const ResumeMatch = () => {
  return (
    <div className='resume-container'>
              <h2>Resume To Job Description Matcher</h2>
              <p className="subtitle">Upload documents to check similarity score for <span>Job eligiblity</span>.</p>
              
              <div className="upload-grid">
                <div className="card upload-card">
                  <div className="card-header">
                    <User size={20} />
                    <h3>Candidate Resume</h3>
                  </div>
                  <div className="drop-zone">
                    <Upload size={32} />
                    <p>{resumeFile ? resumeFile.name : "Drag & drop PDF/DOC/TXT"}</p>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setResumeFile(e.target.files[0])} />
                  </div>
                </div>

                {/* JD Upload */}
                <div className="card upload-card">
                  <div className="card-header">
                    <Briefcase size={20} />
                    <h3>Job Description (JD)</h3>
                  </div>
                  
                  <div className="input-toggle">
                    <button className={jdInputType === 'file' ? 'active' : ''} onClick={() => setJdInputType('file')}>Upload File</button>
                    <button className={jdInputType === 'text' ? 'active' : ''} onClick={() => setJdInputType('text')}>Paste Text</button>
                  </div>

                  {jdInputType === 'file' ? (
                    <div className="drop-zone">
                      <Upload size={32} />
                      <p>{jdFile ? jdFile.name : "Drag & drop JD File"}</p>
                      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setJdFile(e.target.files[0])} />
                    </div>
                  ) : (
                    <textarea 
                      className="jd-textarea" 
                      placeholder="Paste the job description here..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    ></textarea>
                  )}
                </div>
              </div>

              {/* Action & Result Area */}
              <div className="action-area">
                {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
                
                {result && (
                  <div className={`result-display ${result.match_percentage >= 60 ? 'success' : 'warning'}`} style={{
                    marginBottom: '1rem', padding: '1rem', borderRadius: '8px',
                    background: result.match_percentage >= 60 ? '#ecfdf5' : '#fffbeb',
                    border: `1px solid ${result.match_percentage >= 60 ? '#10b981' : '#f59e0b'}`,
                    color: result.match_percentage >= 60 ? '#065f46' : '#92400e',
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontWeight: 'bold'}}>Match Score: {result.match_percentage}%</span>
                      {result.match_percentage >= 60 ? 
                        <span>High Match! Eligible for Interview.</span> : 
                        <span>Match Low. Review resources below.</span>
                      }
                    </div>
                  </div>
                )}

                {!result ? (
                  <button className="cta-btn" onClick={handleAnalyze} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Match"} <ChevronRight size={18} />
                  </button>
                ) : (
                  <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                    {result.match_percentage >= 60 ? (
                      <button className="cta-btn" onClick={() => setCurrentView('interview')}>
                        Proceed to Interview <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button className="cta-btn" style={{background: '#f59e0b'}}>
                        View Prep Resources <AlertCircle size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>

    </div>
  )
}

export default ResumeMatch