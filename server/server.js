require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');




const app = express();

// Connecting Database
connectDB();

// Enabling CORS for local development
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(cookieParser());


// Initializing Middlewares
app.use(express.json({ extended: false }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Defining Routes
app.get('/', (req, res) => res.send('Trello API Running'));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
