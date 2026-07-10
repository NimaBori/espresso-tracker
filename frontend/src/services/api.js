import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
