const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const dietSchema = require('./diets');

const userSchema = new Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        username: { type: String, required: true },
        picture: { type: String, 'default': '' }
    },
    diet: dietSchema,
    savedPosts: [],
    dob: { type: Date, required: false },
    coords: { type: [Number], index: '2dsphere' },
    created_at: Date,
    verified: { type: Boolean, default: false }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
