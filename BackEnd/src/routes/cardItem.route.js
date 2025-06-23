const express = require("express");
const routerAPi = express.Router();
const {
  createCardItem,
  getAllCardItems,
  getCardItemById,
  updateCardItem,
  deleteCardItem,
} = require("../controllers/cardItem.controller");
const { authenticateAdmin } = require("../controllers/favorite.controller");

routerAPi.post("/create", createCardItem);
routerAPi.get("/", getAllCardItems);
routerAPi.get("/:id", getCardItemById);
routerAPi.put("/:id", updateCardItem);
routerAPi.delete("/:id", deleteCardItem);

module.exports = routerAPi;
