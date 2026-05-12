import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://stockr-rho.vercel.app",
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});
