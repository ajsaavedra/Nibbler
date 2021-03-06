const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = require('./schemaOptions');

const dietSchema = new Schema({
    gluten_free: { type: Boolean, "default": false },
    soy_free: { type: Boolean, "default": false },
    nut_free: { type: Boolean, "default": false },
    vegan: { type: Boolean, "default": false },
    vegetarian: { type: Boolean, "default": false }
}, options);

module.exports = dietSchema;
