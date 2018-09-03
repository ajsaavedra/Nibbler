const express = require('express');
const router = express.Router();
const ctrlQuestions = require('../controllers/questions');
const ctrlUsers = require('../controllers/users');
const ctrlComments = require('../controllers/comments');

require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/questions/:limit/:offset', ctrlQuestions.questionsGetAll);
router.get('/questions-by-author/:username', ctrlUsers.findUserByName, ctrlQuestions.questionsGetByAuthor);
router.get('/questions-by-popularity', ctrlQuestions.questionsListByPopularity);
router.get('/questions-resolved', ctrlQuestions.questionsListResolved);
router.post('/questions', requireAuth, ctrlQuestions.questionsCreate);
router.get('/questions/:questionid', ctrlQuestions.questionsReadOne);
router.put('/questions/:questionid', requireAuth, ctrlQuestions.questionsUpdateOne);
router.put('/questions-update-vote', ctrlQuestions.questionsUpdateVotes, ctrlUsers.updateAuthorKarma);
router.delete('/questions/:questionid', requireAuth, ctrlQuestions.questionsDeleteOne);

router.post('/questions/:questionid', requireAuth, ctrlComments.questionCommentsCreate);
router.put('/questions-comment/:questionid/:commentid', requireAuth, ctrlComments.commentsUpdateOne);
router.put('/questions-update-comment-votes', requireAuth, ctrlComments.updateCommentVotes);
router.delete('/questions-comment/:questionid/:commentid', requireAuth, ctrlComments.commentsDeleteOne);

module.exports = router;
