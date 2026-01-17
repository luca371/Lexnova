import "./LandingScreen.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import StarBorder from "../styles/StarBorder";

function LandingScreen() {
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const [stats, setStats] = useState({
    grile: 0,
    studenti: 0,
    subiecte: 0,
  });

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1200; // ms
          const start = performance.now();

          const from = { grile: 0, studenti: 0, subiecte: 0 };
          const to = { grile: 10000, studenti: 5000, subiecte: 50 };

          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);

            setStats({
              grile: Math.round(from.grile + (to.grile - from.grile) * easeOut),
              studenti: Math.round(from.studenti + (to.studenti - from.studenti) * easeOut),
              subiecte: Math.round(from.subiecte + (to.subiecte - from.subiecte) * easeOut),
            });

            if (t < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const formatKPlus = (n) => {
    if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
    return `${n}+`;
  };

  return (
    <div className="landing-container">
      <header className="landing-navbar">
        <div className="logo">LEXNOVA°</div>

        <nav className="nav-actions">
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/register" className="nav-primary">Get started</Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="badge">Platforma pentru studentii de la drept</div>

        <h1 className="hero-title">
          DRUMUL TAU CĂTRE SUCCESUL
          <br />
          EDUCAȚIONAL
        </h1>

        <p className="hero-subtitle">
          Faceti cunostință cu Lumi, partenerul dvs. legal AI,
          învățământul cu întrebări și răspunsuri inteligente,
          stipulate pentru înțelegere și provocări colegii
          în lupta cap la cap.
        </p>

        <div className="hero-actions">
          <StarBorder className="star-primary" color="rgba(31, 43, 214, 0.95)" thickness={1} speed="6s">
            <Link to="/register" className="btn-primary">Începe gratuit →</Link>
          </StarBorder>

          <StarBorder color="rgba(0,0,0,0.35)" thickness={1} speed="7s">
            <Link to="/login" className="btn-secondary">Login</Link>
          </StarBorder>
        </div>
      </main>

      <section className="features-section">
        <h2 className="features-title">TOT CE AI NEVOIE</h2>
        <p className="features-subtitle">
          Instrumente puternice concepute special pentru studenții la drept
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Lumi</h3>
            <p>
              Obține răspunsuri instantanee pentru întrebările juridice.
              Lumi explică concepte dificile într-un mod clar și aplicat.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Grile</h3>
            <p>
              Mii de întrebări organizate în funcție de materie,
              dificultate și nivel de pregătire.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Grile competiționale</h3>
            <p>
              Simulări competitive pentru a-ți testa cunoștințele
              împotriva altor studenți.
            </p>
          </div>
        </div>

        {/* ✅ attach ref here */}
        <div className="features-stats" ref={statsRef}>
          <div>
            <strong className="stat-number">{formatKPlus(stats.grile)}</strong>
            <span>Grile</span>
          </div>
          <div>
            <strong className="stat-number">{formatKPlus(stats.studenti)}</strong>
            <span>Studenți</span>
          </div>
          <div>
            <strong className="stat-number">{stats.subiecte}+</strong>
            <span>Subiecte</span>
          </div>
        </div>

        <section className="final-cta-section">
          <div className="final-cta-card">
            <span className="final-cta-brand">LEXNOVA</span>

            <h2 className="final-cta-title">
              Ești gata să îți transformi studiile juridice?
            </h2>

            <p className="final-cta-subtitle">
              Alătură-te miilor de studenți din <strong>ROMÂNIA</strong>
            </p>

            <Link to="/register" className="final-cta-button">
              ÎNCEPE GRATUIT
            </Link>
          </div>
        </section>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">LEXNOVA°</span>
            <p className="footer-description">
              Platformă educațională AI dedicată studenților la drept.
              Învățare inteligentă. Performanță reală.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Produs</h4>
              <Link to="/lumi">Lumi</Link>
              <Link to="/grile">Grile</Link>
              <Link to="/competitii">Grile competiționale</Link>
            </div>

            <div className="footer-column">
              <h4>Companie</h4>
              <Link to="/despre">Despre noi</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/blog">Blog</Link>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/termeni">Termeni și condiții</Link>
              <Link to="/confidentialitate">Politica de confidențialitate</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lexnova. Toate drepturile rezervate.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingScreen;
