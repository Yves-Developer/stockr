import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { bearer } from "better-auth/plugins";

export const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB_NAME || "inventory_db";
export const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "https://stockr-rho.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://stockr-rho.vercel.app"
  ],
  plugins: [
    bearer()
  ],
  emailAndPassword: {
    enabled: true,
  },
});
