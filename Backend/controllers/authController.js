const passport = require('passport');

const loginSuccess = (req, res) => {
  res.redirect('/quotes'); // Redirect to the quotes endpoint after successful login
};

const loginFailure = (req, res) => {
  res.status(401).json({ error: 'Authentication failed.' });
};

module.exports = {
  loginSuccess,
  loginFailure,
};
