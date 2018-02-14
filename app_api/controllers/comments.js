const mongoose = require('mongoose');
const questionModel = require('../models/questions');
const Question = mongoose.model('Question', questionModel);
const commentModel = require('../models/comments');
const Comment = mongoose.model('Comment', commentModel);
const sendJsonResponse = require('../../config/tools').sendJsonResponse;

const sendProperJsonResponse = function(req, res, err, post) {
    if (!post) {
        sendJsonResponse(res, 404, {
            'message': 'Could not found parent source.'
        });
    } else if (err) {
        sendJsonResponse(res, 400, err);
    } else {
        appendComment(req, res, post)
    }
};

const appendComment = function(req, res, post) {
    let id = req.params.questionid ? req.params.questionid : req.params.commentid;
    post.replies.push({
        discussion_id: id,
        author: req.body.username,
        reviewText: req.body.reviewText
    });
    post.save(function(err, obj) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            const reply = obj.replies[obj.replies.length - 1];
            sendJsonResponse(res, 201, reply);
        }
    });
};

module.exports.questionCommentsCreate = function(req, res) {
    const id = req.params.questionid;
    if (id) {
        Question
            .findById(id)
            .exec(function(err, question) {
                sendProperJsonResponse(req, res, err, question);
            });
    } else {
        sendJsonResponse(res, 400, {
            'message': 'Question ID missing. Could not append to question.'
        });
    }
};

module.exports.commentsCreate = function(req, res) {
    const id = req.params.commentid;
    if (id) {
        Comment
            .findById(id)
            .exec(function(err, comment) {
                sendProperJsonResponse(req, res, err, comment);
            });
    } else {
        sendJsonResponse(res, 400, {
            'message': 'Comment ID missing. Could not append to comment.'
        });
    }
};

module.exports.commentsReadOne = function(req, res) {

};

module.exports.commentsUpdateOne = function(req, res) {

};

module.exports.commentsDeleteOne = function(req, res) {

};