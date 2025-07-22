const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: String,
    city: String,
    addressdetails: String,
    country: String,
  },
  { timestamps: true }
);
const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
