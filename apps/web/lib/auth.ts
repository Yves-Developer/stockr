import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(); // Uses the database from the connection string

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "https://stockr-rho.vercel.app",
  emailAndPassword: {
    enabled: true,
  },
  // You can add more options here (social logins, etc.)
});
