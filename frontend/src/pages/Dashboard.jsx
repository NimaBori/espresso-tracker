import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBeans, getTopRatedLogs } from "../services/api";
import "./Dashboard.scss";

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function Ratio({ dose, yield: yieldGrams }) {
  if (!dose || !yieldGrams) return null;
  const ratio = (yieldGrams / dose).toFixed(1);
  return <span className="ratio">{ratio}:1</span>;
}

export default function Dashboard() {
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
        <div className="page-header__actions">
          <Link to="/beans/new" className="btn btn-primary">+ Add Bean</Link>
          <Link to="/brew-log/new" className="btn btn-secondary">+ Log Brew</Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="card dashboard-section">
          <div className="dashboard-section__header">
            <h2>Your Beans</h2>
            <Link to="/beans" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {beans.length === 0 ? (
            <div className="empty-state">
              <p>No beans yet. Start by adding your first coffee bean!</p>
              <Link to="/beans/new" className="btn btn-primary">Add Your First Bean</Link>
            </div>
          ) : (
            <div className="bean-preview-list">
              {beans.slice(0, 5).map((bean) => (
                <Link to={`/beans/${bean.id}`} key={bean.id} className="bean-preview-item">
                  <div className="bean-preview-item__info">
                    <span className="bean-preview-item__name">{bean.beanName}</span>
                    <span className="bean-preview-item__roaster">{bean.roasterName}</span>
                  </div>
                  <span className={`badge badge-${bean.roastLevel?.toLowerCase()}`}>
                    {bean.roastLevel}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card dashboard-section">
          <div className="dashboard-section__header">
            <h2>Top Rated Brews</h2>
          </div>
          {topRatedLogs.length === 0 ? (
            <div className="empty-state">
              <p>No brew logs yet. Log your first espresso extraction!</p>
              <Link to="/brew-log/new" className="btn btn-secondary">Log a Brew</Link>
            </div>
          ) : (
            <div className="brew-preview-list">
              {topRatedLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="brew-preview-item">
                  <div className="brew-preview-item__header">
                    <span className="brew-preview-item__bean">{log.beanName || "Unknown Bean"}</span>
                    <StarRating rating={log.rating} />
                  </div>
                  <div className="brew-preview-item__details">
                    <span>{log.doseGrams}g in</span>
                    <span>{log.yieldGrams}g out</span>
                    <Ratio dose={log.doseGrams} yield={log.yieldGrams} />
                    <span>{formatTime(log.extractionTimeSeconds)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}