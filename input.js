
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');

// Set up Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // This function is called when the user is authenticated by Google.
    // You can perform further actions here, like saving user data to database.
    return done(null, profile);
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

const app = express();

// Use express-session middleware
app.use(session({
    secret: '456',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Serve the static files from the current directory
app.use(express.static(__dirname));

// Route for serving login.html directly when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for initiating Google OAuth authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route for handling Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect user to the provided link after successful authentication
        res.redirect('https://script.google.com/macros/s/AKfycbx5N6J-MO4ctASuZUk87ucecUHdShU8Pb5BPRqsgmncXDDbf_m6B-WceLbrvW7gBjdu/exec');
    }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
