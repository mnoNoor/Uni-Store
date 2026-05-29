const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large (max 5MB)" });
  }
  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
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
