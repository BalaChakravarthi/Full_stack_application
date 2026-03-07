import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://full-stack-application-o8bb.onrender.com";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

