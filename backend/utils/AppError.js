class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Identifies operational errors
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
