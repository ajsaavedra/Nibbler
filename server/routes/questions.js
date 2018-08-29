const express = require('express');
const router = express.Router();
const ctrlQuestions = require('../controllers/questions');
const ctrlUsers = require('../controllers/users');
const ctrlComments = require('../controllers/comments');

module.exports = function(passport) {
    const ctrlAuth = require('../controllers/authentication.js')(passport);

    router.get('/questions/:limit/:offset', ctrlQuestions.questionsGetAll);
    router.get('/questions-by-author/:author', ctrlQuestions.questionsGetByAuthor);
    router.get('/questions-by-popularity', ctrlQuestions.questionsListByPopularity);
    router.get('/questions-resolved', ctrlQuestions.questionsListResolved);
    router.post('/questions', ctrlAuth.isAuth, ctrlQuestions.questionsCreate);
    router.get('/questions/:questionid', ctrlQuestions.questionsReadOne);
    router.put('/questions/:questionid', ctrlAuth.isAuth, ctrlQuestions.questionsUpdateOne);
    router.put('/questions-update-vote', ctrlQuestions.questionsUpdateVotes, ctrlUsers.updateAuthorKarma);
    router.delete('/questions/:questionid', ctrlAuth.isAuth, ctrlQuestions.questionsDeleteOne);

    router.post('/questions/:questionid', ctrlAuth.isAuth, ctrlComments.questionCommentsCreate);
    router.post('/comments/:commentid', ctrlAuth.isAuth, ctrlComments.commentsCreate);
    router.get('/comments/:commentid', ctrlComments.commentsReadOne);
    router.put('/questions-comment/:questionid/:commentid', ctrlAuth.isAuth, ctrlComments.commentsUpdateOne);
    router.put('/questions-update-comment-votes', ctrlAuth.isAuth, ctrlComments.updateCommentVotes);
    router.delete('/questions-comment/:questionid/:commentid', ctrlAuth.isAuth, ctrlComments.commentsDeleteOne);

    return router;
}