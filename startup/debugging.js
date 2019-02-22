const morgan = require('morgan');
const startupDebugger = require('debug')('app:startupDebugger');
const dbDebugger = require('debug')('app:DB');

module.exports = function(app) {

    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        // console.log('Morgan is enabled');
        startupDebugger('Morgan is enabled'); //debuggers from different namespaces.
    }
    
    dbDebugger('debugging the DB now..'); //debuggers from different namespaces.
}