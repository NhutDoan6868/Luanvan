const express = require("express");
const routerAPi = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
  updatePayment,
  deletePayment,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/payment.controller");

routerAPi.post("/", authenticateAdmin, createPayment);
routerAPi.get("/", authenticateAdmin, getAllPayments);
routerAPi.get("/:id", authenticateToken, getPaymentById);
routerAPi.get("/user/me", authenticateToken, getPaymentsByUser);
routerAPi.put("/:id", authenticateAdmin, updatePayment);
routerAPi.delete("/:id", authenticateAdmin, deletePayment);

module.exports = routerAPi;
