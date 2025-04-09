export const errorHandler = (err, req, res, next) => {

    console.error("ERROR => ", err.message);
    console.error("ERROR STACK => ", err.stack);

    let statusCode = err.statusCode || err.status || 500;
    let errorMessage = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = Object.values(err.errors).map(e => e.message).join(', ');
    }
    else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        errorMessage = `Invalid ${err.path}: ${err.value}. Must be a valid ObjectId.`;
    }
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        errorMessage = `Duplicate field value entered for: ${field}`;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorMessage = err.message === 'jwt expired' ? 'Token expired' : 'Invalid Token';
    }

    if (statusCode < 400) {
        statusCode = 500;
    }

    res.status(statusCode).json({
        error: errorMessage,
        status: statusCode,
    });
};