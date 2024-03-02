// // Import necessary modules
// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const path = require('path');

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));

// // Session middleware
// app.use(session({
//   secret: '123',
//   resave: false,
//   saveUninitialized: false
// }));

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Configure Passport with Google Strategy
// passport.use(new GoogleStrategy({
//     clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/auth/google/callback' // Adjust the callback URL as per your setup
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // Check authentication here (e.g., check if user exists in your database)
//     // For demonstration purposes, assume authentication is successful
//     return done(null, profile);
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'start.html'));
// });

// // Google OAuth2 login route
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // Google OAuth2 callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {
//     // Successful authentication, redirect to index page
//     res.redirect('/index.html');
//   }
// );


// app.post('/assess', (req, res) => {
//   // Handle form submission for assessment
//   const infoUrl = req.body.info_url;
//   const questUrl = req.body.quest_url;
//   const deadline = req.body.deadline;

//   // Perform assessment logic here (e.g., fetch data from Google Sheets, perform assessment, etc.)
//   // For demonstration purposes, let's just log the submitted data
//   console.log('Information Sheet URL:', infoUrl);
//   console.log('Question & Rubrics Sheet URL:', questUrl);
//   console.log('Submission Deadline:', deadline);

//   // Redirect back to index page or send a response indicating success
//   res.redirect('/index.html');
// });

// // Logout route
// app.get('/logout', (req, res) => {
//     // Perform logout logic here (e.g., destroy session, clear cookies, etc.)
//     req.logout((err) => {
//       if (err) {
//         console.error('Error logging out:', err);
//         return res.status(500).send('Error logging out');
//       }
//       req.session.destroy((err) => {
//         if (err) {
//           console.error('Error destroying session:', err);
//           return res.status(500).send('Error logging out');
//         }
//         res.redirect('/'); // Redirect back to start page
//       });
//     });
//   });
// // Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// // Import necessary modules
// const express = require('express');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const path = require('path');
// const { google } = require('googleapis');
// const nodemailer = require('nodemailer');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new GoogleStrategy({
//     clientID: '779111636513-5g4igneqv6q1gkdqqbqf6i87es598baq.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/auth/google/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // Assuming the user's email is the primary email associated with their Google account
//     const userEmail = profile.emails[0].value;

//     // Store the user's email in the session for future use
//     req.session.userEmail = userEmail;

//     // You can optionally store accessToken and refreshToken for future API calls
//     // Assuming you have a User model where you can store this information
//     // user.accessToken = accessToken;
//     // user.refreshToken = refreshToken;
//     // user.save();

//     // Continue with authentication
//     return done(null, profile);
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'start.html'));
// });

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {
//     res.redirect('/index.html');
//   }
// );

// app.post('/assess', async (req, res) => {
//   try {
//     const infoUrl = req.body.info_url;
//     const questUrl = req.body.quest_url;
//     const deadline = req.body.deadline;

//     // Trigger Google Apps Script to create form and send emails
//     await triggerGoogleAppsScript(req);

//     res.redirect('/index.html');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('An error occurred');
//   }
// });

// // Logout route
// app.get('/logout', (req, res) => {
//     // Perform logout logic here (e.g., destroy session, clear cookies, etc.)
//     req.logout((err) => {
//       if (err) {
//         console.error('Error logging out:', err);
//         return res.status(500).send('Error logging out');
//       }
//       req.session.destroy((err) => {
//         if (err) {
//           console.error('Error destroying session:', err);
//           return res.status(500).send('Error logging out');
//         }
//         res.redirect('/'); // Redirect back to start page
//       });
//     });
//   });

// app.use(express.static(path.join(__dirname, 'public')));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const axios = require('axios');

// async function triggerGoogleAppsScript(req) {
//   try {
//     const scriptUrl = 'https://script.google.com/home/projects/178x_DzcW6yuQEb34Ohhf53wFEZbSrgD5aX9TA0njXWTcCHWyZHmGzCNh/edit'; // Replace with your Google Apps Script web app URL
//     const response = await axios.post(scriptUrl);
//     console.log('Google Apps Script response:', response.data);
//   } catch (error) {
//     throw error;
//   }
// }

// async function fetchSheetData(questUrl, infoUrl) {
//     try {
//       const auth = await getGoogleAuth();
//       const sheets = google.sheets({ version: 'v4', auth });
  
//       const [questionsRes, emailsRes] = await Promise.all([
//         sheets.spreadsheets.values.get({
//           spreadsheetId: extractSheetId(questUrl),
//           range: 'Sheet1',
//         }),
//         sheets.spreadsheets.values.get({
//           spreadsheetId: extractSheetId(infoUrl),
//           range: 'Sheet1',
//         })
//       ]);
  
//       if (!questionsRes.data.values || !emailsRes.data.values) {
//         throw new Error('No data found in the Google Sheets');
//       }
  
//       const questions = questionsRes.data.values[0];
//       const emails = emailsRes.data.values.map(row => row[0]);
  
//       return { questions, emails };
//     } catch (error) {
//       console.error('Error fetching sheet data:', error);
//       throw error; // Rethrow the error to propagate it to the caller
//     }
//   }
  

// async function createGoogleForm(questions) {
//   try {
//     const auth = await getGoogleAuth();
//     const forms = google.forms({ version: 'v1', auth });

//     const { data } = await forms.forms.create({
//       resource: {
//         title: 'Assessment Form',
//         questions: questions.map(question => ({
//           type: 'TEXT',
//           text: question,
//         })),
//       },
//     });

//     return data.formUrl;
//   } catch (error) {
//     throw error;
//   }
// }

// async function sendEmails(userEmail, userPassword, emails, formUrl) {
//     try {
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: userEmail,
//           pass: userPassword,
//         },
//       });
  
//       for (const email of emails) {
//         await transporter.sendMail({
//           from: userEmail,
//           to: email,
//           subject: 'Assessment Form',
//           text: `Please fill out the assessment form: ${formUrl}`,
//         });
//         console.log(`Email sent to ${email}`);
//       }
//     } catch (error) {
//       console.error('Error sending emails:', error);
//       throw error; // Rethrow the error to propagate it to the caller
//     }
//   }

// function getGoogleAuth(req) {
//   // You can use the user's access token from req.user.accessToken
//   const accessToken = req.user.accessToken;

//   const oauth2Client = new google.auth.OAuth2();
//   oauth2Client.setCredentials({
//     access_token: accessToken,
//   });

//   return oauth2Client;
// }

// function extractSheetId(sheetUrl) {
//   const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
//   const match = sheetUrl.match(regex);
//   if (match && match[1]) {
//     return match[1];
//   } else {
//     throw new Error('Invalid Google Sheets URL');
//   }
// }





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

async function triggerScript(infoUrl, questUrl) {
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbwLSdYhIXRhcDXSbfmxnW-Tr1pr5Xdp4wMFlQroW7KHvmp2FvmqXHPZKXK1xtMhPxII/exec'; // Replace with your Google Apps Script URL
      const response = await axios.get(scriptUrl, {
        params: {
          infoUrl: infoUrl,
          questUrl: questUrl
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
  
      // Send the URLs to the Google Apps Script function
      await triggerScript(infoUrl, questUrl);
  
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

// Serve the server.js file with the correct MIME type
app.get('/server.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'server.js'));
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
