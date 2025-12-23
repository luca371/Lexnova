import "./StartScreen.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function StartScreen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        navigate("/form");
        return;
      }

      setUserData(userSnap.data());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="start-loading">Se încarcă...</div>;
  }

  return (
    <div className="start-hero">
      {/* ================= NAVBAR ================= */}
      <header className="start-navbar">
        <span className="start-logo">LEXNOVA°</span>

        {/* Waffle menu button (mobile only) */}
        <button
          className="waffle-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <nav className={`start-nav ${menuOpen ? "open" : ""}`}>
          <button
            onClick={() => {
              navigate("/start");
              setMenuOpen(false);
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/lumi");
              setMenuOpen(false);
            }}
          >
            Lumi
          </button>

          <button
            onClick={() => {
              navigate("/tests");
              setMenuOpen(false);
            }}
          >
            Grile
          </button>

          <button
            onClick={() => {
              navigate("/battle");
              setMenuOpen(false);
            }}
          >
            Battle
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <main className="start-content">
        <span className="start-badge">
          Platforma pentru studenții de la drept
        </span>

        <h1 className="start-title">
          Bine ai venit,
          <br />
          <span>{userData.prenume}</span>
        </h1>

        <p className="start-subtitle">
          Partenerul tău inteligent pentru studiile juridice.
          Învață mai eficient, testează-ți cunoștințele
          și concurează cu alți studenți — totul cu ajutorul AI.
        </p>

        <div className="start-actions">
          <button
            className="start-primary"
            onClick={() => navigate("/lumi")}
          >
            Ask Lumi
          </button>

          <button
            className="start-secondary"
            onClick={() => navigate("/tests")}
          >
            Începe cu niște grile →
          </button>
        </div>

        <button
          className="start-logout"
          onClick={() => {
            signOut(auth);
            navigate("/");
          }}
        >
          Logout
        </button>
      </main>
    </div>
  );
}

export default StartScreen;
