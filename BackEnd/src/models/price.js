const mongoose = require("mongoose");
const priceSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      default: 0,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Price = mongoose.model("Price", priceSchema);
module.exports = Price;
