import { backendURL } from "../api";

export default function GoogleLoginButton() {

  const handleGoogleLogin = () => {
    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <button className="google-btn" onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
}
