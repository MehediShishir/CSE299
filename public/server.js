// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const path = require('path');
// const fetch = require('node-fetch');

// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(session({
//   secret: '123',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Google OAuth2 configuration
// passport.use(new GoogleStrategy({
//     clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
//   }
// ));
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // Function to trigger Google Apps Script
// async function triggerScript(infoUrl, questUrl, deadline) {
//   const scriptUrl = 'https://script.google.com/macros/s/AKfycbwN-2u2bIe-BQkmgci33DFWbPb3PXLcOKePAEMfP2XO-KNmMr4ZUKSzi93A3OPrZ5-M/exec';
  
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       infoUrl: infoUrl,
//       questUrl: questUrl,
//       deadline: deadline
//     })
//   };
  
//   try {
//     const response = await fetch(scriptUrl, options);
//     const responseData = await response.text(); // Extract the response as text

//     console.log('Google Apps Script response:', responseData);
    
//     // Handle response if needed
//     // For example: if (responseData.includes('successful')) { }
    
//   } catch (error) {
//     console.error('Error calling Google Apps Script:', error);
//     throw error;
//   }
// }


// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'start.html'));
// });

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/index.html');
//   }
// );


// // Modify the /assess route to trigger the Google Apps Script with the extracted parameters
// app.post('/assess', async (req, res) => {
//   try {
//     console.log('Request Body:', req.body);

//     const infoUrl = req.body.info_url;
//     const questUrl = req.body.quest_url;
//     const deadline = req.body.deadline;

//     // Trigger the Google Apps Script with the extracted parameters
//     await triggerScript(infoUrl, questUrl, deadline);

//     res.redirect('/index.html');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred');
//   }
// });

// app.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error('Error logging out:', err);
//       return res.status(500).send('Error logging out');
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Error destroying session:', err);
//         return res.status(500).send('Error logging out');
//       }
//       res.redirect('/');
//     });
//   });
// });

// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();

// Middleware
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth2 configuration
passport.use(new GoogleStrategy({
    clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect the user to the desired link after successful authentication
    res.redirect('https://script.google.com/macros/s/AKfycbx5N6J-MO4ctASuZUk87ucecUHdShU8Pb5BPRqsgmncXDDbf_m6B-WceLbrvW7gBjdu/exec');
  }
);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
