// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const axios = require('axios');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google Strategy
passport.use(new GoogleStrategy({
    clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback' // Adjust the callback URL as per your setup
  },
  function(accessToken, refreshToken, profile, done) {
    // Check authentication here (e.g., check if user exists in your database)
    // For demonstration purposes, assume authentication is successful
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

async function triggerScript(infoUrl, questUrl, deadline) {
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwLSdYhIXRhcDXSbfmxnW-Tr1pr5Xdp4wMFlQroW7KHvmp2FvmqXHPZKXK1xtMhPxII/exec'; // Replace with your Google Apps Script URL
      const response = await axios.get(scriptUrl, {
        params: {
          infoUrl: infoUrl,
          questUrl: questUrl,
          deadline: deadline // Pass the deadline parameter
        }
      });
      console.log('Google Apps Script response:', response.data);
    } catch (error) {
      throw error;
    }
  }

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

// Google OAuth2 login route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth2 callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to index page
    res.redirect('/index.html');
  }
);

app.post('/assess', async (req, res) => {
    try {
      console.log('Request Body:', req.body); // Log the request body
  
      const infoUrl = req.body.info_url;
      const questUrl = req.body.quest_url;
      const deadline = req.body.deadline;
  
      // Send the URLs and deadline to the Google Apps Script function
      await triggerScript(infoUrl, questUrl, deadline);
  
      // Redirect back to index page or send a response indicating success
      res.redirect('/index.html');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    }
  });

// Logout route
app.get('/logout', (req, res) => {
  // Perform logout logic here (e.g., destroy session, clear cookies, etc.)
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Error logging out');
      }
      res.redirect('/'); // Redirect back to start page
    });
  });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
