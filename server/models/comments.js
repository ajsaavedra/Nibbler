const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = require('./schemaOptions');

const commentSchema = new Schema({
    discussion_id: { type: String },
    author: { type: String },
    replyText: { type: String, required: true },
    votes: { type: Number, 'default': 1 },
    createdOn: { type: Date, 'default': new Date() },
    replies: []
}, options);

module.exports = commentSchema;
