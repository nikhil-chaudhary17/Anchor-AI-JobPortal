export const errorHandler = (err, req, res, next) => {
  console.error(err); // full details, only visible to you in server logs

  const statusCode = err.statusCode || 500;

  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again later."
      : err.message; // in dev, show the real message so you can debug

  res.status(statusCode).json({
    success: false,
    message,
  });
};