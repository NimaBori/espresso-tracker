import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBean, updateBean, getBeanById } from "../services/api";
import "./BeanForm.scss";

const ROAST_LEVELS = ["LIGHT", "MEDIUM", "DARK"];

export default function BeanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    roasterName: "",
    beanName: "",
    origin: "",
    roastLevel: "MEDIUM",
    tastingNotes: "",
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      async function loadBean() {
        try {
          const bean = await getBeanById(id);
          setFormData({
            roasterName: bean.roasterName || "",
            beanName: bean.beanName || "",
            origin: bean.origin || "",
            roastLevel: bean.roastLevel || "MEDIUM",
            tastingNotes: bean.tastingNotes || "",
          });
        } catch (err) {
          setError("Failed to load bean data for editing.");
        } finally {
          setLoading(false);
        }
      }
      loadBean();
    }
  }, [id, isEditMode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode) {
        await updateBean(id, formData);
        setSuccess("Bean updated successfully!");
        setTimeout(() => navigate(`/beans/${id}`), 1000);
      } else {
        const created = await createBean(formData);
        setSuccess("Bean added successfully!");
        setTimeout(() => navigate(`/beans/${created.id}`), 1000);
      }
    } catch (err) {
      console.error("Failed to save bean:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.defaultMessage ||
        "Failed to save bean. Please check your input.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page container"><div className="loading">Loading...</div></div>;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>{isEditMode ? "Edit Bean" : "Add New Bean"}</h1>
      </div>

      <div className="form-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roasterName">Roaster *</label>
              <input
                id="roasterName"
                name="roasterName"
                value={formData.roasterName}
                onChange={handleChange}
                placeholder="e.g. Onyx Coffee Lab"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="beanName">Bean Name *</label>
              <input
                id="beanName"
                name="beanName"
                value={formData.beanName}
                onChange={handleChange}
                placeholder="e.g. Ethiopia Guji"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="origin">Origin</label>
              <input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Ethiopia, Yirgacheffe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="roastLevel">Roast Level *</label>
              <select
                id="roastLevel"
                name="roastLevel"
                value={formData.roastLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select roast level...</option>
                {ROAST_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tastingNotes">Tasting Notes</label>
            <textarea
              id="tastingNotes"
              name="tastingNotes"
              value={formData.tastingNotes}
              onChange={handleChange}
              placeholder="e.g. Blueberry, dark chocolate, floral"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : isEditMode ? "Update Bean" : "Add Bean"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}