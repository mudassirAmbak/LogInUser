import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import db from "./db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const picture = profile.photos ? profile.photos[0].value : null;

      try {
        const [existing] = await db.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        let user;

        if (existing.length === 0) {
          // New user, insert into DB
          await db.execute(
            "INSERT INTO users (name, email, picture, password) VALUES (?, ?, ?, ?)",
            [name, email, picture, ""]
          );
          const [newUser] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
          );
          user = newUser[0];
        } else {
          // Existing user
          user = existing[0];
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Pass user and token in the done callback
        return done(null, { token, user });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Store both user ID and JWT token in session
passport.serializeUser((user, done) => {
  if (!user || !user.user || !user.token) {
    return done(new Error("User or token missing"));
  }
  // Store both ID and token in the session
  done(null, { id: user.user.id, token: user.token });
});

// Restore full user from DB using ID and token
passport.deserializeUser(async (data, done) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
      data.id,
    ]);
    if (!rows[0]) {
      return done(new Error("User not found"));
    }
    // Pass the full user and token back
    done(null, { user: rows[0], token: data.token });
  } catch (err) {
    done(err);
  }
});
