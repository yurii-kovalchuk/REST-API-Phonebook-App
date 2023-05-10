const express = require("express");

const {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  verifyEmail,
} = require("../../controllers/auth");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:verificationToken", verifyEmail);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

router.patch("/", authenticate, updateSubscription);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
