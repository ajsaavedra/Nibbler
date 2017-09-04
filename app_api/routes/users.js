const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

module.exports = function(passport) {
    router.post('/users/new', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName, ctrlUsers.createUser);

    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.post('/users/:username', ctrlAuth.authenticateUser, ctrlAuth.loginUser);
    router.get('/users/:username', ctrlAuth.isLoggedIn, ctrlAuth.getUserProfile);

    return router;
}
