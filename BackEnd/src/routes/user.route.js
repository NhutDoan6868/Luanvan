const express = require("express");
const path = require("path");
const routerAPi = express.Router();

const {
  createUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
} = require("../controllers/user.controller");

routerAPi.use(express.static(path.join(__dirname, "public")));

routerAPi.post("/register", createUser);
routerAPi.post("/createAdmin", createAdmin);
routerAPi.post("/login", loginUser);
routerAPi.get("/me", getCurrentUser);
routerAPi.get("/", getAllUsers);
routerAPi.get("/:id", getUserById);
routerAPi.put("/:id", updateUser);
routerAPi.delete("/:id", deleteUser);

module.exports = routerAPi;
