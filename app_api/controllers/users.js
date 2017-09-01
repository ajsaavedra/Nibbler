const mongoose = require('mongoose');
const User = mongoose.model('User');
const sendJsonResponse = require('../../config/tools').sendJsonResponse;

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
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Existing user'
                });
            } else {
                createUser(req, res);
            }
        });
};
