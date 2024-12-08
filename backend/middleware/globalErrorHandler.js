import AppError from "../utils/AppError.js";

const globalErrorHandler = (err, req, res, next) => {
    console.error("Global error handler invoked:", err);

    if (err instanceof AppError) {
        // Handle custom errors
        return res.status(err.statusCode).json({
            message: err.message, // Use err.message instead of entire err object
        });
    }

    // Handle unexpected errors
    res.status(500).json({
        message: "An unexpected error occurred. Please try again later.",
    });
};

export default globalErrorHandler;