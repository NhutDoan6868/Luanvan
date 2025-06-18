const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  phone: String,
  role: String,

  isAdmin: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
