const mongoose = require("mongoose");
const orderstatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
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

const OrderStatus = mongoose.model("OrderStatus", orderstatusSchema);
module.exports = OrderStatus;
