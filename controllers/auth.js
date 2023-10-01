require("dotenv").config();
const User = require("../models/User");
const { createSecretToken } = require("../config/SecretToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/sendMail");
const emailValidator = require("deep-email-validator");

const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { firstname, lastname, email, password, createdAt } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.json({ message: "User signed in successfully", success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed!", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.json({ message: "User logged in successfully", success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed!", success: false });
  }
};

const userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return res.json({ status: true, user });
      } else return res.json({ status: false });
    }
  });
};

const sendVerificationCode = async (req, res) => {
  const email = req.cookies.email;
  const code = jwt.sign({ email }, process.env.TOKEN_KEY, {
    expiresIn: 24 * 3600,
  });

  const text = `Hi! There, You have recently visited our website and entered your email.
  Please follow the given link to verify your email
  http://localhost:3000/verify/${code} 
  Thanks`;

  const result = await sendMail(email, "Email Verification", text);
  console.log("text: ", text);
  res.json(result);
};

const emailVerify = async (req, res) => {
  const { code } = req.body;
  console.log(code, process.env.TOKEN_KEY);
  jwt.verify(code, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).json({
        message:
          "Email verification failed, possibly the link is invalid or expired",
      });
    } else {
      try {
        const user = await User.findOneAndUpdate(
          { email: decoded.email },
          { isVerified: true }
        );
        res.json({ message: "Email verifified successfully", user });
      } catch (error) {
        res.status(400).json({
          message:
            "Email verification failed, possibly the link is invalid or expired",
        });
      }
    }
  });
};

const emailValidate = async (req, res) => {
  const { email } = req.body;
  try {
    const { valid } = await emailValidator.validate(email);
    console.log(email, valid);
    res.json({ valid });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  signup,
  login,
  userVerification,
  sendVerificationCode,
  emailVerify,
  emailValidate,
};
