import axios from "axios";

const api = axios.create({
  // Use a relative path to leverage the Next.js rewrite proxy.
  // This ensures cookies are sent automatically without cross-origin issues.
  baseURL: typeof window === "undefined" 
    ? "http://localhost:5000/api" 
    : "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
