const express = require("express");
const routerAPi = express.Router();
const {
  createCard,
  addItemToCard,
  getAllCards,
  getCardById,
  getCardByUser,
  updateCardItem,
  removeItemFromCard,
  deleteCard,
  authenticateToken,
  authenticateAdmin,
} = require("../controllers/card.controller");

routerAPi.post("/", authenticateToken, createCard);
routerAPi.post("/items", authenticateToken, addItemToCard);
routerAPi.get("/", authenticateAdmin, getAllCards);
routerAPi.get("/:id", authenticateToken, getCardById);
routerAPi.get("/user/me", authenticateToken, getCardByUser);
routerAPi.put("/:cardId/items/:itemId", authenticateToken, updateCardItem);
routerAPi.delete(
  "/:cardId/items/:itemId",
  authenticateToken,
  removeItemFromCard
);
routerAPi.delete("/:id", authenticateToken, deleteCard);

module.exports = routerAPi;
