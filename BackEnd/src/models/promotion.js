const mongoose = require("mongoose");
const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
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

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
