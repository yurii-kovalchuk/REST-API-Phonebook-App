const express = require("express");

const {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
} = require("../../controllers/auth");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);
router.patch("/", authenticate, updateSubscription);

module.exports = router;
