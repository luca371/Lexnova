// StartScreen.jsx
import "./StartScreen.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function StartScreen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ===== Lumi preview (typing animation in tile) =====
  const previewQuestion =
    "Care este diferența dintre nulitatea și rezoluțiunea unui contract de vânzare-cumpărare încheiat cu consimțământ viciat prin dol și ce efecte au acestea asupra prestațiilor deja executate?";

  const previewAnswer =
    "Nulitatea se aplică pentru viciu la încheiere (dol) și desființează contractul retroactiv; prestațiile se restituie integral. Rezoluțiunea se aplică pentru neexecutare și desființează contractul doar pentru viitor; prestațiile se restituie pentru că actul încetează.";

  const questionWords = useMemo(
    () => previewQuestion.split(/\s+/).filter(Boolean),
    [previewQuestion]
  );

  const [typedQuestion, setTypedQuestion] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const typingTimersRef = useRef([]); // store timeouts so we can clear on unmount

  useEffect(() => {
    const clearAll = () => {
      typingTimersRef.current.forEach((t) => window.clearTimeout(t));
      typingTimersRef.current = [];
    };

    const schedule = (fn, ms) => {
      const id = window.setTimeout(fn, ms);
      typingTimersRef.current.push(id);
      return id;
    };

    const runLoop = () => {
      setTypedQuestion("");
      setShowAnswer(false);

      // word-by-word typing
      const perWordMs = 140; // typing speed
      const afterQuestionPause = 650;
      const showAnswerDuration = 2600;
      const restartPause = 650;

      questionWords.forEach((_, idx) => {
        schedule(() => {
          setTypedQuestion(questionWords.slice(0, idx + 1).join(" "));
        }, idx * perWordMs);
      });

      const questionDoneAt = questionWords.length * perWordMs;

      // show answer in one go
      schedule(
        () => setShowAnswer(true),
        questionDoneAt + afterQuestionPause
      );

      // hide + restart
      schedule(
        () => setShowAnswer(false),
        questionDoneAt + afterQuestionPause + showAnswerDuration
      );
      schedule(
        () => runLoop(),
        questionDoneAt +
          afterQuestionPause +
          showAnswerDuration +
          restartPause
      );
    };

    runLoop();
    return () => clearAll();
  }, [questionWords]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
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
      } catch (err) {
        console.error("StartScreen error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
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
        <span className="start-badge">Platforma pentru studenții de la drept</span>

        <h1 className="start-title">
          Bine ai venit,
          <br />
          <span>{userData?.prenume ?? ""}</span>
        </h1>

        <p className="start-subtitle">
          Partenerul tău inteligent pentru studiile juridice. Învață mai eficient,
          testează-ți cunoștințele și concurează cu alți studenți — totul cu ajutorul AI.
        </p>

        <div className="start-actions">
          <button className="start-primary" onClick={() => navigate("/lumi")}>
            Ask Lumi
          </button>

          <button className="start-secondary" onClick={() => navigate("/tests")}>
            Începe cu niște grile →
          </button>
        </div>

        {/* ================= FEATURE PREVIEWS ================= */}
        <section className="start-sections" aria-label="Funcționalități">
          {/* Lumi: text left, anim right */}
          <div className="start-section">
            <div className="start-section-text">
              <div className="start-section-eyebrow">Lumi</div>
              <h2 className="start-section-title">
                Răspunsuri rapide, structurate, pentru drept
              </h2>
              <p className="start-section-desc">
                Pune o întrebare și primești explicații clare, exemple și pași concreți.
                Perfect pentru recapitulare înainte de seminar sau examen.
              </p>

              <div className="start-section-cta">
                <button className="start-ghost" onClick={() => navigate("/lumi")}>
                  Deschide Lumi →
                </button>
              </div>
            </div>

            <div className="start-section-media" aria-hidden="true">
              <div className="mini-loop mini-loop--chat">
                <div className="mini-loop-top">
                  <span className="mini-dot" />
                  <span className="mini-dot" />
                  <span className="mini-dot" />
                </div>

                {/* UPDATED: real chat preview with typing + answer */}
                <div className="mini-loop-body mini-chat">
                  <div className="mini-chat-row mini-chat-row--user">
                    <div className="mini-chat-bubble mini-chat-bubble--user">
                      <span className="mini-chat-text">
                        {typedQuestion}
                        <span className="mini-caret" aria-hidden="true" />
                      </span>
                    </div>
                  </div>

                  {showAnswer && (
                    <div className="mini-chat-row mini-chat-row--ai">
                      <div className="mini-chat-bubble mini-chat-bubble--ai">
                        <span className="mini-chat-text mini-chat-text--ai">
                          {previewAnswer}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grile: anim left, text right */}
          <div className="start-section start-section--reverse">
            <div className="start-section-text">
              <div className="start-section-eyebrow">Grile</div>
              <h2 className="start-section-title">
                Antrenament pe capitole, ritm și dificultate
              </h2>
              <p className="start-section-desc">
                Practică pe materii și urmărește progresul. Primești feedback rapid și
                revii fix unde ai nevoie.
              </p>

              <div className="start-section-cta">
                <button className="start-ghost" onClick={() => navigate("/tests")}>
                  Vezi Grile →
                </button>
              </div>
            </div>

            <div className="start-section-media" aria-hidden="true">
              <div className="mini-loop mini-loop--grid">
                <div className="mini-grid">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="mini-tile" />
                  ))}
                </div>
                <div className="mini-scanline" />
              </div>
            </div>
          </div>

          {/* Battle: text left, anim right */}
          <div className="start-section">
            <div className="start-section-text">
              <div className="start-section-eyebrow">Battle</div>
              <h2 className="start-section-title">
                Competiție cap la cap, ca să te motivezi
              </h2>
              <p className="start-section-desc">
                Intră în dueluri rapide cu alți studenți. Îți testezi reacția, memoria
                și consistența — într-un format fun.
              </p>

              <div className="start-section-cta">
                <button className="start-ghost" onClick={() => navigate("/battle")}>
                  Intră în Battle →
                </button>
              </div>
            </div>

            <div className="start-section-media" aria-hidden="true">
              <div className="mini-loop mini-loop--race">
                <div className="mini-race-track">
                  <div className="mini-race-bar mini-race-bar--a" />
                  <div className="mini-race-bar mini-race-bar--b" />
                </div>
                <div className="mini-race-labels">
                  <span className="mini-pill">TU</span>
                  <span className="mini-pill">RIVAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LOGOUT ================= */}
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
