const sendJsonResponse = require('../../config/tools').sendJsonResponse;

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

    return {
        authenticateUser: authenticateUser,
        loginUser: loginUser
    }
};
