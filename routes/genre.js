
const express = require('express');
const router = express.Router();
const { Genre, validateInput } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/',asyncMiddleware((req, res) => {
    // throw new Error('A random error object');
    Genre
        .find((err, result) => {
            if(err) return res.status(500).send(new Error('Error reading the database..'));
            return res.send(result);
        });
}));
router.get('/:id',validateObjectId, asyncMiddleware((req, res) => {
    // throw new Error('A random error object');
    Genre
        .findById(req.params.id, (err, result) => {
            if(err) return res.status(500).send('Something went wrong');
            if(!result) return res.status(404).send('Genre with the given ID was not found.');
            return res.send(result);
        });
}));

router.post('/', auth, asyncMiddleware((req, res) => {

    const { error } = validateInput(req.body);
    if(error) return res.status(400).send(error);
    const genreObject = { name: req.body.name };

    const genre = new Genre({
        name: req.body.name
    });

    genre.save((error, result) => {
        if(error) { console.error('error ', error); res.status(500).send('Record not saved to the database..')}
        console.log('From the post request route handler...result: ', result);
        res.status(200).send(result);
    });

}));

router.put('/:id', asyncMiddleware((req, res) => {
    const { error } = validateInput(req.body);
    if(error) return res.status(404).send(error);
    // const genreObject = genres.find(c => c.id === parseInt(req.params.id));

    Genre
        .findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                name: req.body.name
            },
        }, { new: true }, (error, result) => {
            if(error || result === null)
                return res.status(404).send('Not found..');
            return res.send(result);
        });

    // if(genreObject) {
    //     genreObject.name = req.body.name;
    //     return res.send(genreObject);
    // }
    // return res.send(400).send('Resource Not found.');

}));

router.delete('/:id', [auth, admin], asyncMiddleware((req, res) => {

    // const genreObject = genres.find(c => c.id === parseInt(req.params.id));
    // if(genreObject)
    //     return res.status(200).send(genres.splice(genres.indexOf(genreObject), 1));
    // return res.status(404).send('Resource not found.');
    Genre
        .findByIdAndRemove({ _id: req.params.id }, (error, result) => {
            if(error || result === null) return res.status(404).send('Not found..');
            return res.send(result);
        })
}));

module.exports = router;