const express = require('express');
const session = require('express-session');


const passport = require('./config/passport'); // Import your passport configuration
const wss = require('./controllers/websocketController'); // Import WebSocket controller


const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;

// Event listeners for successful connection and errors
db.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });


// Routes
app.use('/', authRoutes);

// Create a new HTTP server with Express app
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${server.address().port}`);
});

// Attach WebSocket server to the HTTP server
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
