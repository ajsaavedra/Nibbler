const sendJsonResponse = require('../../config/tools').sendJsonResponse;
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const config = require('../../config/secret');

const tokenForUser = (user) => {
    const timeStamp = new Date().getTime();
    return jwt.encode({ user, iat: timeStamp }, config.secretKey);
}

const loginUser = function(req, res) {
    res.send({ token: tokenForUser(req.user) });
};

const isAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    sendJsonResponse(res, 403, {
        'message': 'Unathenticated user. Please login.'
    });
};

const getUsername = function(req, res) {
    sendJsonResponse(res, 200, {'username': req.user.profile.username});
}

const getUserProfile = function(req, res) {
    User
        .findOne({
            'profile.username': req.params.username
        }, function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, {
                    'Error': 'Something went wrong with our lookup'
                });
            } else if (!user) {
                sendJsonResponse(res, 404, {
                    'Error': 'Looks like that user does not exist!'
                })
            } else {
                sendJsonResponse(res, 200, user);
            }
        });
};

module.exports = {
    isAuth,
    getUsername,
    loginUser,
    getUserProfile
};
