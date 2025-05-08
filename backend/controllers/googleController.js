import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        
        // Insert user then generate JWT only after insert completes
        db.query(
          "INSERT INTO users (name, email, picture, role) VALUES (?, ?, ?, ?)",
          [name, email, picture, "user"],
          
          (insertErr) => {
            if (insertErr) return res.status(500).json({ message: "Insert error" });

            // User inserted — now generate and return JWT
            const user = { email, role: "user" };
            const jwtToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token: jwtToken });
          }
        );
      } else {
        // User already exists — generate JWT immediately
        const user = { email, role: results[0].role };
        const jwtToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token: jwtToken });
      }
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};

