const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: "",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
