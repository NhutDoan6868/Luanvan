const mongoose = require("mongoose");
const promotionSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
