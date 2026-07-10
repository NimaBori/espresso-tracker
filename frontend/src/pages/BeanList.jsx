import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBeans, deleteBean } from "../services/api";
import "./BeanList.scss";

export default function BeanList() {
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBeans();
  }, []);

  async function loadBeans() {
    try {
      setLoading(true);
      const data = await getBeans(0, 100);
      setBeans(data.content || data);
      setError(null);
    } catch (err) {
      console.error("Failed to load beans:", err);
      setError("Could not load beans. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, beanName) {
    if (!window.confirm(`Delete "${beanName}"? This cannot be undone.`)) return;
    try {
      await deleteBean(id);
      setBeans((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete bean:", err);
      setError("Failed to delete bean. It may have brew logs attached.");
    }
  }

  if (loading) return <div className="page container"><div className="loading">Loading beans...</div></div>;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>All Beans</h1>
        <Link to="/beans/new" className="btn btn-primary">+ Add Bean</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {beans.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h2>No beans yet</h2>
            <p>Start your coffee journey by adding your first bean.</p>
            <Link to="/beans/new" className="btn btn-primary">Add Your First Bean</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="bean-grid">
            {beans.map((bean) => (
              <div key={bean.id} className="card bean-card">
                <div className="bean-card__body" onClick={() => navigate(`/beans/${bean.id}`)}>
                  <div className="bean-card__header">
                    <h3 className="bean-card__name">{bean.beanName}</h3>
                    <span className={`badge badge-${bean.roastLevel?.toLowerCase()}`}>
                      {bean.roastLevel}
                    </span>
                  </div>
                  <div className="bean-card__roaster">{bean.roasterName}</div>
                  {bean.origin && <div className="bean-card__origin">{bean.origin}</div>}
                  {bean.tastingNotes && (
                    <div className="bean-card__notes">{bean.tastingNotes}</div>
                  )}
                </div>
                <div className="bean-card__actions">
                  <Link to={`/beans/${bean.id}/edit`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(bean.id, bean.beanName)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}