import React from 'react'
import '../styles/header.css'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Header = () => {



const { user } = useContext(AuthContext);

if(user){
   console.log("Logged in as", user.email);
}



  return (
    <div className="header-container">
      <header className="navbar-container">
        <div className="nav-pill logo-pill">
          <img 
            src="src\assets\logo1.png" 
            alt="Logo Left" 
            className="logo-icon" 
          />
          
          <a href="/" className="logo-text">
            <strong>Interview</strong>
            <br />
            Minutes
          </a>

          <img 
            src="src\assets\info.png" 
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
                        src="src\assets\features.png" 
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
                        src="src\assets\discord.png" 
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

        {/* Pill 3: Auth/Login */}
        <div className="nav-pill auth-pill">
         <a href='/login'> <p className="login-button">Login</p></a>
         {/* <img src='../assets/social.png' alt='' className='login-img'></img> */}
        </div>
        <div className="page-blur-overlay"></div>
      </header>
    </div>
  );
};

// export default Header;