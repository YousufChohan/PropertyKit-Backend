const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },

  profilepic: {
    type: String,
    default: "",
  },

  posts: {
    type: Array,
    default: [],
  },
  demands: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  mobile: {
    type: String,
    default: "",
  },
  agency: {
    type: String,
    default: "",
  },
  allmessages: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
