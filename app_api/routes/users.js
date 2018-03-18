const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

module.exports = function(passport) {
    router.post('/users/new', ctrlUsers.createUser);
    router.get('/users/:email/:username', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName);

    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.post('/users/:username', ctrlAuth.authenticateUser, ctrlAuth.loginUser);
    router.get('/users/:username', ctrlAuth.isLoggedIn, ctrlAuth.getUserProfile);

    router.get('/saved-favorites/:username', ctrlUsers.savedPosts);
    router.post('/save', ctrlUsers.savePost);
    router.post('/unsave', ctrlUsers.removePost);
    router.post('/like', ctrlUsers.likePost);
    router.post('/unlike', ctrlUsers.unlikePost);
    router.post('/save-helpful-comment', ctrlUsers.saveHelpfulComment);
    router.get('/question-helpful-comments/:username/:postid', ctrlUsers.questionHelpfulComments);
    router.get('/saved-helpful-comments/:username/', ctrlUsers.savedHelpfulComments);
    router.get('/liked-posts/:username/', ctrlUsers.likedPosts);
    router.get('/unliked-posts/:username/', ctrlUsers.unlikedPosts);

    return router;
}
