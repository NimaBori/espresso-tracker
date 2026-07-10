import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getBeans, createBrewLog } from "../services/api";
import "./BrewLogForm.scss";

export default function BrewLogForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedBeanId = searchParams.get("beanId") || "";

  const [beans, setBeans] = useState([]);
  const [formData, setFormData] = useState({
    beanId: preselectedBeanId,
    doseGrams: "",
    yieldGrams: "",
    extractionTimeSeconds: "",
    grindSetting: "",
    rating: 3,
    notes: "",
  });
  const [loadingBeans, setLoadingBeans] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchBeans() {
      try {
        const data = await getBeans(0, 100);
        setBeans(data.content || data);
      } catch (err) {
        setError("Could not load beans. Make sure you've added at least one bean first.");
      } finally {
        setLoadingBeans(false);
      }
    }
    fetchBeans();
  }, []);

  function handleChange(e) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        beanId: formData.beanId,
        doseGrams: Number(formData.doseGrams),
        yieldGrams: Number(formData.yieldGrams),
        extractionTimeSeconds: Number(formData.extractionTimeSeconds),
        grindSetting: formData.grindSetting || null,
        rating: Number(formData.rating),
        notes: formData.notes || null,
      };

      await createBrewLog(payload);
      setSuccess("Brew logged successfully!");

      // Navigate back to the bean detail if there's a preselected bean
      if (preselectedBeanId) {
        setTimeout(() => navigate(`/beans/${preselectedBeanId}`), 1000);
      } else {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("Failed to log brew:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.defaultMessage ||
        "Failed to log brew. Please check your input.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingBeans) return <div className="page container"><div className="loading">Loading beans...</div></div>;

  return (
    <div className="page container">
      <div className="page-header">
        <h1>Log a Brew</h1>
      </div>

      <div className="form-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {beans.length === 0 && !error ? (
          <div className="empty-state">
            <h2>No beans found</h2>
            <p>You need to add a coffee bean before you can log a brew.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/beans/new")}
            >
              Add a Bean First
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="beanId">Bean *</label>
              <select
                id="beanId"
                name="beanId"
                value={formData.beanId}
                onChange={handleChange}
                required
              >
                <option value="">Select a bean...</option>
                {beans.map((bean) => (
                  <option key={bean.id} value={bean.id}>
                    {bean.roasterName} - {bean.beanName} ({bean.roastLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="doseGrams">Dose (g) *</label>
                <input
                  id="doseGrams"
                  name="doseGrams"
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.doseGrams}
                  onChange={handleChange}
                  placeholder="e.g. 18"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="yieldGrams">Yield (g) *</label>
                <input
                  id="yieldGrams"
                  name="yieldGrams"
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.yieldGrams}
                  onChange={handleChange}
                  placeholder="e.g. 36"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="extractionTimeSeconds">Extraction Time (s) *</label>
                <input
                  id="extractionTimeSeconds"
                  name="extractionTimeSeconds"
                  type="number"
                  min="1"
                  value={formData.extractionTimeSeconds}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="grindSetting">Grind Setting</label>
                <input
                  id="grindSetting"
                  name="grindSetting"
                  value={formData.grindSetting}
                  onChange={handleChange}
                  placeholder="e.g. 2.5 on Niche Zero"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating *</label>
              <div className="rating-input">
                <input
                  id="rating"
                  name="rating"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                />
                <span className="rating-input__value">
                  {"★".repeat(formData.rating)}{"☆".repeat(5 - formData.rating)}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Tasting notes, observations, water temp, etc."
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
                {saving ? "Saving..." : "Log Brew"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}