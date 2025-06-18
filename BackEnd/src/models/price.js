const mongoose = require("mongoose");
const priceSchema = new mongoose.Schema({
  price: {
    type: Number,
    default: 0,
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
const Price = mongoose.model("Price", priceSchema);
module.exports = Price;
