const express = require("express");
const routerAPi = express.Router();
const {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
  authenticateAdmin,
} = require("../controllers/orderItem.controller");

routerAPi.post("/create", authenticateAdmin, createOrderItem);
routerAPi.get("/", authenticateAdmin, getAllOrderItems);
routerAPi.get("/:id", authenticateAdmin, getOrderItemById);
routerAPi.get("/order/:orderId", authenticateAdmin, getOrderItemsByOrder);
routerAPi.put("/:id", authenticateAdmin, updateOrderItem);
routerAPi.delete("/:id", authenticateAdmin, deleteOrderItem);

module.exports = routerAPi;
