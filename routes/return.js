const router = require('express').Router();
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const moment = require('moment');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const Joivalidate = require('../middleware/validate');

router.post('/', [auth, Joivalidate(validate)], async (req, res) => {

    // if(!req.body.customerId) return res.status(400).send('customer Id not provided');
    // if(!req.body.movieId) return res.status(400).send('movie Id not provided');
    // console.log('customerID in the request: ', req.body.customerId);
    // console.log('movieID in the request: ', req.body.movieId);
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('No rental found');
    if(rental.dateReturned) return res.status(400).send('Rental Processed.');

    rental.return();
    await rental.save();

    const result = await Movie.update({ _id: rental.movie.movieId }, {
            $inc: {
                numberInStock: 1
            }
    }, { new: true });
    
    console.log('numberInStock after update: ', result.numberInStock);
    return res.send(rental);
});

function validate(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}
module.exports = router;