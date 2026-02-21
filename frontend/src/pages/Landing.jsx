import React, { useRef, useEffect } from "react";
import { Header } from '../components/Header.jsx'
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  CheckCircle, 
  Cpu, 
  Mic, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react'
import '../styles/landing.css'

export const Landing = () => {

  const navigate = useNavigate(); 
  return (
    <div>
      <Header />

      <section className="hero">
        <div className="video-background">
        <video
          autoPlay
          muted
          loop
        >
          <source src="src/assets/videoplayback.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        </div>

        <div className="hero-contents">
          <div className="hero-cover">
            <h1 className="hero-title">Revolutionize Your Interview Process</h1>
            <p className="hero-subtitle">Automated interview minutes for seamless hiring</p>
            <button className="btn-primary hero-btn" onClick={()=> navigate('/register')}>Get Started</button>
          </div>
          <div className="hero-display">
            <div className="hero-dash">
              <div className="hero-dash-top">
                <div className="hero-dash-top-logo"><img src="src\assets\logo1.png" alt="logo"></img></div>
                <div className="hero-dash-top-window"><p>AI-Powered Interview Coach Live</p></div>
                <div className="hero-dash-top-cells">
                  <div className="hero-dash-top-cell1"></div>
                  <div className="hero-dash-top-cell2"></div>
                  <div className="hero-dash-top-cell3"></div>
                </div>
              </div>
              <div className="hero-dash-main">
                <div className="hero-dash-main-left"></div>
                <div className="hero-dash-main-right">
                  <div className="hero-dash-main-right-top">
                    <img src="src\assets\candidate.png" alt="candidate"></img>
                  </div>
                  <div className="hero-dash-main-right-bottom">
                    <p>Camera Presence:</p>
                    <p className="bar-value">Confident</p>
                    <p>Communication Skills:</p>
                    <p className="bar-value">Fluent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        </div>
      </section> 

      <section className="features">

        <div className="section-content features-contents">
    <h2 className="section-title">Elevate Your Preparation</h2>
    <div className="features-grid">
      <div className="feature-card">
        <Eye size={40} className="feature-icon" />
        <h3>Vision AI Analysis</h3>
        <p>Real-time Gaze and Posture detection to ensure professional camera presence and focus.</p>
      </div>
      <div className="feature-card">
        <CheckCircle size={40} className="feature-icon" />
        <h3>Job Eligibility Checker</h3>
        <p>Intelligent semantic matching between your Resume and Job Descriptions using NLP.</p>
      </div>
      <div className="feature-card">
        <Cpu size={40} className="feature-icon" />
        <h3>Live AI Coaching</h3>
        <p>Dynamic technical follow-up questions powered by Gemini 2.5 Flash for a realistic experience.</p>
      </div>
      <div className="feature-card">
        <Mic size={40} className="feature-icon" />
        <h3>Communication Analytics</h3>
        <p>Automated tracking of speech velocity (WPM) and filler word detection to refine your delivery.</p>
      </div>
    </div>
        </div>
      </section>

      <section className="results">

  <div className="section-content features-contents">
    <h2 className="section-title">Data-Driven Insights</h2>
    <div className="metrics-showcase">
      <div className="metrics-demo-card">
        <div className="demo-header">
          <BarChart size={24} />
          <span>Real-time Performance Metrics</span>
        </div>
        <div className="demo-stats">
          <div className="stat-item">
            <p>Accuracy</p>
            <div className="progress-bar"><div className="progress-fill" style={{width: '85%'}}></div></div>
            <span>85%</span>
          </div>
          <div className="stat-item">
            <p>Confidence</p>
            <div className="progress-bar"><div className="progress-fill confident" style={{width: '92%'}}></div></div>
            <span>High</span>
          </div>
          <div className="stat-item">
            <p>WPM</p>
            <div className="wpm-counter">145</div>
            <span>Optimal</span>
          </div>
        </div>
      </div>
      <div className="metrics-info">
        <h3>Master Every Metric</h3>
        <p>Our platform doesn't just record you—it understands you. From tracking your technical accuracy to visualizing your emotional composure through complex behavioral mapping.</p>
      </div>
    </div>
  </div>
      </section>

      <section className="footer">

  <div className="footer-content features-contents">
    <div className="footer-grid">
      <div className="footer-brand">
        <img src="src/assets/logo1.png" alt="logo" />
        <p>Empowering candidates through AI-driven intelligence.</p>
      </div>
      <div className="footer-links">
        <h4>Navigation</h4>
        <ul>
          <li>Dashboard</li>
          <li>Practice Room</li>
          <li>Resources</li>
        </ul>
      </div>
      <div className="footer-social">
        <h4>Connect</h4>
        <div className="social-icons">
          <Github size={24} />
          <Linkedin size={24} />
          <Twitter size={24} />
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2026 AI Interview Coach. All rights reserved.</p>
    </div>
  </div>
      </section>
    </div>
  )
}


