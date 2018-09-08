const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dietSchema = require('./diets');
const options = require('./schemaOptions');

const openingTimeSchema = new Schema({
    day: { type: String, required: true },
    opening: String,
    closing: String
}, options);

const reviewSchema = new Schema({
    author: String,
    title: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewText: { type: String, required: true },
    createdOn: { type: Date, 'default': new Date() },
    options: dietSchema
}, options);

const locationSchema = new Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, 'default': 0, min: 0, max: 5 },
    options: {
        gluten_free: { type: Number, default: 0 },
        vegan: { type: Number, default: 0 },
        vegetarian: { type: Number, default: 0 },
        soy_free: { type: Number, default: 0 },
        nut_free: { type: Number, default: 0 }
    },
    coords: { type: [Number], index: '2dsphere', required: true },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema],
    closed: { type: Boolean, default: false }
}, options);

module.exports = mongoose.model('Location', locationSchema);
