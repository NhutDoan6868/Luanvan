const {
  addFavoriteService,
  getAllFavoritesService,
  getFavoriteByIdService,
  getFavoritesByUserService,
  removeFavoriteService,
} = require("../services/favorite.service");

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

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Yêu cầu token" });
  const jwt = require("jsonwebtoken");
  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, user) => {
      if (err || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Chỉ admin được phép thực hiện" });
      }
      req.user = user;
      next();
    }
  );
};

const addFavorite = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!productId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp ID sản phẩm",
    });
  }

  try {
    const data = await addFavoriteService({ productId }, userId);
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllFavorites = async (req, res) => {
  try {
    const data = await getAllFavoritesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getFavoriteById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await getFavoriteByIdService(id, userId, userRole);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getFavoritesByUser = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await getFavoritesByUserService(userId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const removeFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await removeFavoriteService(id, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  addFavorite,
  getAllFavorites,
  getFavoriteById,
  getFavoritesByUser,
  removeFavorite,
  authenticateToken,
  authenticateAdmin,
};
