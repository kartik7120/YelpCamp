module.exports = function (fn) {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
}