import "./LoginScreen.css";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function LoginScreen() {
  const navigate = useNavigate();

  // EMAIL + PASSWORD LOGIN
  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/start");
    } catch (err) {
      alert(err.message);
    }
  }

  // 🔵 GOOGLE LOGIN
  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const isNewUser = result._tokenResponse?.isNewUser;

      if (isNewUser) {
        navigate("/form");
      } else {
        navigate("/start");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <Link to="/" className="auth-back">← Înapoi</Link>

        <span className="auth-logo">LEXNOVA°</span>
        <h1 className="auth-title">Autentificare</h1>

        {/* GOOGLE BUTTON */}
        <button
          type="button"
          className="auth-google"
          onClick={handleGoogleLogin}
        >
          Continuă cu Google
        </button>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="auth-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Parolă"
            className="auth-input"
          />

          <button className="auth-button">
            Autentificare
          </button>
        </form>

        <p className="auth-footer">
          Nu ai cont? <Link to="/register">Creează unul</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
