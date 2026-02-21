import { useState } from "react";
import API from "../api";
import AuthInput from "../components/AuthInput";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";




export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogin = async () => {

  try {

    await API.post("/auth/login", {
      email,
      password
    });
    navigate("/dashboard");


  } catch(err) {

    alert("Login failed");

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
          <source src="src/assets/videoplayback5.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
     <div className="auth-container">
      <div>

      <h2>Login</h2>

      <AuthInput placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)} />

      <AuthInput type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)} />

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <GoogleLoginButton/>
      {location.state?.message && (
        <p className="auth-message">
          {location.state.message}
        </p>
      )}

      </div>
    </div>
    </div>
  );
}
