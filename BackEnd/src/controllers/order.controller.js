const {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByUserService,
  updateOrderService,
  deleteOrderService,
} = require("../services/order.service");

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

const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items } = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!shippingAddress || !paymentMethod || !items) {
    return res.status(400).json({
      message: "Vui lòng cung cấp địa chỉ giao hàng và phương thức thanh toán",
    });
  }

  try {
    const data = await createOrderService(
      { shippingAddress, paymentMethod, items },
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

const getAllOrders = async (req, res) => {
  try {
    const data = await getAllOrdersService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await getOrderByIdService(id, userId, userRole);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await getOrdersByUserService(userId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateOrderService(id, updateData, userId, userRole);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await deleteOrderService(id, userId, userRole);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  authenticateToken,
  authenticateAdmin,
};
