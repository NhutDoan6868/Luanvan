const {
  createCardService,
  addItemToCardService,
  getAllCardsService,
  getCardByIdService,
  getCardByUserService,
  updateCardItemService,
  removeItemFromCardService,
  deleteCardService,
} = require("../services/card.service");

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

const createCard = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await createCardService(userId);
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const addItemToCard = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({
      message: "Vui lòng cung cấp ID sản phẩm và số lượng",
    });
  }

  try {
    const data = await addItemToCardService(userId, { productId, quantity });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllCards = async (req, res) => {
  try {
    const data = await getAllCardsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCardById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await getCardByIdService(id, userId, userRole);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCardByUser = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await getCardByUserService(userId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateCardItem = async (req, res) => {
  const { cardId, itemId } = req.params;
  const updateData = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!updateData.quantity) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp số lượng để cập nhật" });
  }

  try {
    const data = await updateCardItemService(
      cardId,
      itemId,
      updateData,
      userId
    );
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const removeItemFromCard = async (req, res) => {
  const { cardId, itemId } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await removeItemFromCardService(cardId, itemId, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteCard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await deleteCardService(id, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
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
};
