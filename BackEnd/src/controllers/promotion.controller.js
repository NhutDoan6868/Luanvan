const {
  createPromotionService,
  getAllPromotionsService,
  getPromotionByIdService,
  updatePromotionService,
  deletePromotionService,
} = require("../services/promotion.service");

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

const createPromotion = async (req, res) => {
  const { name, discount, startDate, endDate } = req.body;
  if (!name || !discount || !startDate || !endDate) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ tên, mức giảm giá, ngày bắt đầu và ngày kết thúc",
    });
  }

  try {
    const data = await createPromotionService({
      name,
      discount,
      startDate,
      endDate,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllPromotions = async (req, res) => {
  try {
    const data = await getAllPromotionsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getPromotionById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getPromotionByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updatePromotion = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updatePromotionService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deletePromotion = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deletePromotionService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  authenticateAdmin,
};
