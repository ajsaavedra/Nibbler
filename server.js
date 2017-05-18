const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const ejs_mate = require('ejs-mate');
const config = require('./config/secret');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/userAPI');

// Middleware
app.use(express.static(__dirname + '/public'));
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mainRoutes);
app.use(userRoutes);

mongoose.connect(config.database, function(err) {
    if (err) console.log(err);
    console.log("Connected to the database...");
});

app.listen(config.port, function(err) {
    if (err) throw err;
    console.log("Server is running on port " + config.port);
})