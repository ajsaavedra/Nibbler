const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

const sendJsonResponse = function(res, status, content) {
    res.status(status).json(content);
};

const createUser = function (req, res) {
    User
    .create({
        name: {
            first: req.body.firstname,
            last: req.body.lastname
        },
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, user);
        }
    });
}

module.exports.registerUser = function(req, res) {
    User
    .findOne({ email: req.body.email })
    .exec(function(err, existingUser) {
        if (existingUser) {
            sendJsonResponse(res, 404, {
                "message": "Existing user"
            });
            return;
        } else {
            createUser(req, res);
        }
    });
};

module.exports.getUserProfile = function(req, res) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            sendJsonResponse(res, 500, info);
        } else if (!user) {
            sendJsonResponse(res, 404, { 'Error': 'No user found.' });
        } else if (!user.validPassword(req.body.password)) {
            sendJsonResponse(res, 403, { 'Error': 'Unauthorized password.' });
        } else {
            req.logIn(user, function(err) {
                if (err) sendJsonResponse(res, 400, { 'Error' : 'Something went wrong '});
                sendJsonResponse(res, 200, null);
            });
        }
    })(req.params.username, req.body.password);
};
