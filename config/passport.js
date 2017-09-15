const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(passport) {
    passport.use('local', new LocalStrategy(
        function(username, password, done) {
            User.findOne({ 'profile.username': username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: '404' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: '403' });
                }
                return done(null, user);
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
