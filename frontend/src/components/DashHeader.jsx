import React from 'react'
import '../styles/Header.css'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo1.png';
import info from '../assets/info.png';
import features from '../assets/features.png';
import discord from '../assets/discord.png';



export const DashHeader = () => {

const navigate = useNavigate();

const handleLogout = async () => {

  try {

    await API.post("/auth/logout");

    // navigate("/login");
    window.location.href = "/login";


  } catch (err) {

    console.error("Logout failed", err);

  }
};


const { user } = useContext(AuthContext);
var user1= "Anonymous"

user1 = user?.full_name.split(' ')[0] || "Anonymous";
if(user){
   console.log("Logged in as", user.email);
   
}


  return (
    <div className="header-container">
      <header className="navbar-container">
        <div className="nav-pill logo-pill">
          <img 
            src={logo} 
            alt="Logo Left" 
            className="logo-icon" 
          />
          
          <a href="/" className="logo-text">
            <strong>Interview</strong>
            <br />
            Minutes
          </a>

          <img 
            src={info} 
            alt="Logo Right" 
            className="logo-icon" 
          />
        </div>


        <nav className="nav-pill menu-pill">
          <ul className="nav-links">

            <li><a href="#about" className="nav-item">About</a></li>


            <li className="nav-item-group">
              <span className="nav-item arrow">Features</span>
              
              <div className="dropdown-wrapper">
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="link-list">
                      <h4>Includes</h4>
                      <a href="#mock-interviews">Mock Interviews</a>
                      <a href="#coding-challenges">Camera Ettiquets</a>
                      <a href="#system-design">Speech Analysis</a>
                    </div>
                    
                    <div className="floating-icon-container">
                      <img 
                        src={features} 
                        alt="Feature Icon" 
                        className="float-icon" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item-group">
              <span className="nav-item arrow">Connect</span>
              
              <div className="dropdown-wrapper">
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="link-list">
                      <h4>Community</h4>
                      <a href="#discord">Discord Server</a>
                      <a href="#linkedin">LinkedIn Group</a>
                    </div>

                    <div className="floating-icon-container">
                      <img 
                        src={discord} 
                        alt="Connect Icon" 
                        className="float-icon" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <a href="#support" className="nav-item">Support</a>
              
            </li>
          </ul>
        </nav>

        <div className="nav-pill auth-pill">
          <div className="greet-text"> 
            <p className="welcome-text">Welcome</p>
            <p className="welcome-name">{user1 ? user1 : ''}</p>
          </div>
          <div className="logout-button" onClick={handleLogout}>LogOut</div>
        </div>
        <div className="page-blur-overlay"></div>
      </header>
    </div>
  );
};
