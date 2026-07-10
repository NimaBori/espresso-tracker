import { NavLink } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <span className="navbar__logo">☕</span>
          <span className="navbar__title">Espresso Tracker</span>
        </NavLink>
        <div className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>
            Dashboard
          </NavLink>
          <NavLink to="/beans" className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>
            Beans
          </NavLink>
          <NavLink to="/beans/new" className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>
            + Add Bean
          </NavLink>
        </div>
      </div>
    </nav>
  );
}