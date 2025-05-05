import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import db from "../config/db.js"; 

dotenv.config();

const router = express.Router();

// ➤ Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
if (!user || user.length === 0) {
  return res.status(404).json({ message: "User not found" });
}


  const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  console.log("Reset Link:", resetLink);

  res.json({ message: "Reset link sent. Check your email (or console)." });
});

// ➤ Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      decoded.id,
    ]);
  
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    if (err instanceof jwt.ExpiredError) {
      return res.status(400).json({ message: "Token has expired." });
    }
    res.status(400).json({ message: "Invalid or expired token." });
  }
  
});

export default router;
