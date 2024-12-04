// routes/auth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Initiate Google OAuth
router.get('/google', 
  // #swagger.ignore = true
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  // #swagger.ignore = true
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  // (req, res) => {
  //   // On success, send the JWT token back to the client
  //   const token = req.user;
  //   res.json({ token });
  // }
  (req, res) => {
    // On successful authentication, exchange the Google code for a token
    const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  }
);

module.exports = router;
