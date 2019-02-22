const express = require('express');
const helmet = require('helmet');
const genres = require('../routes/genre');
const customers = require('../routes/customer');
const movies = require('../routes/movie');
const rental = require('../routes/rental');
const user = require('../routes/user');
const auth = require('../routes/auth');
const home = require('../routes/home');
const returns = require('../routes/return');
const error = require('../middleware/error');

module.exports = function(app) {

    app.use(express.json());// parses the req.body if the req contains json data.
    app.use(express.urlencoded({ extended: true })); // processes req.body if it contains url encoded data. (key=k1&value=v1 format)
    app.use(express.static('public'));// processes all the static assets from the public directory.
    // app.use(logger);

    // app.use(morgan('dev'));
    // console.log('The name of this app is '+ config.get('name'));
    // console.log('The mail server of this app is '+ config.get('mail.host'));
    // console.log('The password for mail server of this app is '+ config.get('mail.password'));
    // console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
    // console.log(`${app.get('env')}`);
    // app.use((req, res, next) => {
    //     console.log('Authenticating..');
    //     next();
    // });

    app.use(helmet());
    app.use('/api/genre', genres);
    app.use('/api/customer', customers);
    app.use('/api/movie', movies);
    app.use('/api/rental', rental);
    app.use('/api/user', user);
    app.use('/api/auth', auth);
    app.use('/api/return', returns);
    app.use('/', home);
    app.use(error);
}