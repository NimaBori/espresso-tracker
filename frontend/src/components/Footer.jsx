import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">☕</span>
          <span className="footer__title">Espresso Tracker</span>
        </div>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Espresso Tracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}