const mongoose = require('mongoose');
const User = mongoose.model('User');
const sendJsonResponse = require('../../config/tools').sendJsonResponse;
const questionSchema = require('../models/questions');
const Question = mongoose.model('Question', questionSchema);

module.exports.createUser = function (req, res) {
    User
        .create({
            name: {
                first: req.body.firstname,
                last: req.body.lastname
            },
            profile: {
                username: req.body.username
            },
            email: req.body.email,
            password: req.body.password,
            coords: [req.body.longitude, req.body.latitude],
            diet: {
                gluten_free: req.body.gluten_free,
                soy_free: req.body.soy_free,
                nut_free: req.body.nut_free,
                vegan: req.body.vegan,
                vegetarian: req.body.vegetarian
            }
        }, function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 201, user);
            }
        });
}

module.exports.findUserByEmail = function(req, res, next) {
    User
        .findOne({ email: req.params.email })
        .exec(function(err, existingUser) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Oops. A user with this email already exists. Please login to continue.'
                });
            } else {
                next();
            }
        });
};

module.exports.findUserByName = function(req, res, next) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, existingUser) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (existingUser) {
                sendJsonResponse(res, 401, {
                    'message': 'Oops. A user with this username already exists. Please login to continue.'
                });
            } else {
                sendJsonResponse(res, 200, {
                    'message': 'No user exists. Proceed to register'
                });
            }
        });
};

const saveUser = function(user, res) {
    user.save(function(err, user) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 200, null);
        }
    });
};

const findPost = function(req, res, user) {
    const posts = user.savedPosts.filter(post => {
        return post._id.toString() === req.params.postid
    });
    if (posts.length > 0) {
        sendJsonResponse(res, 200, null);
    } else {
        sendJsonResponse(res, 404, null);
    }
};

module.exports.savedPosts = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                findPost(req, res, user);
            }
        });
};

const savePostObject = function(req, res, user) {
    Question
        .findById(req.body.postid)
        .exec(function(err, post) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                user.savedPosts.push(post);
                saveUser(user, res);
            }
        })
};

const removePostObject = function(req, res, user) {
    Question
        .findById(req.body.postid)
        .exec(function(err, post) {
            if (err) {
                sendJsonResponse(res, 404, err);
            } else {
                user.savedPosts = user.savedPosts.filter(p => {
                    return p._id.toString() !== req.body.postid
                });
                saveUser(user, res);
            }
        });
};

module.exports.savePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                savePostObject(req, res, user);
            }
        });
}

module.exports.removePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                removePostObject(req, res, user);
            }
        })
}
