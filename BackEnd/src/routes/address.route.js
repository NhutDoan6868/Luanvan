const express = require("express");
const routerAPi = express.Router();
const {
  createAddress,
  getAllAddresses,
  getAddressById,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/address.controller");

routerAPi.post("/create", authenticateToken, createAddress);
routerAPi.get("/", authenticateAdmin, getAllAddresses);
routerAPi.get("/:id", authenticateToken, getAddressById);
routerAPi.get("/user/me", authenticateToken, getAddressesByUser);
routerAPi.put("/:id", authenticateToken, updateAddress);
routerAPi.delete("/:id", authenticateToken, deleteAddress);

module.exports = routerAPi;
