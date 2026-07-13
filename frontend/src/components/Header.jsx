import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to="/" className="header__brand">
          <span className="header__logo">☕</span>
          <span className="header__title">Espresso Tracker</span>
        </NavLink>
        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/beans"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Beans
          </NavLink>
          <NavLink
            to="/beans/new"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            + Add Bean
          </NavLink>
        </nav>
      </div>
    </header>
  );
}