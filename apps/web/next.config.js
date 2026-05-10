/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    let backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    
    // Sanitize: Remove trailing slash and trailing /api
    backendUrl = backendUrl.replace(/\/$/, "");
    if (backendUrl.endsWith("/api")) {
      backendUrl = backendUrl.slice(0, -4);
    }

    return [
      {
        source: "/api/backend-health",
        destination: `${backendUrl}/`,
      },
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
