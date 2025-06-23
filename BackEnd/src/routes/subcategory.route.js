const express = require("express");
const routerAPi = express.Router();
const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategory.controller");
const { authenticateAdmin } = require("../../middleware/authenticateAdmin");
console.log("Subcategory routes loaded", authenticateAdmin);
routerAPi.post("/create", authenticateAdmin, createSubcategory);
routerAPi.get("/", getAllSubcategories);
routerAPi.get("/:id", getSubcategoryById);
routerAPi.put("/:id", authenticateAdmin, updateSubcategory);
routerAPi.delete("/:id", authenticateAdmin, deleteSubcategory);

module.exports = routerAPi;
