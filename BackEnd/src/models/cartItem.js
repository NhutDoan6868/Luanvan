const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartItem =
  mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
