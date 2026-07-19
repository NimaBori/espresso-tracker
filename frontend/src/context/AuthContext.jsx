import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Auto-login in demo mode
    const isDemo = import.meta.env.VITE_DEMO_MODE === "true";
    if (isDemo && !token) {
      localStorage.setItem("token", "demo-jwt-token");
      localStorage.setItem("username", "demo_user");
      localStorage.setItem("role", "ADMIN");
      setUser({ token: "demo-jwt-token", username: "demo_user", role: "ADMIN" });
    } else if (token && username) {
      setUser({ token, username, role });
    }
    setLoading(false);
  }, []);

  const login = (token, username, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role || "USER");
    setUser({ token, username, role: role || "USER" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;