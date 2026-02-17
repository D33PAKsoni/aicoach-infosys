import { useState } from "react";
import API from "../api";
import AuthInput from "../components/AuthInput";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";


export default function Register() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();


  const handleRegister = async () => {

    try {

      await API.post("/auth/register", {
        email,
        password
      });

      navigate("/dashboard");
      alert("Registration successful");

    } catch(err) {

      alert("Registration failed");

    }
  };

  return (
        <div className="auth">
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
        >
          <source src="src/assets/videoplayback5.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    <div className="auth-container">
      <div>

      <h2>Register</h2>

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
