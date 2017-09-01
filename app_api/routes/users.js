const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

module.exports = function(passport) {
    router.post('/users/new', ctrlUsers.registerUser);

    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.post('/users/:username', ctrlAuth.authenticateUser, ctrlAuth.loginUser);

    return router;
}
