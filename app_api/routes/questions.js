const express = require('express');
const router = express.Router();
const ctrlQuestions = require('../controllers/questions');
const ctrlComments = require('../controllers/comments.js');

router.get('/questions', ctrlQuestions.questionsGetAll);
router.get('/questions-by-dist', ctrlQuestions.questionsListByDistance);
router.post('/questions', ctrlQuestions.questionsCreate);
router.get('/questions/:questionid', ctrlQuestions.questionsReadOne);
router.put('/questions/:questionid', ctrlQuestions.questionsUpdateOne);
router.delete('/questions/:questionid', ctrlQuestions.questionsDeleteOne);

router.post('/questions/:questionid', ctrlComments.questionCommentsCreate);
router.post('/comments/:commentid', ctrlComments.commentsCreate);
router.get('/comments/:commentid', ctrlComments.commentsReadOne);
router.put('/comments/:commentid', ctrlComments.commentsUpdateOne);
router.delete('/comments/:commentid', ctrlComments.commentsDeleteOne);

module.exports = router;
