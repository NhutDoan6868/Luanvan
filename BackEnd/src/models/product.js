const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    soldQuantity: Number,
    quantity: Number,
    imageURL: String,
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    statistics: {
      rating: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
