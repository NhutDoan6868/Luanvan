const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
