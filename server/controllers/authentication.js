const sendJsonResponse = require('../../config/tools').sendJsonResponse;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(passport) {
    const loginUser = function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                sendJsonResponse(res, 500, info);
            } else if (!user) {
                sendJsonResponse(res, info.message, null);
            } else {
                req.login(user, function(err) {
                    if (err) sendJsonResponse(res, 400, {'Error': 'Something went wrong'});
                    sendJsonResponse(res, 200, {message: 'success'});
                });
            }
        })(req, res, next);
    };

    const isAuth = function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        console.log('Bad credentials');
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
        isAuth,
        loginUser,
        logoutUser,
        getUserProfile
    }
};
