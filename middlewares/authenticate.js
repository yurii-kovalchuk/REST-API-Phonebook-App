const jwt = require("jsonwebtoken");

const { HandleError } = require("../utils");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HandleError(401));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HandleError(401));
    }

    req.user = user;
    next();
  } catch {
    next(HandleError(401));
  }
};

module.exports = authenticate;
