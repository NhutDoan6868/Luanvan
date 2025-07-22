const express = require("express");
const routerAPi = express.Router();
const {
  createCart,
  addItemToCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  updateCartItem,
  removeItemFromCart,
  deleteCart,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/cart.controller");

routerAPi.post("/create", authenticateToken, createCart);
routerAPi.post("/items", authenticateToken, addItemToCart);
routerAPi.get("/", authenticateAdmin, getAllCarts);
routerAPi.get("/:id", authenticateToken, getCartById);
routerAPi.get("/user/me", authenticateToken, getCartByUser);
routerAPi.put("/:cartId/items/:itemId", authenticateToken, updateCartItem);

routerAPi.delete(
  "/:cartId/items/:itemId",
  authenticateToken,
  removeItemFromCart
);
routerAPi.delete("/:id", authenticateToken, deleteCart);

module.exports = routerAPi;
