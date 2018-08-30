const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlQuestions = require('../controllers/questions');

require('../services/passport');
const passport = require('passport');

const requireLogin = passport.authenticate('local', { session: false });

router.post('/users/new', ctrlUsers.createUser);
router.get('/users/:email/:username', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName);

const ctrlAuth = require('../controllers/authentication.js');

router.post('/login', requireLogin, ctrlAuth.loginUser);

router.get('/auth', ctrlAuth.isAuth, ctrlAuth.getUsername);
router.get('/users/:username', ctrlAuth.isAuth, ctrlAuth.getUserProfile);
router.get('/saved-favorites', ctrlAuth.isAuth, ctrlUsers.savedPosts, ctrlQuestions.questionsGetFavorites);
router.post('/save', ctrlAuth.isAuth, ctrlUsers.savePost);
router.post('/unsave', ctrlAuth.isAuth, ctrlUsers.removePost);
router.post('/like', ctrlAuth.isAuth, ctrlUsers.likePost);
router.post('/unlike', ctrlAuth.isAuth, ctrlUsers.unlikePost);
router.post('/save-helpful-comment', ctrlAuth.isAuth, ctrlUsers.saveHelpfulComment);
router.get('/question-helpful-comments/:postid', ctrlAuth.isAuth, ctrlUsers.questionHelpfulComments);
router.get('/saved-helpful-comments/', ctrlAuth.isAuth, ctrlUsers.savedHelpfulComments, ctrlQuestions.questionsGetCommentsById);
router.get('/liked-posts/', ctrlAuth.isAuth, ctrlUsers.likedPosts, ctrlQuestions.questionsGetLikedOrUnliked);
router.get('/unliked-posts/', ctrlAuth.isAuth, ctrlUsers.unlikedPosts, ctrlQuestions.questionsGetLikedOrUnliked);

module.exports = router;
