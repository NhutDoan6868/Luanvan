const {
  createReviewService,
  getAllReviewsService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
} = require("../services/review.service");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Yêu cầu token" });
  const jwt = require("jsonwebtoken");
  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Token không hợp lệ" });
      req.user = user;
      next();
    }
  );
};

const createReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!rating || !comment || !productId) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ điểm đánh giá, bình luận và ID sản phẩm",
    });
  }

  try {
    const data = await createReviewService(
      { rating, comment, productId },
      userId
    );
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const data = await getAllReviewsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getReviewByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateReviewService(id, updateData, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await deleteReviewService(id, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  authenticateToken,
};
