const sendJsonResponse = require('../../config/tools').sendJsonResponse;
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const config = require('../../config/secret');

const tokenForUser = (userData) => {
    const timeStamp = new Date().getTime();
    const user = {
        _id: userData['_id'],
        name: userData['name'],
        coords: userData['coords'],
        profile: userData['profile']
    };
    return jwt.encode({ user, iat: timeStamp }, config.secretKey);
}

const loginUser = function(req, res) {
    res.send({ token: tokenForUser(req.user) });
};

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
    loginUser,
    getUserProfile
};
