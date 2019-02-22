const express = require('express');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const objectId = require('joi-objectid')(Joi);
const Fawn = require('fawn');
Fawn.init(mongoose);

router.get('/', (req, res) => {
    // return res.send('Welcome to movie rental.');
    Rental
        .find((error, result) => {
            if(error) return res.status(500).send(error)
            res.send(result);
        })
        .sort('-dateOut')
});

router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    Customer
        .findById(req.body.customerId, (error, customer) => {
            if(error || customer === null) return res.status(404).send('Invalid customer')
            Movie
                .findById(req.body.movieId, (error, movie) => {
                    if(error || movie === null) return res.status(404).send('Invalid Movie')
                    if(movie.numberInStock === 0) return res.status(400).send('Movie unavailable')
                    const rental = new Rental({
                        customer: {
                            _id: customer._id,
                            name: customer.name,
                            isGold: customer.isGold,
                            phone: customer.phone
                        },
                        movie: {
                            _id: movie._id,
                            title: movie.title,
                            dailyRentalRate: movie.dailyRentalRate
                        }
                    });

                    try {

                        new Fawn.Task()
                        .save('rentals', rental)
                        .update('movies', { _id: movie._id }, {
                            $inc: { numberInStock: -1 }
                        })
                        .run();

                        res.send(rental);

                    } catch (Ex) {
                        return res.status(500).send('Something went wrong');
                    }
                })
        })
});


function validate(movie) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(movie, schema);
}
module.exports = router;
