/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    let backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    
    // Ensure we have a clean base URL without trailing slashes or /api
    backendUrl = backendUrl.replace(/\/+$/, "");
    if (backendUrl.endsWith("/api")) {
      backendUrl = backendUrl.slice(0, -4).replace(/\/+$/, "");
    }

    return [
      {
        source: "/api/debug-env",
        destination: `https://echo-api.vercel.app/api/echo?hasBackendUrl=${!!process.env.BACKEND_URL}&nodeEnv=${process.env.NODE_ENV}`,
      },
      {
        source: "/api/backend-health",
        destination: `${backendUrl}/health`,
      },
      {
        // Explicitly map /api/backend/ to /api/ on the backend
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
