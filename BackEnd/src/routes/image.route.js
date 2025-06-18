const express = require("express");
const routerAPi = express.Router();
const {
  createImage,
  getAllImages,
  getImageById,
  getImagesByProduct,
  updateImage,
  deleteImage,
  authenticateAdmin,
} = require("../controllers/image.controller");

routerAPi.post("/", authenticateAdmin, createImage);
routerAPi.get("/", getAllImages);
routerAPi.get("/:id", getImageById);
routerAPi.get("/product/:productId", getImagesByProduct);
routerAPi.put("/:id", authenticateAdmin, updateImage);
routerAPi.delete("/:id", authenticateAdmin, deleteImage);

module.exports = routerAPi;
