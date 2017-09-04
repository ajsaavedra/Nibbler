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
        if (req.isAuthenticated()) return next();

        sendJsonResponse(res, 403, {
            'message': 'Unathenticated user. Please login.'
        });
    };

    const logoutUser = function(req, res) {
        req.logout();
        sendJsonResponse(res, 200, null);
    };

    const getUserProfile = function(req, res) {
        User
            .findOne({
                'profile.username': req.params.username
            }, function(err, user) {
                if (err) {
                    sendJsonResponse(res, 400, null);
                } else {
                    sendJsonResponse(res, 200, user);
                }
            });
    };

    return {
        authenticateUser: authenticateUser,
        loginUser: loginUser,
        isLoggedIn: isLoggedIn,
        logoutUser: logoutUser,
        getUserProfile: getUserProfile
    }
};
