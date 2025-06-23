const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email or username" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = db.user.create({
      email,
      username,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[DEBUG] Login attempt:", email);
    // Find user
    const user = db.user.findUnique({
      where: { email },
    });
    console.log("[DEBUG] User found:", user);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        rol: user.rol,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    console.log("[DEBUG] /me for userId:", req.user.userId);
    const user = db.user.findUnique({
      where: { id: req.user.userId },
    });
    console.log("[DEBUG] /me user found:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Debug: log user role
    console.log("[DEBUG] /me user role:", user.rol);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        rol: user.rol,
        avatar_url: user.avatar_url,
        bio: user.bio,
        description: user.description,
        preferencias: user.preferencias,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("/me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update current user's profile
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { avatar_url, bio, description, preferencias } = req.body;
    console.log("[DEBUG] Update profile for user:", req.user.userId, req.body);
    const user = db.user.update({
      where: { id: req.user.userId },
      data: {
        avatar_url,
        bio,
        description,
        preferencias,
      },
    });
    if (!user) {
      console.error("[ERROR] User not found for update", req.user.userId);
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("[ERROR] Profile update failed", err);
    res
      .status(500)
      .json({ error: "Error updating profile", details: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
