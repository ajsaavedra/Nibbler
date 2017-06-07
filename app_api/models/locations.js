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
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewText: String,
    createdOn: { type: Date, "default": Date.now }
});

const locationSchema = new Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, "default": 0, min: 0, max: 5 },
    options: dietSchema,
    coords: { type: [Number], index: '2dsphere', required: true },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;