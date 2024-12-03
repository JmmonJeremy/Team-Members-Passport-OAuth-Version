// routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // On success, send the JWT token back to the client
    const token = req.user;
    res.json({ token });
  }
);

module.exports = router;
