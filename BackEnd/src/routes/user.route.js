const express = require("express");
const routerAPi = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

routerAPi.post("/register", createUser);
routerAPi.post("/login", loginUser);
routerAPi.get("/", getAllUsers);
routerAPi.get("/:id", getUserById);
routerAPi.put("/:id", updateUser);
routerAPi.delete("/:id", deleteUser);

module.exports = routerAPi;
