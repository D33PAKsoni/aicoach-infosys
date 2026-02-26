import { useState } from "react";
import API from "../api";
import AuthInput from "../components/AuthInput";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import Stars from '../assets/videoplayback5.webm';

export default function Register() {


  const [fullName, setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();


  const handleRegister = async () => {

    try {

      await API.post("/auth/register", {
        full_name: fullName,
        email,
        password
      });

      navigate("/dashboard");
        // window.location.href = "/dashboard";
      // alert("Registration successful");

    } catch(err) {

      alert("Registration failed");

    }
  };

  return (
    <div className="auth">
      <Header></Header>
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
        >
          <source src={Stars} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    <div className="auth-container">
      <div>

      <h2>Register</h2>
      <AuthInput placeholder="Full Name"
        onChange={(e)=>setFullName(e.target.value)} />
        

      <AuthInput placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)} />

      <AuthInput type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)} />

      <button className="auth-btn" onClick={handleRegister}>
        Register
      </button>
    </div>
    </div>
    </div>
  );
}
