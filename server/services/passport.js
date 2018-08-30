const passport = require('passport');
const User = require('../models/user');
const config = require('../../config/secret');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const localLogin = new LocalStrategy(function(username, password, done) {
    User.findOne({ 'profile.username': username }, function(err, foundUser) {
        if (err) { return done(err); }
        if (!foundUser) { return done(null, false); }
        foundUser.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }
            return done(null, foundUser);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secretKey
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload.user._id, function(err, user) {
        if (err) { return done(err, false); }
        (user) ? done(null, user) : done(null, false);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
