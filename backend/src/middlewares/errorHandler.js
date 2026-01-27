const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (res.headersSent) {
    return next(error);
  }

  const status = error.statusCode || 500;
  const response = {
    message: error.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(status).json(response);
};

export default errorHandler;
