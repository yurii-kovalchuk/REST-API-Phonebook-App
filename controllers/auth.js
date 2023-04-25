const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, registerSchema, loginSchema } = require("../models/user");
const { funcShell, HandleError } = require("../utils");

const register = async (req, res) => {
  const { body } = req;

  const user = await User.findOne({ email: body.email });
  if (user) {
    throw HandleError(409, "Email in use");
  }

  const { error } = registerSchema.validate(body);
  if (error) {
    throw HandleError(400, error.message);
  }

  const hashPass = await bcrypt.hash(body.password, 10);
  const newUser = await User.create({ ...body, password: hashPass });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw HandleError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HandleError(401, "Email or password is wrong");
  }

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    throw HandleError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const { SECRET_KEY } = process.env;
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = { register: funcShell(register), login: funcShell(login) };
