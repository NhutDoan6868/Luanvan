const express = require("express");
const routerAPi = express.Router();
const {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  authenticateAdmin,
} = require("../controllers/promotion.controller");

routerAPi.post("/", authenticateAdmin, createPromotion);
routerAPi.get("/", getAllPromotions);
routerAPi.get("/:id", getPromotionById);
routerAPi.put("/:id", authenticateAdmin, updatePromotion);
routerAPi.delete("/:id", authenticateAdmin, deletePromotion);

module.exports = routerAPi;
