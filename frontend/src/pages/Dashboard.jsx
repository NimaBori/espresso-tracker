import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBeans, getTopRatedLogs } from "../services/api";
import Slider from "../components/Slider";
import BeanCard from "../components/BeanCard";
import BrewCard from "../components/BrewCard";
import "./Dashboard.scss";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [beans, setBeans] = useState([]);
  const [topRatedLogs, setTopRatedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [beansData, topLogs] = await Promise.all([
          getBeans(0, 50),
          getTopRatedLogs(),
        ]);
        setBeans(beansData.content || beansData);
        setTopRatedLogs(topLogs);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Could not connect to the server. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="page container"><div className="loading">Loading dashboard...</div></div>;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Dashboard</h1>
        {isAdmin && (
          <div className="page-header__actions">
            <Link to="/beans/new" className="btn btn-primary">+ Add Bean</Link>
            <Link to="/brew-log/new" className="btn btn-secondary">+ Log Brew</Link>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Beans Slider — 3 cards per slide */}
      <Slider title="Your Beans" slidesToShow={3}>
        {beans.length === 0 ? (
          <div className="empty-state">
            <p>No beans yet. Start by adding your first coffee bean!</p>
            {isAdmin && <Link to="/beans/new" className="btn btn-primary">Add Your First Bean</Link>}
          </div>
        ) : (
          beans.map((bean) => <BeanCard key={bean.id} bean={bean} />)
        )}
      </Slider>

      {/* Top Rated Brews Slider — 2 cards per slide */}
      <Slider title="Top Rated Brews" slidesToShow={2}>
        {topRatedLogs.length === 0 ? (
          <div className="empty-state">
            <p>No brew logs yet. Log your first espresso extraction!</p>
            {isAdmin && <Link to="/brew-log/new" className="btn btn-secondary">Log a Brew</Link>}
          </div>
        ) : (
          topRatedLogs.map((log) => <BrewCard key={log.id} brew={log} />)
        )}
      </Slider>
    </div>
  );
}
