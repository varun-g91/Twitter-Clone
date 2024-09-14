const errorHandler = (err, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message,
    });
};

export default errorHandler;
