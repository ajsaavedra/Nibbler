const mongoose = require('mongoose');
const questionModel = require('../models/questions');
const Question = mongoose.model('Question', questionModel);

const sendJsonResponse = require('../../config/tools').sendJsonResponse;

module.exports.questionsGetAll = function(req, res) {
    Question.find({}, function(err, questions) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        sendJsonResponse(res, 200, questions);
    });
};

module.exports.questionsListByDistance = function(req, res) {

};

module.exports.questionsCreate = function(req, res) {
    Question.create({
        author: req.body.user,
        title: req.body.title,
        questionText: req.body.question,
        answers: [],
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
    }, function(err, question) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, question);
        }
    });
};

module.exports.questionsReadOne = function(req, res) {
    Question
        .findById(req.params.questionid)
        .exec(function(err, question) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else if (!question) {
                sendJsonResponse(res, 404, {
                    'message': 'Question not found'
                });
            } else {
                sendJsonResponse(res, 200, question);
            }
        });
};

module.exports.questionsUpdateOne = function(req, res) {

};

module.exports.questionsDeleteOne = function(req, res) {

};