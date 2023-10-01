const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  userVerification,
  sendVerificationCode,
  emailVerify,
  emailValidate,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/", userVerification);
router.post("/sendVerificationCode", sendVerificationCode);
router.post("/emailVerify", emailVerify);
router.post("/emailValidate", emailValidate);

module.exports = router;
