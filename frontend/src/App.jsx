import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import BeanList from "./pages/BeanList";
import BeanDetail from "./pages/BeanDetail";
import BeanForm from "./pages/BeanForm";
import BrewLogForm from "./pages/BrewLogForm";

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beans" element={<BeanList />} />
          <Route path="/beans/new" element={<BeanForm />} />
          <Route path="/beans/:id" element={<BeanDetail />} />
          <Route path="/beans/:id/edit" element={<BeanForm />} />
          <Route path="/brew-log/new" element={<BrewLogForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;