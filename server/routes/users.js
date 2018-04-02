const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlQuestions = require('../controllers/questions');

module.exports = function(passport) {
    router.post('/users/new', ctrlUsers.createUser);
    router.get('/users/:email/:username', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName);

    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.post('/users/:username', ctrlAuth.loginUser);
    router.post('/logout', ctrlAuth.logoutUser);

    router.get('/users/:username', ctrlAuth.isAuth, ctrlAuth.getUserProfile);
    router.get('/saved-favorites/:username', ctrlAuth.isAuth, ctrlUsers.savedPosts, ctrlQuestions.questionsGetFavorites);
    router.post('/save', ctrlAuth.isAuth, ctrlUsers.savePost);
    router.post('/unsave', ctrlAuth.isAuth, ctrlUsers.removePost);
    router.post('/like', ctrlAuth.isAuth, ctrlUsers.likePost);
    router.post('/unlike', ctrlAuth.isAuth, ctrlUsers.unlikePost);
    router.post('/save-helpful-comment', ctrlAuth.isAuth, ctrlUsers.saveHelpfulComment);
    router.get('/question-helpful-comments/:username/:postid', ctrlAuth.isAuth, ctrlUsers.questionHelpfulComments);
    router.get('/saved-helpful-comments/:username/', ctrlAuth.isAuth, ctrlUsers.savedHelpfulComments, ctrlQuestions.questionsGetCommentsById);
    router.get('/liked-posts/:username/', ctrlAuth.isAuth, ctrlUsers.likedPosts, ctrlQuestions.questionsGetLikedOrUnliked);
    router.get('/unliked-posts/:username/', ctrlAuth.isAuth, ctrlUsers.unlikedPosts, ctrlQuestions.questionsGetLikedOrUnliked);

    return router;
}
