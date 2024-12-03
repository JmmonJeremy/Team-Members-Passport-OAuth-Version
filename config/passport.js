// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,     
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google Profile:', profile);    
      const user = {        
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0].value,
      };
      done(null, user);
    }
  )
);

// Serialize user into JWT
passport.serializeUser((user, done) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log(`User created: ${token}`);
  console.log('Token Created:', token); // Log the created token
  console.log('User Data for Token:', user); // Log user data used for token creation
  done(null, token);
});

passport.deserializeUser((token, done) => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    done(null, user);
    console.log('Token Being Validated:', token); // Log the incoming token
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
