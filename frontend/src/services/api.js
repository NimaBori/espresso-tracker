import axios from "axios";
import { mockBeans, mockBrewLogs, mockAnalytics } from "./mockData";

// Check if we're in demo mode (GitHub Pages)
const isDemo = import.meta.env.VITE_DEMO_MODE === "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
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

// Simulate network delay in demo mode
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Auth API
export const login = async (username, password) => {
  if (isDemo) {
    await delay();
    if (username === "demo" && password === "demo") {
      return {
        token: "demo-jwt-token",
        username: "demo_user",
        role: "ADMIN",
      };
    }
    throw new Error("Invalid credentials. Try demo/demo");
  }
  return api
    .post("/auth/login", { username, password })
    .then((res) => res.data);
};

export const register = (username, email, password) =>
  api
    .post("/auth/register", { username, email, password })
    .then((res) => res.data);

// Beans API
export const getBeans = async (page = 0, size = 20) => {
  if (isDemo) {
    await delay();
    return {
      content: mockBeans,
      totalElements: mockBeans.length,
      totalPages: 1,
      number: page,
      size,
    };
  }
  return api.get(`/beans?page=${page}&size=${size}`).then((res) => res.data);
};

export const getBeanById = async (id) => {
  if (isDemo) {
    await delay();
    const bean = mockBeans.find((b) => b.id === Number(id));
    if (!bean) throw new Error("Bean not found");
    return bean;
  }
  return api.get(`/beans/${id}`).then((res) => res.data);
};

export const createBean = (beanData) =>
  api.post("/beans", beanData).then((res) => res.data);

export const updateBean = (id, beanData) =>
  api.put(`/beans/${id}`, beanData).then((res) => res.data);

export const deleteBean = async (id) => {
  if (isDemo) {
    await delay();
    return;
  }
  return api.delete(`/beans/${id}`);
};

// Brew Logs API
export const getLogsByBeanId = async (beanId) => {
  if (isDemo) {
    await delay();
    return mockBrewLogs.filter((log) => log.beanId === Number(beanId));
  }
  return api.get(`/brew-logs/bean/${beanId}`).then((res) => res.data);
};

export const getTopRatedLogs = async () => {
  if (isDemo) {
    await delay();
    return [...mockBrewLogs].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
  return api.get("/brew-logs/top-rated").then((res) => res.data);
};

export const createBrewLog = (logData) =>
  api.post("/brew-logs", logData).then((res) => res.data);

// Analytics API
export const getDashboardStats = async () => {
  if (isDemo) {
    await delay();
    return mockAnalytics;
  }
  return api.get("/analytics/dashboard").then((res) => res.data);
};

export const getTopBeans = async (limit = 10) => {
  if (isDemo) {
    await delay();
    return mockAnalytics.topBeans.slice(0, limit);
  }
  return api.get(`/analytics/top-beans?limit=${limit}`).then((res) => res.data);
};

export const getTopBrews = async (limit = 10) => {
  if (isDemo) {
    await delay();
    return mockAnalytics.topBrews.slice(0, limit);
  }
  return api.get(`/analytics/top-brews?limit=${limit}`).then((res) => res.data);
};

export const getGeoDistribution = async () => {
  if (isDemo) {
    await delay();
    return mockAnalytics.geoDistribution;
  }
  return api.get("/analytics/geo").then((res) => res.data);
};

export const getVisitTrend = async (days = 30) => {
  if (isDemo) {
    await delay();
    return mockAnalytics.visitTrend;
  }
  return api.get(`/analytics/trends?days=${days}`).then((res) => res.data);
};

export default api;
