import dotenv from "dotenv";
dotenv.config(); // ← MUST be first before any other imports

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db";
import { errorHandler, notFound } from "./middleware/ErrorHandler";

// Routes
import authRoutes from "./routes/AuthRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import supplierRoutes from "./routes/SupplierRoutes";
import productRoutes from "./routes/ProductRoutes";
import stockMovementRoutes from "./routes/StockMovementRoutes";
import dashboardRoutes from "./routes/DashboardRoutes";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "🚀 Stockr Inventory API is running" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock-movements", stockMovementRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start Server ----------
async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

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