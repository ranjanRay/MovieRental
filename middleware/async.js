module.exports = function (handler) {
    return (req, res, next) => {
        try{
            handler(req, res);
        } catch (Ex) {
            next(Ex);
        }
    }
}