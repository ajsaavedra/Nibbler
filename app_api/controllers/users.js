const mongoose = require('mongoose');
const User = mongoose.model('User');
const sendJsonResponse = require('../../config/tools').sendJsonResponse;

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
    user.save(function(err, userSaved) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else if (userSaved) {
            sendJsonResponse(res, 200, null);
        }
    });
};

module.exports.savedPosts = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, {
                    'posts': user.savedPosts
                })
            }
        });
};

const savePostObject = function(req, res, user) {
    const id = req.body.post_id;
    if (!user.savedPosts) {
        user.savedPosts = {};
    }
    if (!user.savedPosts[id]) {
        user.savedPosts[id] =
            'http://localhost:3000/api/questions/' + id;
        user.markModified('savedPosts');
        saveUser(user, res);
    }
};

const removePostObject = function(req, res, user) {
    const id = req.body.post_id;
    if (user.savedPosts && user.savedPosts[id]) {
        delete user.savedPosts[id];
        user.markModified('savedPosts');
        saveUser(user, res);
    }
};

const saveLikedPost = function(req, res, user) {
    if (!user.likedPosts) {
        user.likedPosts = {};
    }
    const id = req.body.post_id;
    if (!user.likedPosts[id]) {
        if (user.unlikedPosts && user.unlikedPosts[id]) {
            delete user.unlikedPosts[id];
        }
        user.likedPosts[id] =
            'http://localhost:3000/api/questions/' + id;
    } else {
        delete user.likedPosts[id];
    }
    user.markModified('likedPosts');
    user.markModified('unlikedPosts');
    saveUser(user, res);
};

const removeLikedPost = function(req, res, user) {
    if (!user.unlikedPosts) {
        user.unlikedPosts = {};
    }
    const id = req.body.post_id;
    if (!user.unlikedPosts[id]) {
        if (user.likedPosts && user.likedPosts[id]) {
            delete user.likedPosts[id];
        }
        user.unlikedPosts[id] =
            'http://localhost:3000/api/questions' + id;
    } else {
        delete user.unlikedPosts[id];
    }
    user.markModified('unlikedPosts');
    user.markModified('likedPosts');
    saveUser(user, res);
};

const saveHelpfulCommentToUser = function(req, res, user) {
    if (!user.helpfulComments) {
        user.helpfulComments = {};
    }
    const id = req.body.post_id;
    if (!user.helpfulComments[id]) {
        user.helpfulComments[id] = [];
    }

    const isHelpful = req.body.isHelpful;
    if (user.helpfulComments[id].length > 0 &&
        user.helpfulComments[id].includes(req.body.reply_id) &&
        !isHelpful) {
        user.helpfulComments[id] = user.helpfulComments[id].filter(comment => {
            return !comment === req.body.reply_id;
        });
        if (user.helpfulComments[id].length === 0) {
            delete user.helpfulComments[id];
        }
    } else {
        user.helpfulComments[id].push(req.body.reply_id);
    }

    user.markModified('helpfulComments');
    saveUser(user, res);
};

module.exports.savePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (user) {
                savePostObject(req, res, user);
            }
        });
};

module.exports.removePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (user) {
                removePostObject(req, res, user);
            }
        });
};

module.exports.likePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (user) {
                saveLikedPost(req, res, user);
            }
        });
};

module.exports.unlikePost = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (user) {
                removeLikedPost(req, res, user);
            }
        });
};

module.exports.saveHelpfulComment = function(req, res) {
    User
        .findOne({ 'profile.username': req.body.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (user) {
                saveHelpfulCommentToUser(req, res, user);
            }
        });
};

module.exports.likedPosts = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, {
                    'posts': user.likedPosts
                })
            }
        });
};

module.exports.unlikedPosts = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, {
                    'posts': user.unlikedPosts
                })
            }
        });
};

module.exports.questionHelpfulComments = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                let items = {};
                if (user.helpfulComments && user.helpfulComments[req.params.postid]) {
                    items[req.params.postid] = user.helpfulComments[req.params.postid];
                }
                sendJsonResponse(res, 200, {
                    'comments': items
                })
            }
        });
}

module.exports.savedHelpfulComments = function(req, res) {
    User
        .findOne({ 'profile.username': req.params.username })
        .exec(function(err, user) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                let items = {};
                if (user.helpfulComments) {
                    items = user.helpfulComments;
                }
                sendJsonResponse(res, 200, {
                    'comments': items
                })
            }
        });
};
