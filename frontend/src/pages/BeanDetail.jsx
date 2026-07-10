import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBeanById, getLogsByBeanId, deleteBean } from "../services/api";
import "./BeanDetail.scss";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function BeanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bean, setBean] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [beanData, logsData] = await Promise.all([
          getBeanById(id),
          getLogsByBeanId(id),
        ]);
        setBean(beanData);
        setLogs(logsData);
      } catch (err) {
        console.error("Failed to load bean details:", err);
        setError("Could not load bean details.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${bean.beanName}"? This cannot be undone.`)) return;
    try {
      await deleteBean(id);
      navigate("/beans", { replace: true });
    } catch (err) {
      setError("Failed to delete bean.");
    }
  }

  if (loading) return <div className="page container"><div className="loading">Loading...</div></div>;
  if (error) return <div className="page container"><div className="error-message">{error}</div></div>;
  if (!bean) return <div className="page container"><div className="loading">Bean not found.</div></div>;

  return (
    <div className="page container">
      <div className="bean-detail">
        <div className="bean-detail__header">
          <Link to="/beans" className="btn btn-outline btn-sm">&larr; Back to Beans</Link>
          <div className="bean-detail__actions">
            <Link to={`/beans/${id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
            <Link to={`/brew-log/new?beanId=${id}`} className="btn btn-secondary btn-sm">Log Brew</Link>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="card bean-detail__info">
          <div className="bean-detail__info-header">
            <div>
              <h1>{bean.beanName}</h1>
              <p className="bean-detail__roaster">{bean.roasterName}</p>
            </div>
            <span className={`badge badge-${bean.roastLevel?.toLowerCase()}`}>
              {bean.roastLevel} Roast
            </span>
          </div>
          {bean.origin && (
            <div className="bean-detail__field">
              <span className="bean-detail__label">Origin</span>
              <span>{bean.origin}</span>
            </div>
          )}
          {bean.tastingNotes && (
            <div className="bean-detail__field">
              <span className="bean-detail__label">Tasting Notes</span>
              <span>{bean.tastingNotes}</span>
            </div>
          )}
          <div className="bean-detail__field">
            <span className="bean-detail__label">Added</span>
            <span>{new Date(bean.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bean-detail__logs">
          <div className="bean-detail__logs-header">
            <h2>Brew Logs ({logs.length})</h2>
            <Link to={`/brew-log/new?beanId=${id}`} className="btn btn-primary btn-sm">
              + Log New Brew
            </Link>
          </div>

          {logs.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <h2>No brew logs yet</h2>
                <p>Start logging extractions for this bean.</p>
                <Link to={`/brew-log/new?beanId=${id}`} className="btn btn-primary">
                  Log Your First Brew
                </Link>
              </div>
            </div>
          ) : (
            <div className="card table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Dose</th>
                    <th>Yield</th>
                    <th>Ratio</th>
                    <th>Time</th>
                    <th>Grind</th>
                    <th>Rating</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const ratio = (log.yieldGrams / log.doseGrams).toFixed(1);
                    return (
                      <tr key={log.id}>
                        <td>{new Date(log.createdAt).toLocaleDateString()}</td>
                        <td>{log.doseGrams}g</td>
                        <td>{log.yieldGrams}g</td>
                        <td><span className="ratio">{ratio}:1</span></td>
                        <td>{formatTime(log.extractionTimeSeconds)}</td>
                        <td>{log.grindSetting || "-"}</td>
                        <td>{"★".repeat(log.rating)}{"☆".repeat(5 - log.rating)}</td>
                        <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {log.notes || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}