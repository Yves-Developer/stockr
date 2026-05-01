import dotenv from "dotenv";
dotenv.config(); // ← must run FIRST before anything else

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "🚀 Inventory API is running" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// TODO: Mount inventory routes here once ready
// import inventoryRoutes from "./routes/inventory";
// app.use("/api/inventory", inventoryRoutes);

// ---------- Start Server ----------
async function startServer() {
  try {
    // Connect to MongoDB before starting the server
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log("👋 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;