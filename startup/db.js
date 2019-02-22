const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    return mongoose
        .connect(config.get('db'))
        .then(connection => winston.info(`connected to ${config.get('db')}`))
}