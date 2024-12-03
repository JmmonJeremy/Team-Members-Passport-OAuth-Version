const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.sendStatus(403); // Forbidden if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if invalid token
    }
    req.user = user; // Attach the decoded user data to the request
    next(); // Continue to the next middleware or route handler
  });
}

module.exports = authenticateJWT;
