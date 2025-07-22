const {
  createCartService,
  addItemToCartService,
  getAllCartsService,
  getCartByIdService,
  getCartByUserService,
  updateCartItemService,
  removeItemFromCartService,
  deleteCartService,
} = require("../services/cart.service");

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

const createCart = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await createCartService(userId);
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const addItemToCart = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  const { productId, quantity, sizeId } = req.body;
  if (!productId || !quantity || !sizeId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp ID sản phẩm và số lượng",
    });
  }

  try {
    const data = await addItemToCartService(userId, {
      productId,
      quantity,
      sizeId,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const data = await getAllCartsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCartById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await getCartByIdService(id, userId, userRole);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCartByUser = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  console.log("userId", userId);
  try {
    const data = await getCartByUserService(userId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { cartId, itemId } = req.params;
  const updateData = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!updateData.quantity) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp số lượng để cập nhật" });
  }

  try {
    const data = await updateCartItemService(
      cartId,
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

const removeItemFromCart = async (req, res) => {
  const { cartId, itemId } = req.params;
  const userId = req.user.id; // Lấy từ JWT

  try {
    const data = await removeItemFromCartService(cartId, itemId, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await deleteCartService(id, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createCart,
  addItemToCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  updateCartItem,
  removeItemFromCart,
  deleteCart,
  authenticateToken,
  authenticateAdmin,
};
