const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config()

// Routes
const stuffRoute = require('./routes/stuffRoute');
const userRoute = require('./routes/userRoute');


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.m6su8ue.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });
// CORS for frontend to interact from this origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Access data from post endpoints..
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/stuff', stuffRoute);
app.use('/api/auth', userRoute);

module.exports = app;