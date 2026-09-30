import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./controllers/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Gather allowed origins from environment variables or defaults
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
  process.env.ALLOWED_ORIGINS,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(",").map((o) => o.trim()));

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

// Dynamic CORS configuration for smooth deployment across localhost and remote domains
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // If wildcard origin configured
    if (allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    // Match exact allowed origin or localhost pattern
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isAllowed = allowedOrigins.includes(origin);

    if (isLocalhost || isAllowed) {
      return callback(null, true);
    }

    // If no explicit frontend restriction, dynamically allow origin to avoid breaking deployments
    if (envOrigins.length === 0 || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check and root endpoints for deployment verification
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Expense Tracker API is running smoothly",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      expenses: "/api/expenses",
      categories: "/api/categories",
    },
  });
};

app.get("/", healthCheckHandler);
app.get("/health", healthCheckHandler);
app.get("/api", healthCheckHandler);
app.get("/api/health", healthCheckHandler);

// Standardized common API routes (supports both /api/* and root/* prefixes, plural and singular)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/expenses", expenseRoutes);
app.use("/expense", expenseRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/categories", categoryRoutes);
app.use("/category", categoryRoutes);

// Admin-only routes (protected by protect + adminOnly middleware)
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);


// Catch-all 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// Start DB connection and HTTP server
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Initial DB connection failed, server still starting for health checks:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/api/health`);
  });
};

startServer();

export default app;
