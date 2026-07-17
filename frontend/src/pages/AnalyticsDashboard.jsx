import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, Cell
} from "recharts";
import "./AnalyticsDashboard.scss";

const COLORS = ["#6F4E37", "#8B6346", "#A07855", "#B8926E", "#D4A88A", "#E8C4A8", "#F0D5C0", "#F5E0D0"];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Failed to load analytics dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="page container"><div className="loading">Loading analytics...</div></div>;
  if (error) return <div className="page container"><div className="error-message">{error}</div></div>;
  if (!stats) return <div className="page container"><div className="empty-state">No analytics data available.</div></div>;

  return (
    <div className="page container analytics-dashboard">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <span className="analytics-card__label">Total Visits</span>
          <span className="analytics-card__value">{stats.totalVisits}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-card__label">Visits Today</span>
          <span className="analytics-card__value">{stats.visitsToday}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-card__label">Total Beans</span>
          <span className="analytics-card__value">{stats.totalBeans}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-card__label">Total Brew Logs</span>
          <span className="analytics-card__value">{stats.totalBrewLogs}</span>
        </div>
      </div>

      {/* Visit Trend Line Chart */}
      <div className="analytics-chart">
        <h2>Visit Trend (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.visitTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#6F4E37" strokeWidth={2} dot={{ r: 3 }} name="Visits" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Geo Distribution Bar Chart */}
      <div className="analytics-chart">
        <h2>Country Breakdown</h2>
        {stats.geoDistribution && stats.geoDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.geoDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
              <XAxis dataKey="country" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Visits" fill="#6F4E37" radius={[4, 4, 0, 0]}>
                {stats.geoDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No geo data available yet.</div>
        )}
      </div>

      {/* Top Beans Horizontal Bar Chart */}
      <div className="analytics-chart">
        <h2>Top Viewed Beans</h2>
        {stats.topBeans && stats.topBeans.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(200, stats.topBeans.length * 50)}>
            <BarChart data={stats.topBeans} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="beanName" tick={{ fontSize: 11 }} width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitCount" name="Visits" fill="#8B6346" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No bean visit data yet.</div>
        )}
      </div>

      {/* Bean Performance: Avg Rating vs Brew Count */}
      <div className="analytics-chart">
        <h2>Bean Performance (Avg Rating vs Brew Count)</h2>
        {stats.beanPerformance && stats.beanPerformance.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.beanPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
              <XAxis dataKey="beanName" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" orientation="left" domain={[0, 5]} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="avgRating" name="Avg Rating" fill="#6F4E37" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="brewCount" name="Brew Count" fill="#D4A88A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No bean performance data yet.</div>
        )}
      </div>

      {/* Extraction Ratio Scatter Plot */}
      <div className="analytics-chart">
        <h2>Extraction Ratio (Dose vs Yield by Rating)</h2>
        {stats.extractionRatios && stats.extractionRatios.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
              <XAxis dataKey="doseGrams" name="Dose (g)" unit="g" />
              <YAxis dataKey="yieldGrams" name="Yield (g)" unit="g" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value + "g", name]} />
              <Legend />
              <Scatter data={stats.extractionRatios} name="Extractions" fill="#6F4E37">
                {stats.extractionRatios.map((entry, index) => {
                  const color = entry.rating >= 4 ? "#2E7D32" : entry.rating >= 3 ? "#F9A825" : "#C62828";
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No extraction data yet.</div>
        )}
      </div>

      {/* Rating Distribution Bar Chart */}
      <div className="analytics-chart">
        <h2>Rating Distribution</h2>
        {stats.ratingDistribution && stats.ratingDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0d5c8" />
              <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Brew Logs" radius={[4, 4, 0, 0]}>
                {stats.ratingDistribution.map((entry, index) => {
                  const colors = ["#C62828", "#E65100", "#F9A825", "#7CB342", "#2E7D32"];
                  return <Cell key={`cell-${index}`} fill={colors[index] || colors[4]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No rating data yet.</div>
        )}
      </div>
    </div>
  );
}