import "./LandingScreen.css";
import { Link } from "react-router-dom";

function LandingScreen() {
  return (
    <div className="landing-container">
      <header className="landing-navbar">
        <div className="logo">LEXNOVA°</div>

        <nav className="nav-actions">
          <button className="nav-link">Sign in</button>
          <button className="nav-primary">Get started</button>
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
          <button className="btn-primary">Începe gratuit →</button>
          <button className="btn-secondary">Login</button>
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

        <div className="features-stats">
          <div>
            <strong>10k+</strong>
            <span>Grile</span>
          </div>
          <div>
            <strong>5k+</strong>
            <span>Studenți</span>
          </div>
          <div>
            <strong>50+</strong>
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

                <button className="final-cta-button">
                ÎNCEPE GRATUIT
                </button>
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
