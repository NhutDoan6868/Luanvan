const express = require("express");
const routerAPi = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  authenticateToken,
} = require("../controllers/review.controller");

routerAPi.post("/create", authenticateToken, createReview);
routerAPi.get("/", getAllReviews);
routerAPi.get("/:id", getReviewById);
routerAPi.put("/:id", authenticateToken, updateReview);
routerAPi.delete("/:id", authenticateToken, deleteReview);

module.exports = routerAPi;
