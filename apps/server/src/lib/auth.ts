import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

// We use mongoose.connection.db which will be available after connectDB is called.
export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db as any),
  emailAndPassword: {
    enabled: true,
  },
});
