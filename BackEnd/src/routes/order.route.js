const express = require("express");
const routerAPi = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/order.controller");

routerAPi.post("/", authenticateToken, createOrder);
routerAPi.get("/", authenticateAdmin, getAllOrders);
routerAPi.get("/:id", authenticateToken, getOrderById);
routerAPi.get("/user/me", authenticateToken, getOrdersByUser);
routerAPi.put("/:id", authenticateToken, updateOrder);
routerAPi.delete("/:id", authenticateToken, deleteOrder);

module.exports = routerAPi;
