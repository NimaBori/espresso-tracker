import { Link } from "react-router-dom";
import "./AboutPage.scss";

export default function AboutPage() {
  return (
    <div className="page container">
      <div className="about-page">
        {/* App Introduction */}
        <section className="about-section">
          <h1>About Espresso Tracker</h1>
          <p className="about-subtitle">
            A full-stack coffee brewing companion for enthusiasts who love
            precision, data, and great espresso.
          </p>
        </section>

        {/* What It Does */}
        <section className="about-section about-section--card">
          <h2>What It Does</h2>
          <p>
            Espresso Tracker helps you log, rate, and analyze your coffee brewing
            journey. Keep a digital record of every bean you try, every shot you
            pull, and every tasting note — then discover patterns in your
            extractions to dial in the perfect cup.
          </p>
          <ul className="about-list">
            <li>
              <strong>Bean Management</strong> — Catalog your coffee beans by
              roaster, origin, roast level, and tasting notes.
            </li>
            <li>
              <strong>Brew Logging</strong> — Record dose, yield, extraction time,
              grind setting, and rating for each shot.
            </li>
            <li>
              <strong>Analytics Dashboard</strong> — Visualize trends, top-rated
              brews, bean performance, and extraction ratios.
            </li>
            <li>
              <strong>Authentication &amp; Authorization</strong> — Secure user
              accounts with JWT-based login and role-based access control.
            </li>
          </ul>
        </section>

        {/* Tech Stack */}
        <section className="about-section about-section--card">
          <h2>Built With</h2>
          <div className="about-tech-grid">
            <div className="about-tech-item">
              <span className="about-tech-icon">⚛️</span>
              <strong>React</strong>
              <span className="about-tech-desc">Component-based UI with React Router</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">⚡</span>
              <strong>Vite</strong>
              <span className="about-tech-desc">Fast development server &amp; build tool</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🟢</span>
              <strong>Java &amp; Spring Boot</strong>
              <span className="about-tech-desc">RESTful API, JWT auth, business logic</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🐘</span>
              <strong>PostgreSQL</strong>
              <span className="about-tech-desc">Relational database with JPA &amp; Hibernate</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🎨</span>
              <strong>SCSS</strong>
              <span className="about-tech-desc">Modular stylesheets with design tokens</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🔐</span>
              <strong>JWT &amp; BCrypt</strong>
              <span className="about-tech-desc">Secure authentication &amp; password hashing</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">📊</span>
              <strong>Axios</strong>
              <span className="about-tech-desc">HTTP client with mock-data fallback</span>
            </div>
            <div className="about-tech-item">
              <span className="about-tech-icon">🐳</span>
              <strong>Docker</strong>
              <span className="about-tech-desc">Containerized deployment via Docker Compose</span>
            </div>
          </div>
        </section>

        {/* Developer Intro */}
        <section className="about-section about-section--card about-section--highlight">
          <div className="about-developer">
            <div className="about-avatar">👨‍💻</div>
            <h2>Developed by Seyed Nima Borghei</h2>
          </div>
          <p>
            Web Developer with <strong>3+ years of experience</strong> in
            <strong> Adobe Experience Manager (AEM)</strong> and
            <strong> WordPress</strong>, and advanced full-stack development in
            <strong> Java</strong> and <strong>Spring Boot</strong>. Proven track
            record in AEM component authoring, backend API integration, and custom
            CMS development. Delivers high-performance, secure, and SEO-optimized
            web solutions with clean, modular code.
          </p>
          <p>
            This project presents a modern full-stack design: a React and Vite frontend interacts with a Spring Boot REST API through PostgreSQL, all packaged with Docker and ready for deployment on platforms such as Render and GitHub Pages.
          </p>
          <p className="about-contact">
            Feel free to reach out at{" "}
            <a href="mailto:nimaborghei@gmail.com">nimaborghei@gmail.com</a>
            {" "}for inquiries, collaboration, or feedback.
          </p>
        </section>

        <div className="about-cta">
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
          <Link to="/beans" className="btn btn-secondary">
            Browse Beans
          </Link>
        </div>
      </div>
    </div>
  );
}