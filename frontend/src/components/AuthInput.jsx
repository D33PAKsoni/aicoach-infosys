export default function AuthInput({ type="text", placeholder, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="auth-input"
    />
  );
}
