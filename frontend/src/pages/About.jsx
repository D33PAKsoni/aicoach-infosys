import React from "react";
import { Header } from '../components/Header.jsx'
import { Info, Award, Code, Shield } from 'lucide-react';
import { SiHuggingface, SiVercel, SiReact, SiFastapi, SiGithub } from 'react-icons/si';
import '../styles/About.css';
import starsBg from '../assets/stars.jpg'; // Reusing your existing asset
import logo from '../assets/logo1.png';

export const About = () => {
  return (
    <div className="about-page">
      <Header />
      
      <div className="about-background">
        <img src={starsBg} alt="Background" className="bg-image" />
      </div>

      <div className="about-container">
        <section className="about-hero">
          <div className="about-card glass">
            <div className="about-header">
              <img src={logo} alt="Logo" className="about-logo" />
              <h1 className="about-title">About the Project</h1>
            </div>
            
            <p className="about-description">
              <strong>Interview</strong>Minutes: AI-Powered Interview Coach is an advanced platform designed to bridge the gap 
              between preparation and performance. By leveraging Real-time AI analysis, it provides 
              candidates with actionable insights into their communication, confidence, and technical accuracy.
            </p>

            <div className="attribution-grid">
              <div className="attr-item">
                <Award className="attr-icon" />
                <div>
                  <h3>Internship Project</h3>
                  <p>Developed during an internship at <strong>Infosys Springboard</strong>.</p>
                </div>
              </div>

              <div className="attr-item">
                <Shield className="attr-icon" />
                <div>
                  <h3>Open Source</h3>
                  <p>Released under the <strong>MIT License</strong>. Feel free to contribute or fork.</p>
                </div>
              </div>
            </div>

            <div className="about-features-mini">
              <div className="mini-feat">
                <SiHuggingface size={18} /><SiFastapi size={18} /> <span>FastAPI backend hosted on HuggingFace</span>
              </div>
              <div className="mini-feat">
                <SiVercel size={18} /><SiReact size={18} /> <span>React frontend hosted on Vercel</span>
              </div>
            </div>

            <div className="about-footer-actions">
               <a href="https://github.com/d33paksoni/aicoach-infosys" target="_blank" rel="noreferrer" className="btn-secondary">
                <SiGithub size={20} /> View Source
               </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};