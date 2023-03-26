const logger = require('./logging');

//Class for form validation errors
class CustomError extends Error {
    constructor(statuscode=500, message="Something went wrong. Please try again later", type='GenericError') {
        super(message);
        this.status = 'error';
        this.statuscode = statuscode;
        this.type = type;
    }
};

class ValidationError extends CustomError {
    constructor(message, formErrors) {
        super(422, message, 'ValidationError');
        this.formErrors = formErrors;
    }
}


function errorHandler(err, req, res, next) {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Something went wrong. Please try again.";

    logger.error(`${err.stack} for request ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);

    console.log(err);

    res.status(err.statuscode).json(err);
}

module.exports = { errorHandler, CustomError, ValidationError }
