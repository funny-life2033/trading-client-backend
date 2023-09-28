const User = require("../models/User");
const { createSecretToken } = require("../config/SecretToken");

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
    res.json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed!", success: false });
  }
};

module.exports = { signup, login };
