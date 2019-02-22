const winston = require('winston');
// require('winston-mongodb');
// require('express-async-errors');

module.exports = function() {
    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });
    
    // throw new Error('UNHANDLED EXCEPTION');

    // const p = Promise.reject('A rejected promise.')
    // p.then(() => {console.log('inside then')})

    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'exceptions.log' })
    );
    
    process.on('unhandledRejection', (ex) => {
        // winston.error(ex.message, ex);
        // process.exit(1);
        throw ex;
    
    });
    
    winston.add(new winston.transports.File({ filename: 'winstonLogger.log' },
        new winston.transports.Console({ prettyPrint: true }))
    );
    // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/Vidly' }));
}