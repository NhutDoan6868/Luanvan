const Price = require("../models/price");
const Size = require("../models/size");
const {
  createPriceService,
  getAllPricesService,
  getPriceByIdService,
  updatePriceService,
  deletePriceService,
  getPriceBySizeIdService,
} = require("../services/price.service");

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

const createPrice = async (req, res) => {
  const { price, sizeId } = req.body;
  if (price === undefined || !sizeId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ giá và ID kích thước",
    });
  }

  try {
    const data = await createPriceService({ price, sizeId });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllPrices = async (req, res) => {
  try {
    const data = await getAllPricesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getPriceById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getPriceByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getPriceByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    // Kiểm tra productId hợp lệ
    if (!productId) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ID sản phẩm",
        data: null,
      });
    }

    // Lấy kích thước đầu tiên của sản phẩm
    const size = await Size.findOne({ productId }).select("name _id");
    if (!size) {
      return res.status(404).json({
        message: "Không tìm thấy kích thước cho sản phẩm này",
        data: null,
      });
    }

    // Lấy giá cho kích thước
    const price = await Price.findOne({ sizeId: size._id }).select("price");
    if (!price) {
      return res.status(404).json({
        message: "Không tìm thấy giá cho sản phẩm này",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Lấy giá sản phẩm thành công",
      data: {
        sizeId: size._id,
        sizeName: size.name,
        price: price.price,
      },
    });
  } catch (error) {
    console.error(`Lỗi khi lấy giá cho productId ${productId}:`, error);
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updatePrice = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updatePriceService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deletePrice = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deletePriceService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createPrice,
  getAllPrices,
  getPriceById,
  getPriceByProductId,
  updatePrice,
  deletePrice,
  authenticateAdmin,
};
