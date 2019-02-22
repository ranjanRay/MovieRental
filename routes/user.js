const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', (req, res) => {
    // console.log('Welcome to user route');
    // res.send('Welcome to user route..');
    User
        .find((error, result) => {
            console.log('Error : ', error);
            if(error || error === null || result === null) return res.status(400).send(error);
        return res.status(result);
        })
});

router.get('/me', auth, (req, res) => {

    User
        .findById({_id: req.user._id}, (error, user) => {
            if(error) return res.status(404).send('Not found')
            return res.send(user);
        })
        .select('-password')
        
});

router.post('/', (req, res) => {

    const { error } = validateUser(req.body);
    if(error) return res.status(404).send(error);
    let rounds = 10;
    bcrypt.genSalt(rounds, (error, salt) => {

        if(error) return res.status(500).send('Error generating salt.');
        // console.log(salt);
        bcrypt.hash(req.body.password, salt, (error, hash) => {
            if(error) return res.status(500).send('Error generating hash.');
            // console.log('hash: ', hash);
            req.body.password = hash;
            const user = new User(req.body, ['name', 'email', 'password']);

            user
                .save((error, result) => {
                    if(error) return res.status(500).send(error);
                    const token = user.generateAuthToken();
                    return res.header('x-auth-token', token).send(_.pick(result, ['_id', 'name', 'email']));
                })
        });
        
    });

});

module.exports = router;