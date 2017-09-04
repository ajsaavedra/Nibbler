const mongoose = require('mongoose');
const User = mongoose.model('User');
const sendJsonResponse = require('../../config/tools').sendJsonResponse;

module.exports.createUser = function (req, res) {
    User
        .create({
            name: {
                first: req.body.firstname,
                last: req.body.lastname
            },
            profile: {
                username: req.body.username
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

module.exports.findUserByEmail = function(req, res, next) {
    User
        .findOne({ email: req.body.email })
        .exec(function(err, existingUser) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Oops. A user with this email already exists. Please login to continue.'
                });
            } else {
                next();
            }
        });
};

module.exports.findUserByName = function(req, res, next) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, existingUser) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Oops. A user with this username already exists. Please login to continue.'
                });
            } else {
                next();
            }
        });
};
