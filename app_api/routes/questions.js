const express = require('express');
const router = express.Router();
const ctrlQuestions = require('../controllers/questions');
const ctrlComments = require('../controllers/comments.js');

router.get('/questions', ctrlQuestions.questionsGetAll);
router.get('/questions-by-dist', ctrlQuestions.questionsListByDistance);
router.get('/questions-by-author/:author', ctrlQuestions.questionsGetByAuthor);
router.get('/questions-by-popularity', ctrlQuestions.questionsListByPopularity);
router.get('/questions-resolved', ctrlQuestions.questionsListResolved);
router.post('/questions', ctrlQuestions.questionsCreate);
router.get('/questions/:questionid', ctrlQuestions.questionsReadOne);
router.put('/questions/:questionid', ctrlQuestions.questionsUpdateOne);
router.put('/questions-update-vote', ctrlQuestions.questionsUpdateVotes);
router.delete('/questions/:questionid', ctrlQuestions.questionsDeleteOne);

router.post('/questions/:questionid', ctrlComments.questionCommentsCreate);
router.post('/comments/:commentid', ctrlComments.commentsCreate);
router.get('/comments/:commentid', ctrlComments.commentsReadOne);
router.put('/questions-comment/:questionid/:commentid', ctrlComments.commentsUpdateOne);
router.put('/questions-update-comment-votes', ctrlComments.updateCommentVotes);
router.delete('/questions-comment/:questionid/:commentid', ctrlComments.commentsDeleteOne);

module.exports = router;
