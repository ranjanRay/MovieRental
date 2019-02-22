const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
        minlength: 5,
        maxlength: 50
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50)
    };
    return Joi.validate(customer, schema);
}


module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer
