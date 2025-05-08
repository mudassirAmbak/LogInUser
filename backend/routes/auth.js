import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();




router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user || !req.user.user || !req.user.token) {
      return res.status(500).send("User data or token missing in req.user");
    }

    const token = req.user.token; // Retrieve token from session data
    const userExists = req.user.exists;

    res.redirect(`http://localhost:3000/login?token=${token}`);
  }
);

// Optional: Token verification
router.get("/verify-token", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).send("Token required");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send("Invalid token");
    res.json({ token, user }); // ✅ include token if needed
  });
});

export default router;
