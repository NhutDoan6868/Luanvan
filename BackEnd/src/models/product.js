const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  soldQuantity: Number,
  quantity: Number,
  imageURL: String,
  price: {
    price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  creadtedAt: Date,
  updatedAt: Date,
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
