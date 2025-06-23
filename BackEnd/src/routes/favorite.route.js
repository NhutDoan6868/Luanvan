const express = require("express");
const routerAPi = express.Router();
const {
  addFavorite,
  getAllFavorites,
  getFavoriteById,
  getFavoritesByUser,
  removeFavorite,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/favorite.controller");

routerAPi.post("/create", authenticateToken, addFavorite);
routerAPi.get("/", authenticateAdmin, getAllFavorites);
routerAPi.get("/:id", authenticateToken, getFavoriteById);
routerAPi.get("/user/me", authenticateToken, getFavoritesByUser);
routerAPi.delete("/:id", authenticateToken, removeFavorite);

module.exports = routerAPi;
