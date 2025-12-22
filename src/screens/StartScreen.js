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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ❌ Not logged in
      if (!user) {
        navigate("/login");
        return;
      }

      // 🔍 Check Firestore onboarding
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // ❌ Logged in but no form completed
      if (!userSnap.exists()) {
        navigate("/form");
        return;
      }

      // ✅ All good
      setUserData(userSnap.data());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="start-loading">
        Se încarcă...
      </div>
    );
  }

  return (
    <div className="start-container">
      <div className="start-card">
        <span className="start-brand">LEXNOVA°</span>

        <h1 className="start-title">
          Bine ai venit, <span>{userData.prenume}</span> 👋
        </h1>

        <div className="start-info">
          <p>
            <strong>Profesie:</strong> {userData.profesie}
          </p>

          {userData.profesie === "Student" && (
            <p>
              <strong>An de studiu:</strong> {userData.anulStudiu}
            </p>
          )}

          <p>
            <strong>Oraș:</strong> {userData.oras}
          </p>
        </div>

        <div className="start-divider" />

        <div className="start-actions">
          <button
            className="start-logout"
            onClick={() => {
              signOut(auth);
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
