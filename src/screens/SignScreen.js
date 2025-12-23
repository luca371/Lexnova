import "./SignScreen.css";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";
import googleImage from "../assests/googleimage.png";

function SignScreen() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // EMAIL + PASSWORD SIGN UP
  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // ✅ Password match check
    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/form");
    } catch (err) {
      setError(err.message);
    }
  }

  // 🔵 GOOGLE SIGN UP
  async function handleGoogleRegister() {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const isNewUser = result._tokenResponse?.isNewUser;

      if (isNewUser) {
        navigate("/form");
      } else {
        navigate("/start");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <Link to="/" className="auth-back">← Înapoi</Link>

        <span className="auth-logo">LEXNOVA°</span>
        <h1 className="auth-title">Creează cont</h1>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="auth-input"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Parolă"
            className="auth-input"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmă parola"
            className="auth-input"
            required
          />

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button className="auth-button">
            Creează cont
          </button>
        </form>

        <p className="auth-footer">
          Ai deja cont? <Link to="/login">Autentifică-te</Link>
        </p>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleRegister}
        >
          <img
            src={googleImage}
            alt="Google logo"
            className="google-icon"
          />
          <span>Continuă cu Google</span>
        </button>
      </div>
    </div>
  );
}

export default SignScreen;
