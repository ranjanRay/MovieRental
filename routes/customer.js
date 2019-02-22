var express = require('express');
var Joi = require('joi');
const router = express.Router();
const { Customer, validateCustomer } = require('../models/customer');

router.get('/', (req, res) => {
    // res.send('Welcome customer.');
    Customer
        .find((error, result) => {
            if(error) return res.status(404).end('Resource Not found.');
            return res.status(200).send(result);
        })
});

router.get('/:id', (req, res) => {
    Customer
        .find({ _id: req.params.id }, (error, result) => {
            if(error) return res.status(404).send('Resource Not found.');
            // console.log('Result: ', result);
            return res.status(200).send(result);
        })
});

router.post('/', (req, res) => {

    const { error } = validateCustomer(req.params);
    if(error) return res.status(404).send(error);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    customer.save((error, result) => {
        if(error) return res.status(500).send('Error saving to the database.');
        return res.send(result);
    });
});

router.put('/:id', (req, res) => {

    const { error } = validateCustomer(req.params);
    if(error) return res.status(400).send(error);

    Customer
        .findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name
            }
        }, { new: true }, (error, result) => {
            if(error) return res.status(500).send('Error updating the database.');
            return res.send(result);
        });
});

router.delete('/:id', (req, res) => {
    Customer
        .findByIdAndRemove(req.params.id, (error, result) => {
            if(error || result === null) return res.status(404).send('Resource not found');
            return res.send(result);
        });
});

module.exports = router;