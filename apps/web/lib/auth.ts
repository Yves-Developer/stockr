import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB_NAME || "inventory_db";
const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "https://stockr-rho.vercel.app",
  emailAndPassword: {
    enabled: true,
  },
  // You can add more options here (social logins, etc.)
});
