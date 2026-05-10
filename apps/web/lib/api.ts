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

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Better Auth stores the session token in local storage or cookies.
    // We check both common keys just in case.
    const token = localStorage.getItem("better-auth.session_token") || 
                  localStorage.getItem("better-auth.session-token");
    
    if (token) {
      console.log(`[API] Adding Authorization header (Token: ...${token.slice(-6)})`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("[API] No session token found in localStorage for request:", config.url);
    }
  }
  return config;
});

export default api;
