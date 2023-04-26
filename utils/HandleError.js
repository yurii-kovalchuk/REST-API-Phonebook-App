const markupErrMessage = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HandleError = (status, message = markupErrMessage[status]) => {
  const error = new Error();
  error.message = message;
  error.status = status;
  return error;
};

module.exports = HandleError;
