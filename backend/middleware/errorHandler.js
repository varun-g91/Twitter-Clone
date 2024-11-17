const errorHandler = (error, res) => {
    // Set the status code to error.statusCode if defined, else default to 500
    const statusCode = error.statusCode || 500;

    if (res && res.status) {
        // Send the response with the appropriate status code and error message
        res.status(statusCode).json({ message: error.message });
    } else {
        // Log error details if response object is unavailable
        console.error('Error in errorHandler:', error.message);
    }
};

export default errorHandler;
