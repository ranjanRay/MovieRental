const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('user', userSchema);

function validateUser(user) {

    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(255).required(),
    }

    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
