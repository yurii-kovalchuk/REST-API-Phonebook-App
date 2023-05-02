const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const {
  User,
  registerSchema,
  loginSchema,
  schemaForSubscription,
} = require("../models/user");
const { funcShell, HandleError } = require("../utils");

const { SECRET_KEY } = process.env;
const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { body } = req;

  const { error } = registerSchema.validate(body);
  if (error) {
    throw HandleError(400, error.message);
  }

  const user = await User.findOne({ email: body.email });
  if (user) {
    throw HandleError(409, "Email in use");
  }

  const hashPass = await bcrypt.hash(body.password, 10);
  const avatarURL = gravatar.url(body.email);
  const newUser = await User.create({
    ...body,
    password: hashPass,
    avatarURL,
  });

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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { body } = req;
  const { _id: id } = req.user;

  const { error } = schemaForSubscription.validate(body);
  if (error) {
    throw HandleError(400);
  }

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updatedUser) {
    throw HandleError(404);
  }

  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;

  if (!req.file) {
    throw HandleError(400);
  }

  const { path: tempUpload, originalname } = req.file;

  const jimpInstance = await Jimp.read(tempUpload);
  await jimpInstance.resize(250, 250).writeAsync(tempUpload);

  const newFilename = `${id}_${originalname}`;
  const resultUpload = path.join(avatarDir, newFilename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", newFilename);
  await User.findByIdAndUpdate(id, { avatarURL });

  res.status(200).json({ avatarURL });
};

module.exports = {
  register: funcShell(register),
  login: funcShell(login),
  logout: funcShell(logout),
  getCurrent: funcShell(getCurrent),
  updateSubscription: funcShell(updateSubscription),
  updateAvatar: funcShell(updateAvatar),
};
