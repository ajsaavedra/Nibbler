const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const app = express();
const ejs = require('ejs');
const path = require('path');
const ejsMate = require('ejs-mate');
const locationModel = require('./app_api/models/locations');
const userModel = require('./app_api/models/user');
const config = require('./config/secret');

require('./config/passport')(passport);

// Middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/client')));
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'ejs');
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

const mainRoutes = require('./app_server/routes/main');
const userRoutes = require('./app_api/routes/users')(passport);
const locationRoutes = require('./app_api/routes/locations');

app.use(mainRoutes);
app.use('/api', [userRoutes, locationRoutes]);

mongoose.connect(config.database, function(err) {
    if (err) console.log(err);
    console.log('Connected to the database...');
});

app.listen(config.port, function(err) {
    if (err) throw err;
    console.log('Server is running on port ' + config.port);
});
