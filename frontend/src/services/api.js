import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (username, password) =>
  api.post("/auth/login", { username, password }).then((res) => res.data);

export const register = (username, email, password) =>
  api
    .post("/auth/register", { username, email, password })
    .then((res) => res.data);

// Beans API
export const getBeans = (page = 0, size = 20) =>
  api.get(`/beans?page=${page}&size=${size}`).then((res) => res.data);

export const getBeanById = (id) =>
  api.get(`/beans/${id}`).then((res) => res.data);

export const createBean = (beanData) =>
  api.post("/beans", beanData).then((res) => res.data);

export const updateBean = (id, beanData) =>
  api.put(`/beans/${id}`, beanData).then((res) => res.data);

export const deleteBean = (id) => api.delete(`/beans/${id}`);

// Brew Logs API
export const getLogsByBeanId = (beanId) =>
  api.get(`/brew-logs/bean/${beanId}`).then((res) => res.data);

export const getTopRatedLogs = () =>
  api.get("/brew-logs/top-rated").then((res) => res.data);

export const createBrewLog = (logData) =>
  api.post("/brew-logs", logData).then((res) => res.data);

// Analytics API
export const getDashboardStats = () =>
  api.get("/analytics/dashboard").then((res) => res.data);

export const getTopBeans = (limit = 10) =>
  api.get(`/analytics/top-beans?limit=${limit}`).then((res) => res.data);

export const getTopBrews = (limit = 10) =>
  api.get(`/analytics/top-brews?limit=${limit}`).then((res) => res.data);

export const getGeoDistribution = () =>
  api.get("/analytics/geo").then((res) => res.data);

export const getVisitTrend = (days = 30) =>
  api.get(`/analytics/trends?days=${days}`).then((res) => res.data);

export default api;
