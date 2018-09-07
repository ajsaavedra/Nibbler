const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlQuestions = require('../controllers/questions');

require('../services/passport');
const passport = require('passport');

const requireLogin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

router.post('/users/new', ctrlUsers.createUser);
router.get('/users/:email/:username', ctrlUsers.findUserByEmail, ctrlUsers.findUserByName, ctrlUsers.lookupUserByNameResponse);

const ctrlAuth = require('../controllers/authentication.js');

router.post('/login', requireLogin, ctrlAuth.loginUser);

router.get('/users/:username', requireAuth, ctrlAuth.getUserProfile);
router.get('/saved-favorites', requireAuth, ctrlUsers.savedPosts, ctrlQuestions.questionsGetFavorites);
router.post('/save', requireAuth, ctrlUsers.savePost);
router.post('/unsave', requireAuth, ctrlUsers.removePost);
router.post('/like', requireAuth, ctrlUsers.likePost);
router.post('/unlike', requireAuth, ctrlUsers.unlikePost);
router.post('/save-helpful-comment', requireAuth, ctrlUsers.saveHelpfulComment);
router.get('/question-helpful-comments/:postid', requireAuth, ctrlUsers.questionHelpfulComments);
router.get('/saved-helpful-comments/', requireAuth, ctrlUsers.savedHelpfulComments, ctrlQuestions.questionsGetCommentsById);
router.get('/liked-posts/', requireAuth, ctrlUsers.likedPosts, ctrlQuestions.questionsGetLikedOrUnliked);
router.get('/unliked-posts/', requireAuth, ctrlUsers.unlikedPosts, ctrlQuestions.questionsGetLikedOrUnliked);

module.exports = router;
