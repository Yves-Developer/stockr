import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication if needed
api.interceptors.request.use((config) => {
  // BetterAuth handles sessions via cookies usually, 
  // so withCredentials: true might be needed if cross-domain
  config.withCredentials = true;
  return config;
});

export default api;
