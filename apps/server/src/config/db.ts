import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable in your .env file"
  );
}

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "inventory_db",
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected: ${db.connection.host}`);
    console.log(`✅ Database Name: ${db.connection.db?.databaseName}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
      isConnected = true;
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  console.log("🔌 MongoDB disconnected gracefully");
}