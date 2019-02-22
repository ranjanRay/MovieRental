const express = require('express');
// const logger = require('./middleware/logger');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/debugging')(app);
require('./startup/prod')(app);

var port = process.env.PORT || 3000;
const server = app.listen(port, () => { winston.info(`listening to port ${port}..`) });
module.exports = server;