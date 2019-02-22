const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// router.get('/', (req, res) => {
//     User
//         .findOne((error, result) => {
//             return res.send(_.pick(result, ['name', 'email']));
//         });
// })

router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send('Invalid email or pasword');
    User
        .findOne({ email: req.body.email}, (error, user) => {
            if(error || user === null) return res.status(400).send('Invalid Email or password');
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if(error) return res.status(500).send(error);
                if(result) {
                    const token = user.generateAuthToken();
                    return res.send(token);
                }
                return res.status(400).send('Invalid email or password.');
            });
        })
});

function validate(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}
module.exports = router;
