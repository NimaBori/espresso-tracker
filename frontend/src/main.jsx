import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.scss";
import App from "./App.jsx";

// Use Vite's BASE_URL (set via the `base` config) as the basename for React Router.
// In local dev the base is "/", and on GitHub Pages it is "/espresso-tracker/".
// Strip the trailing slash because React Router's basename expects no trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);