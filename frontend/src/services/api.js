import axios from "axios";
import { mockBeans, mockBrewLogs, mockAnalytics } from "./mockData";

// On local dev: VITE_API_URL is not set → empty string (uses Vite proxy to localhost:9090)
// On GitHub Pages: VITE_API_URL is set to Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout for Render cold start (free tier needs ~30s to wake up)
  timeout: 30000,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "demo-jwt-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simulate network delay for mock data
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Track whether backend is available (checked on first API call)
let backendAvailable = true;

// Check if we should use mock data (backend was unreachable)
const isMockMode = () => {
  return !backendAvailable || localStorage.getItem("useMock") === "true";
};

// Try a real API call, fall back to mock on network error
async function withFallback(apiCall, mockFn) {
  if (isMockMode()) {
    await delay();
    return mockFn();
  }

  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    // Only fall back on network errors (not 401/403 which mean backend is working)
    if (
      !error.response &&
      (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED")
    ) {
      console.warn("Backend unreachable, falling back to mock data");
      backendAvailable = false;
      localStorage.setItem("useMock", "true");
      await delay();
      return mockFn();
    }
    throw error;
  }
}

// Auth API
export const login = async (username, password) => {
  // Always try the real backend first (clear any previous mock flag)
  const wasMock = isMockMode();
  if (wasMock) {
    // If user is trying non-mock credentials, clear mock flag and try real backend
    if (
      !(
        (username === "demo" && password === "demo") ||
        (username === "demo" && password === "demo123") ||
        (username === "admin" && password === "admin123")
      )
    ) {
      // Clear mock flag and try real backend
      localStorage.removeItem("useMock");
      backendAvailable = true;
    } else {
      // Mock credentials in mock mode -> use mock
      await delay();
      return {
        token: "demo-jwt-token",
        username: "demo_user",
        role: "ADMIN",
      };
    }
  }

  try {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    // Login succeeded with real backend, clear mock flag
    localStorage.removeItem("useMock");
    backendAvailable = true;
    return response.data;
  } catch (error) {
    // Network error -> fall back to mock
    if (
      !error.response &&
      (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED")
    ) {
      console.warn("Backend unreachable, switching to demo mode");
      backendAvailable = false;
      localStorage.setItem("useMock", "true");
      await delay();
      // Accept any of these credentials for mock mode
      if (
        (username === "demo" && password === "demo") ||
        (username === "demo" && password === "demo123") ||
        (username === "admin" && password === "admin123")
      ) {
        return {
          token: "demo-jwt-token",
          username: "demo_user",
          role: "ADMIN",
        };
      }
      throw new Error(
        "Invalid credentials. Try demo/demo (mock) or admin/admin123 (local backend)",
      );
    }
    throw error;
  }
};

export const register = (username, email, password) =>
  api
    .post("/api/v1/auth/register", { username, email, password })
    .then((res) => res.data);

// Beans API
export const getBeans = async (page = 0, size = 20) => {
  return withFallback(
    () =>
      api.get(`/api/v1/beans?page=${page}&size=${size}`).then((r) => r.data),
    () => ({
      content: mockBeans,
      totalElements: mockBeans.length,
      totalPages: 1,
      number: page,
      size,
    }),
  );
};

export const getBeanById = async (id) => {
  return withFallback(
    () => api.get(`/api/v1/beans/${id}`).then((r) => r.data),
    () => {
      const bean = mockBeans.find((b) => b.id === Number(id));
      if (!bean) throw new Error("Bean not found");
      return bean;
    },
  );
};

export const createBean = (beanData) =>
  api.post("/api/v1/beans", beanData).then((res) => res.data);

export const updateBean = (id, beanData) =>
  api.put(`/api/v1/beans/${id}`, beanData).then((res) => res.data);

export const deleteBean = async (id) => {
  if (isMockMode()) {
    await delay();
    return;
  }
  return api.delete(`/api/v1/beans/${id}`);
};

// Brew Logs API
export const getLogsByBeanId = async (beanId) => {
  return withFallback(
    () => api.get(`/api/v1/brew-logs/bean/${beanId}`).then((r) => r.data),
    () => mockBrewLogs.filter((log) => log.beanId === Number(beanId)),
  );
};

export const getTopRatedLogs = async () => {
  return withFallback(
    () => api.get("/api/v1/brew-logs/top-rated").then((r) => r.data),
    () => [...mockBrewLogs].sort((a, b) => b.rating - a.rating).slice(0, 5),
  );
};

export const createBrewLog = (logData) =>
  api.post("/api/v1/brew-logs", logData).then((res) => res.data);

// Analytics API
export const getDashboardStats = async () => {
  return withFallback(
    () => api.get("/api/v1/analytics/dashboard").then((r) => r.data),
    () => mockAnalytics,
  );
};

export const getTopBeans = async (limit = 10) => {
  return withFallback(
    () =>
      api.get(`/api/v1/analytics/top-beans?limit=${limit}`).then((r) => r.data),
    () => mockAnalytics.topBeans.slice(0, limit),
  );
};

export const getTopBrews = async (limit = 10) => {
  return withFallback(
    () =>
      api.get(`/api/v1/analytics/top-brews?limit=${limit}`).then((r) => r.data),
    () => mockAnalytics.topBrews.slice(0, limit),
  );
};

export const getGeoDistribution = async () => {
  return withFallback(
    () => api.get("/api/v1/analytics/geo").then((r) => r.data),
    () => mockAnalytics.geoDistribution,
  );
};

export const getVisitTrend = async (days = 30) => {
  return withFallback(
    () => api.get(`/api/v1/analytics/trends?days=${days}`).then((r) => r.data),
    () => mockAnalytics.visitTrend,
  );
};

export default api;
