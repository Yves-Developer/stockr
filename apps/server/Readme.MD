# MongoDB Connection Setup — `apps/server`

## What was done in this task

Set up the MongoDB database connection for the Express backend as part of the Inventory Management feature.

---

## Files Added / Modified

| File | Description |
|------|-------------|
| `src/config/db.ts` | MongoDB connection utility using Mongoose |
| `src/index.ts` | Express entry point — connects to DB before starting server |
| `.env.example` | Environment variable template |
| `package.json` | Added `mongoose`, `cors`, `dotenv` dependencies |
| `tsconfig.json` | TypeScript configuration |

---

## Setup Instructions

### 1. Install dependencies
```bash
cd apps/server
pnpm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

Then edit `.env` and fill in your MongoDB URI:

**Local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=inventory_db
```

**MongoDB Atlas (cloud):**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=inventory_db
```

### 3. Run the server
```bash
# From the monorepo root
pnpm dev --filter=server

# OR from apps/server directly
pnpm dev
```

---

## How the DB Connection Works

- `src/config/db.ts` exports `connectDB()` and `disconnectDB()` functions
- `connectDB()` is called in `src/index.ts` **before** the Express server starts listening
- If the connection fails, the process exits with an error (fail-fast)
- Handles auto-reconnect and graceful shutdown on `SIGINT` / `SIGTERM`

---

## Branch & PR

- **Branch:** `feat/mongodb-connection`
- Create a PR targeting `main` (or `dev`) for review by Yves DC