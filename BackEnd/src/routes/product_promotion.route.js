const express = require("express");
const routerAPi = express.Router();
const {
  createProductPromotion,
  getAllProductPromotions,
  getProductPromotionById,
  updateProductPromotion,
  deleteProductPromotion,
  getPromotedProducts,
} = require("../controllers/product_promotion.controller");

routerAPi.post("/", createProductPromotion);
routerAPi.get("/", getAllProductPromotions);
routerAPi.get("/promoted", getPromotedProducts);
routerAPi.get("/:id", getProductPromotionById);
routerAPi.put("/:id", updateProductPromotion);
routerAPi.delete("/:id", deleteProductPromotion);

module.exports = routerAPi;
