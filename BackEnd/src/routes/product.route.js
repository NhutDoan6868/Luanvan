const express = require("express");
const routerAPi = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductSizes,
  createSize,
  deleteSize,
  setProductPrice,
  deletePrice,
  getProductsGroupedBySubcategory, // Thêm hàm mới
} = require("../controllers/product.controller");

routerAPi.post("/create", createProduct);
routerAPi.get("/", getAllProducts);
routerAPi.get("/grouped-by-subcategory", getProductsGroupedBySubcategory); // Thêm endpoint mới
routerAPi.get("/:id", getProductById);
routerAPi.put("/:id", updateProduct);
routerAPi.delete("/:id", deleteProduct);
routerAPi.get("/:id/sizes", getProductSizes);
routerAPi.post("/:id/size", createSize);
routerAPi.delete("/:id/size/:sizeId", deleteSize);
routerAPi.post("/:id/price", setProductPrice);
routerAPi.delete("/:id/price/:sizeId", deletePrice);

module.exports = routerAPi;
