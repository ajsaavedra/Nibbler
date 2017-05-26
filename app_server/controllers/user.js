const User = require('../../app_api/models/user');

module.exports.login = function(req, res) {
    res.render('main/accounts/login');
};

module.exports.signup = function(req, res) {
    res.render('main/accounts/signup');
};

module.exports.register = function(req, res, next) {
    var newUser = new User();
    newUser.name.first = req.body.firstname;
    newUser.name.last = req.body.lastname;
    newUser.password = req.body.password;
    newUser.email = req.body.email;

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.redirect('/signup');
        } else {
            newUser.save(function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        }
    });
};