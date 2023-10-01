const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide your first name."],
  },
  lastname: {
    type: String,
    required: [true, "Please provide your last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: [true, "Email Exist!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
