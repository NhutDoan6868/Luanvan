const {
  createOrderItemService,
  getAllOrderItemsService,
  getOrderItemByIdService,
  getOrderItemsByOrderService,
  updateOrderItemService,
  deleteOrderItemService,
} = require("../services/orderitem.service");

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

const createOrderItem = async (req, res) => {
  const { orderId, productId, quantity, price } = req.body;
  if (!orderId || !productId || !quantity || !price) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ orderId, productId, quantity và price",
    });
  }

  try {
    const data = await createOrderItemService({
      orderId,
      productId,
      quantity,
      price,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllOrderItems = async (req, res) => {
  try {
    const data = await getAllOrderItemsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getOrderItemByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrderItemsByOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const data = await getOrderItemsByOrderService(orderId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateOrderItemService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteOrderItemService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createOrderItem,
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrder,
  updateOrderItem,
  deleteOrderItem,
  authenticateAdmin,
};
