const express = require("express");
const routerAPi = express.Router();
const {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
  authenticateAdmin,
  getImagesByProductId,
} = require("../controllers/image.controller");

routerAPi.post("/create", authenticateAdmin, createImage);
routerAPi.get("/", getAllImages);
routerAPi.get("/:id", getImageById);
routerAPi.get("/product/:productId", getImagesByProductId);
routerAPi.put("/:id", authenticateAdmin, updateImage);
routerAPi.delete("/:id", authenticateAdmin, deleteImage);

module.exports = routerAPi;
