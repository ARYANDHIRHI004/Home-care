export const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error(err);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    message: err.message || "Internal server error",
  });
};
