const logger = require('./logging');

module.exports = function errorHandler(err, req, res, next) {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Something went wrong. Please try again later.";

    logger.error(err.stack);

    res.status(err.statuscode).json({
        status: 'error',
        message: err.message
    });
}
