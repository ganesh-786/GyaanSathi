const errorHandler = (err, req, res, next) => {
  console.error("Error stack:", err.stack);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    return res.status(404).json({
      success: false,
      message,
      error: message,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = "Duplicate field value entered";

    // Extract field name for better error message
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    if (field === "username") {
      message = `Username '${value}' is already taken`;
    } else if (field === "email") {
      message = `Email '${value}' is already registered`;
    } else if (field === "title") {
      message = `A course with title '${value}' already exists`;
    }

    return res.status(400).json({
      success: false,
      message,
      error: message,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: message,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: "Authentication failed",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      error: "Please login again",
    });
  }

  // Rate limiting error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Too many requests",
      error: "Please try again later",
    });
  }

  // Default error
  const statusCode = error.statusCode || err.status || 500;
  const message = error.message || "Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
