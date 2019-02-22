const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    }
});

const Genre = mongoose.model('genre', genreSchema);

function validateInput(input) {
    const schema = {
        name: Joi.string().min(3).max(50).required()
    };

    return Joi.validate(input, schema);
}

module.exports.Genre = Genre;
module.exports.validateInput = validateInput;
module.exports.genreSchema = genreSchema;