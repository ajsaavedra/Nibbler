const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const config = require('../config/secret');
const cors = require('cors');
require('./models/locations');
require('./models/user');
require('../config/passport')(passport);

// Middleware
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secretKey
}));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client', 'dist')))
}

const userRoutes = require('./routes/users')(passport);
const locationRoutes = require('./routes/locations')(passport);
const questionRoutes = require('./routes/questions')(passport);

// CORS Middleware for testing purposes
app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://localhost:3100']}));

app.use('*', (req, res, next) => {
    res.removeHeader('content-security-policy');
    next();
});

app.use('/api', [userRoutes, locationRoutes, questionRoutes]);

mongoose.connect(config.database, function(err) {
    if (err) console.log(err);
    console.log('Connected to the database...');
});

app.listen(config.port, function(err) {
    if (err) throw err;
    console.log('Server is running on port ' + config.port);
});
