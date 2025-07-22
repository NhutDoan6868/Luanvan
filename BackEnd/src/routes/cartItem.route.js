const express = require("express");
const routerAPi = express.Router();
const {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartItem.controller");
const { authenticateAdmin } = require("../controllers/favorite.controller");

routerAPi.post("/create", createCartItem);
routerAPi.get("/", getAllCartItems);
routerAPi.get("/:id", getCartItemById);
routerAPi.put("/:id", updateCartItem);
routerAPi.delete("/:id", deleteCartItem);

module.exports = routerAPi;
