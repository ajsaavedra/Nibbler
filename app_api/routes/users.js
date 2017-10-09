const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

module.exports = function(passport) {
    router.post('/users/new', ctrlUsers.createUser);
    router.get('/users/:email/:username', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName);

    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.post('/users/:username', ctrlAuth.authenticateUser, ctrlAuth.loginUser);
    router.get('/users/:username', ctrlAuth.isLoggedIn, ctrlAuth.getUserProfile);

    return router;
}
