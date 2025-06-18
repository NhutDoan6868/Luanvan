const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
