const { isValidObjectId } = require("mongoose");

const { HandleError } = require("../utils");

const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.contactId)) {
    next(HandleError(400, "Id is not valid"));
  }
  next();
};

module.exports = isValidId;
