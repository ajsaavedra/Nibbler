const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const app = express();
const ejs = require('ejs');
const ejs_mate = require('ejs-mate');
const locationModel = require('./app_api/models/locations');
const userModel = require('./app_api/models/user');
const config = require('./config/secret');
const passportConfig = require('./config/passport')(passport);
const mainRoutes = require('./app_server/routes/main');
const userRoutes = require('./app_api/routes/users');
const locationRoutes = require('./app_api/routes/locations');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/client'));
app.engine('ejs', ejs_mate);
app.set('views', __dirname + '/app_server/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mainRoutes);
app.use('/api', [userRoutes, locationRoutes]);

mongoose.connect(config.database, function(err) {
    if (err) console.log(err);
    console.log("Connected to the database...");
});

app.use(session({ secret: config.secretKey }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(config.port, function(err) {
    if (err) throw err;
    console.log("Server is running on port " + config.port);
});
