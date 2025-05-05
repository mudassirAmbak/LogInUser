import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
  }
);

// Optional: Token verification route
router.get('/verify-token', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).send('Token required');

//   const tempToken = jwt.sign(
//     { id: 1, name: "Test", email: "test@gmail.com" },
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' }
//   );
//   console.log("TEMP TEST TOKEN:", tempToken);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send('Invalid token');
    res.json(user);
  });
});



export default router;
