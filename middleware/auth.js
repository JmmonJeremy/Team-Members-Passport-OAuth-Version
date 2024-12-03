const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {  
  // const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  const authHeader = req.headers['authorization']; // Retrieve the Authorization header
  // Log the Authorization header
  console.log('Authorization Header:', authHeader);
  // Extract the token from the Authorization header
  const token = authHeader?.split(' ')[1];
  console.log('Extracted Token:', token); // Log the extracted token
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the secret
  if (!token) {
    return res.sendStatus(403); // Forbidden if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err.message); // Log verification errors
      return res.sendStatus(403); // Forbidden if invalid token      
    }
    console.log('Decoded User:', user); // Log the decoded user details
    req.user = user; // Attach the decoded user data to the request
    next(); // Continue to the next middleware or route handler
  });
}

module.exports = authenticateJWT;
