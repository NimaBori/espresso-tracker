import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import VisitTracker from "./components/VisitTracker";
import Dashboard from "./pages/Dashboard";
import BeanList from "./pages/BeanList";
import BeanDetail from "./pages/BeanDetail";
import BeanForm from "./pages/BeanForm";
import BrewLogForm from "./pages/BrewLogForm";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <div className="app-layout">
      <VisitTracker />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beans"
            element={
              <ProtectedRoute>
                <BeanList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beans/new"
            element={
              <ProtectedRoute>
                <BeanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beans/:id"
            element={
              <ProtectedRoute>
                <BeanDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beans/:id/edit"
            element={
              <ProtectedRoute>
                <BeanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brew-log/new"
            element={
              <ProtectedRoute>
                <BrewLogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
