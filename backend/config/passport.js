import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import db from './db.js'; // Make sure db.js also uses `export default`
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    let user;
    if (existing.length === 0) {
      await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, '']);
      const [newUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      user = newUser[0];
    } else {
      user = existing[0];
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return done(null, { token, user });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
