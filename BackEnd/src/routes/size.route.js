const express = require("express");
const routerApi = express.Router();
const {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
} = require("../controllers/size.controller");

routerApi.post("/create", createSize);
routerApi.get("/", getAllSizes);
routerApi.get("/:id", getSizeById);
routerApi.put("/:id", updateSize);
routerApi.delete("/:id", deleteSize);

module.exports = routerApi;
