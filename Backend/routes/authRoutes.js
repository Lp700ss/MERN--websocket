const express = require('express');
const passport = require('../config/passport'); // Import passport instance
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { loginSuccess, loginFailure } = require('../controllers/authController');

// This route initiates the Google OAuth2 authentication process
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This route handles the Google OAuth2 callback
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), loginSuccess);

module.exports = router;
