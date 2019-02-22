const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    // console.log('token: ', token);
    if(!token) return res.status(401).send('Unauthorized. Please provide token.')
    try {
        const payload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = payload;
        next();
    } catch(Ex) {
        return res.status(400).send('Invalid token');
    }
}

module.exports = auth;