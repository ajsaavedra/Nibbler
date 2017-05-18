const router = require('express').Router();
const User = require('../models/user');

router.get('/login', function(req, res, next) {
    res.render('accounts/login');
});

router.route('/signup')
    .get(function(req, res, next) {
        res.render('accounts/signup');
    })
    .post(function(req, res, next) {
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
    });

module.exports = router;