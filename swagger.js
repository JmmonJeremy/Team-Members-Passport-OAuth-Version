const swaggerAutogen = require('swagger-autogen')();

// Check the environment and set the host and scheme accordingly
const isProduction = process.env.NODE_ENV === 'production';
console.log('Is Production:', isProduction); // Check if it's true or false

const doc = {
  info: {
    title: 'My API',
    description: 'Computer Store API'
  },
  host: isProduction
  ? 'team-members-passport-oauth-version.onrender.com'
  : 'localhost:55000',
  schemes: isProduction ? ['https'] : ['http'],  
  securityDefinitions: {
    GoogleOAuth2: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: isProduction
      // missing /auth/google was the difference between it working and not working
      ? 'https://team-members-passport-oauth-version.onrender.com/auth/google'
      : 'http://localhost:55000/auth/google',
      description: 'Use Google OAuth2 to authenticate <b>Exchange the hidden GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for JWT_Token.</b>',
      // client_id: process.env.GOOGLE_CLIENT_ID, // Inject client_id dynamically
    },
  } 
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);