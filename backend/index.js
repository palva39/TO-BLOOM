const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");

// Import routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const routineRoutes = require("./routes/routines");
const favoriteRoutes = require("./routes/favorites");
const recommendationRoutes = require("./routes/recommendations");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Root route for GET /
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Florecer API" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  db.$disconnect();
  process.exit(0);
});

module.exports = app;
