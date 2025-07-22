const express = require("express");
const routerAPi = express.Router();
const {
  createPrice,
  getAllPrices,
  getPriceById,
  updatePrice,
  deletePrice,
  authenticateAdmin,
  getPriceByProductId,
} = require("../controllers/price.controller");

routerAPi.post("/create", authenticateAdmin, createPrice);
routerAPi.get("/", getAllPrices);
routerAPi.get("/:id", getPriceById);
routerAPi.get("/product/:productId", getPriceByProductId); // Sửa tuyến
routerAPi.put("/:id", authenticateAdmin, updatePrice);
routerAPi.delete("/:id", authenticateAdmin, deletePrice);

module.exports = routerAPi;
