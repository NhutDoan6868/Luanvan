const express = require("express");
const routerAPi = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

routerAPi.post("/create", createProduct);
routerAPi.get("/", getAllProducts);
routerAPi.get("/:id", getProductById);
routerAPi.put("/:id", updateProduct);
routerAPi.delete("/:id", deleteProduct);

module.exports = routerAPi;
