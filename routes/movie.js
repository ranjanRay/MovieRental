const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', (req, res) => {
    // res.send('Welcome to Movies home!');
    Movie
        .find((error, result) => {
            if(error) return res.status(500).send(error);
        return res.status(200).send(result);
        })
});

router.post('/', (req, res) => {

    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send('Bad request');
    const genreId = req.body.genreId;
    Genre
        .findById(genreId, (error, result) => {
            if(error || result === null) return res.status(404).send(error || result);
            const genreName = result.name;
            const movie = new Movie({
                title: req.body.title,
                genre: new Genre({
                    _id: result._id,
                    name: genreName
                }),
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            });
            movie.save((error, result) => {
                if(error) return res.status(500).send('Error saving to the database.')
                return res.status(200).send(result);
            });
        });
});

router.put('/:id', (req, res) => {

    Movie
        .findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }
        }, { new: true }, (error, result) => {
            if(error) return res.status(500).send(error);
            return res.status(200).send(result);
        });
});

router.delete('/:id', (req, res) => {

    Movie
        .findByIdAndRemove(req.params.id, (error, result) => {
            if(error) return res.status(500).send(error);
            return res.status(200).send(result);
        });

});

module.exports = router;
