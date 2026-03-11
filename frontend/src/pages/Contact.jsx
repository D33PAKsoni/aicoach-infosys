import React, { useState } from "react";
import { Header } from '../components/Header.jsx'
import { Mail, MessageSquare, Send,  MapPin, Linkedin, Loader2 } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import '../styles/Contact.css';
import galaxyBg from '../assets/galaxy.jpg'; 
import logo from '../assets/logo1.png';
import { API2} from "../api.js";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try{
        const response = API2.post("/auth/contact", formData);
        // if (response.status === 200) {
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
          console.log("Contact form response:", response.data);
        // }
    } catch (error) {
        alert("Failed to send message.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />
      
      <div className="contact-background">
        <img src={galaxyBg} alt="Background" className="bg-image-contact" />
      </div>

      <div className="contact-container">
        <div className="contact-grid glass">
          {/* Left Side: Contact Info */}
          <div className="contact-info">
            <div className="info-header">
              <img src={logo} alt="Logo" className="contact-logo" />
              <h2>Get in Touch</h2>
            </div>
            <p className="info-text">
              Have questions about the AI Interview Coach? Whether you're interested in the open-source code or have feedback on the internship project, I'd love to hear from you.
            </p>

            <div className="contact-methods">
              <div className="method-item">
                <Mail className="method-icon" />
                <span>deepak.kr.s1999@gmail.com</span>
              </div>
              <div className="method-item">
                <MapPin className="method-icon" />
                <span>Remote Support</span>
              </div>
            </div>

            <div className="social-links">
              <a href="https://github.com/D33PAKsoni/" className="social-icon"><SiGithub size={30} /></a>
              <a href="https://www.linkedin.com/in/krishnadeepaksoni/" className="social-icon"><Linkedin size={30} /></a>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea 
                placeholder="How can I help you?" 
                rows="5" 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            {loading ? (
              <button type="button" className="submit-btn" disabled>
                <Loader2 className="animate-spin" />
                <span>Sending...</span>
              </button>
            ) : (
              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};