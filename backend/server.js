// import express from "express";
// import cors from "cors";

// import mainRoutes from "./routes/mainRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// import passwordRoutes from "./routes/password.js";

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.use("/api/auth/password", passwordRoutes);
// app.use("/api/auth", mainRoutes);
// app.use("/api/users", userRoutes);

// app.listen(5000, () => console.log("Server running on port 5000"));


import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Passport config
import "./config/passport.js";

// Routes
import mainRoutes from "./routes/mainRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passwordRoutes from "./routes/password.js";
import authRoutes from "./routes/auth.js"; // Google OAuth routes

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
app.use("/auth", authRoutes); // Google OAuth

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
