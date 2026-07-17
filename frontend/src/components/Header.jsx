import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.scss";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to="/" className="header__brand">
          <span className="header__logo">☕</span>
          <span className="header__title">Espresso Tracker</span>
        </NavLink>
        <nav className="header__nav">
          {user && (
            <>
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
              {isAdmin && (
                <>
                  <NavLink
                    to="/admin/analytics"
                    className={({ isActive }) =>
                      isActive ? "header__link header__link--active" : "header__link"
                    }
                  >
                    Analytics
                  </NavLink>
                  <NavLink
                    to="/beans/new"
                    className={({ isActive }) =>
                      isActive ? "header__link header__link--active" : "header__link"
                    }
                  >
                    + Add Bean
                  </NavLink>
                </>
              )}
            </>
          )}
        </nav>
        <div className="header__auth">
          {user ? (
            <div className="header__user">
              <span className="header__user-name">
                {user.username}
                {user.role === "ADMIN" && (
                  <span className="badge badge-light" style={{ marginLeft: "0.4rem" }}>
                    Admin
                  </span>
                )}
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
