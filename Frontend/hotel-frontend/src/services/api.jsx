import axios from "axios";

const API = axios.create({
  // baseURL: "https://full-stack-application-o8bb.onrender.com/api/",
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;