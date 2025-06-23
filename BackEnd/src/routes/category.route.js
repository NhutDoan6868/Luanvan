const express = require("express");
const routerAPi = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  authenticateAdmin,
} = require("../controllers/category.controller");

routerAPi.post("/create", authenticateAdmin, createCategory);
routerAPi.get("/", getAllCategories);
routerAPi.get("/:id", getCategoryById);
routerAPi.put("/:id", authenticateAdmin, updateCategory);
routerAPi.delete("/:id", authenticateAdmin, deleteCategory);

module.exports = routerAPi;
