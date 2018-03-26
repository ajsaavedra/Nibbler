const mongoose = require('mongoose');
const questionModel = require('../models/questions');
const Question = mongoose.model('Question', questionModel);

const sendJsonResponse = require('../../config/tools').sendJsonResponse;

module.exports.questionsGetAll = function(req, res) {
    Question
        .find({ resolved: { $ne: true } })
        .sort({ 'createdOn': -1 })
        .exec(function(err, questions) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, questions);
            }
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

module.exports.questionsListByPopularity = function(req, res) {
    Question
        .find({ votes: { $gt: 350 } })
        .sort('-votes')
        .exec(function(err, questions) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, questions);
            }
        });
};

module.exports.questionsListResolved = function(req, res) {
    Question
        .find({ resolved: true })
        .sort('-votes')
        .exec(function(err, questions) {
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                sendJsonResponse(res, 200, questions);
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

module.exports.questionsGetFavorites = function(req, res, next) {
    Question
        .find({ _id: {
            $in: Object.keys(req.favorites)
        }}, function(err, docs) {
            if (err) {
                sendJsonResponse(res, 500, err);
            } else {
                sendJsonResponse(res, 200, docs);
            }
        });
};

module.exports.questionsGetLikedOrUnliked = function(req, res) {
    Question
        .find({ _id: {
            $in: Object.keys(req.posts)
        }}, function(err, docs) {
            if (err) {
                sendJsonResponse(res, 500, err);
            } else {
                let items = {};
                docs.forEach(doc => {
                    items[doc._id] = doc
                });
                sendJsonResponse(res, 200, {
                    'posts': items
                });
            }
        });
};

module.exports.questionsGetCommentsById = function(req, res) {
    Question
        .find({ _id: {
            $in: Object.keys(req.comments)
        }}, function(err, docs) {
            if (err) {
                sendJsonResponse(res, 500, err);
            } else {
                let items = {};
                docs.forEach(doc => {
                    req.comments[doc._id].forEach(reply => {
                        items[doc.title] = doc.replies.filter(item => item._id.equals(reply))[0];
                    });
                });
                sendJsonResponse(res, 200, items);
            }
        });
};

module.exports.questionsUpdateVotes = function(req, res) {
    Question
        .findById(req.body.id)
        .exec(function(err, question) {
            if (err || !question) {
                sendJsonResponse(res, 400, err);
            } else {
                question.votes += req.body.vote;
                question.save(function(err, savedQuestion) {
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        sendJsonResponse(res, 204, null);
                    }
                });
            }
        });
};

module.exports.questionsUpdateOne = function(req, res) {

};

module.exports.questionsDeleteOne = function(req, res) {

};
