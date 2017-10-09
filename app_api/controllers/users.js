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
            password: req.body.password,
            coords: [req.body.longitude, req.body.latitude],
            diet: {
                gluten_free: req.body.gluten_free,
                soy_free: req.body.soy_free,
                nut_free: req.body.nut_free,
                vegan: req.body.vegan,
                vegetarian: req.body.vegetarian
            }
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
        .findOne({ email: req.params.email })
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
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, existingUser) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Oops. A user with this username already exists. Please login to continue.'
                });
            } else {
                sendJsonResponse(res, 200, {
                    'message': 'No user exists. Proceed to register'
                });
            }
        });
};
