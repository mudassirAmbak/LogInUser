import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

// Passport config
import "./config/passport.js";

// Routes
import mainRoutes from "./routes/mainRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/password.js";
import authRoutes from "./routes/auth.js"; // Google OAuth routes

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import uploadRoutes from "./routes/uploadRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();

// CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth/password", passwordRoutes);
app.use("/api/auth", mainRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // new route for file upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
