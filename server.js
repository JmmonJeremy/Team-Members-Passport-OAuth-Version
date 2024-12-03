const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongodb = require('./db/connect');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Route for OAuth
const itemRoutes = require('./routes/items');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 55000;
const app = express();

// Initialize passport configuration
require('./config/passport'); 

app
  // Body parser for JSON requests
  .use(bodyParser.json())
  
  // Add express-session before passport
  .use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false, // Prevent resaving unmodified sessions
    saveUninitialized: false, // Don’t save uninitialized sessions
  }))
  
  // Initialize Passport and enable persistent login sessions
  .use(passport.initialize())
  .use(passport.session()) // This is needed for persistent login sessions
  
  .use((req, res, next) => {
    // Allow CORS for all domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })
  // Serve static files from the "public" folder
  .use(express.static(path.join(__dirname, 'public')))
  // Default route to load index.html 
  .use('/auth', authRoutes) // OAuth routes
  .use('/items', itemRoutes) // Protected API routes
  .use(
    '/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument, {
      customCss: `
        .swagger-ui label,
        .swagger-ui .auth-container input {
          display: none;
        }
        .swagger-ui .dialog-ux .modal-ux-content p.flow {
          margin-bottom: 2rem;
        }
        .swagger-ui b {
          color: red;
          position: absolute;
          bottom: 90px;
          left: 40px;      
        }  
        .swagger-ui .parameter__default {
          display: none;
        }   
      ` // Example of custom CSS directly in the setup
    })
  )
  .use('/', (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

// Initialize the database and start the server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`App is live at http://localhost:${port}/`);
    });
  }
});
