import React, { useRef, useEffect } from "react";
import { Header } from '../components/Header.jsx'
import '../styles/landing.css'

export const Landing = () => {

  

  // const videoRef = useRef(null);

  // useEffect(() => {
  //   const video = videoRef.current;

  //   const handleEnded = () => {
  //     // Pause at the last frame
  //     video.pause();
  //     video.currentTime = video.duration;
  //   };

  //   video.addEventListener("ended", handleEnded);

  //   return () => {
  //     video.removeEventListener("ended", handleEnded);
  //   };
  // }, []);


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
            <button className="btn-primary hero-btn">Get Started</button>
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



      <section className="features">Section Two</section> 
      <section className="results">Section Three</section> 
      <section className="footer">Section Four</section>
    </div>
  )
}


