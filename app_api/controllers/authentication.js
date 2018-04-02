const sendJsonResponse = require('../../config/tools').sendJsonResponse;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(passport) {
    const authenticateUser = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                sendJsonResponse(res, 500, info);
            } else if (!user) {
                sendJsonResponse(res, info.message, null);
            } else {
                res.locals.user = user;
                next();
            }
        })(req, res, next);
    };

    const loginUser = function(req, res) {
        req.logIn(res.locals.user, function(err) {
            if (err) sendJsonResponse(res, 400, { 'Error': 'Something went wrong' });
            sendJsonResponse(res, 200, null);
        });
    };

    const isLoggedIn = function(req, res, next) {
        if (req.params.username) {
            return next();
        }

        sendJsonResponse(res, 403, {
            'message': 'Unathenticated user. Please login.'
        });
    };

    const logoutUser = function(req, res) {
        if (!req.body.user) return sendJsonResponse(res, 400, {'message': 'Need username'});
        req.logout();
        return sendJsonResponse(res, 200, null);
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

    return {
        authenticateUser: authenticateUser,
        loginUser: loginUser,
        logoutUser: logoutUser,
        isLoggedIn: isLoggedIn,
        getUserProfile: getUserProfile
    }
};
