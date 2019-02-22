module.exports = function(req, res, next) {
    console.log('Inside admin');
    console.log('req.user: ', req.user);
    if(!req.user.isAdmin) return res.status(403).send('Forbidden.')
    next();
}