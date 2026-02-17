export default function GoogleLoginButton() {

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <button className="google-btn" onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
}
