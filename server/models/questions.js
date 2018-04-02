const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./comments');
const options = require('./schemaOptions');

const questionSchema = new Schema({
    author: String,
    title: { type: String, required: true },
    questionText: { type: String, required: true },
    votes: { type: Number, 'default': 1 },
    replies: [commentSchema],
    tags: [],
    resolved: { type: Boolean, 'default': false },
    createdOn: { type: Date, 'default': new Date() }
}, options);

module.exports = questionSchema;
