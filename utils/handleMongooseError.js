const handleMongooseError = (error, data, next) => {
  error.status = error.code === 11000 ? 409 : 400;

  next();
};

module.exports = handleMongooseError;
