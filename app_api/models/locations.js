const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dietSchema = require('./diets');

const openingTimeSchema = new Schema({
    days: { type: String, required: true },
    opening: String,
    closing: String,
    closed: { type: Boolean, required: true }
});

const reviewSchema = new Schema({
    author: String,
    title: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewText: { type: String, required: true },
    createdOn: { type: Date, 'default': new Date() }
});

const locationSchema = new Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, 'default': 0, min: 0, max: 5 },
    options: dietSchema,
    coords: { type: [Number], index: '2dsphere', required: true },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

module.exports = mongoose.model('Location', locationSchema);