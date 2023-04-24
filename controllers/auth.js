const bcrypt = require("bcrypt");

const { User, registerSchema } = require("../models/user");
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

module.exports = { register: funcShell(register) };
