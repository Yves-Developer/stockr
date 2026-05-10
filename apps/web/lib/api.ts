import axios from "axios";

const api = axios.create({
  // Use a relative path to leverage the Next.js rewrite proxy.
  // This ensures cookies are sent automatically without cross-origin issues.
  baseURL: typeof window === "undefined" 
    ? (() => {
        let url = process.env.BACKEND_URL || "https://stockr-server.onrender.com";
        url = url.replace(/\/$/, "");
        if (url.endsWith("/api")) url = url.slice(0, -4);
        return `${url}/api`;
      })()
    : "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
