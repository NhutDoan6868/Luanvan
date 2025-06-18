const {
  createAddressService,
  getAllAddressesService,
  getAddressByIdService,
  getAddressesByUserService,
  updateAddressService,
  deleteAddressService,
} = require("../services/address.service");

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

const createAddress = async (req, res) => {
  const { street, city, state, zipCode, country } = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!street || !city || !state || !zipCode || !country) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ thông tin: đường, thành phố, tỉnh, mã bưu điện, quốc gia",
    });
  }

  try {
    const data = await createAddressService(
      { street, city, state, zipCode, country },
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

const getAllAddresses = async (req, res) => {
  try {
    const data = await getAllAddressesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAddressById = async (req, res) => {
  const { id } = req.params;
  const { id: userId, role: userRole } = req.user; // Lấy từ JWT
  try {
    const data = await getAddressByIdService(id, userId, userRole);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAddressesByUser = async (req, res) => {
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await getAddressesByUserService(userId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user.id; // Lấy từ JWT
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateAddressService(id, updateData, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Lấy từ JWT
  try {
    const data = await deleteAddressService(id, userId);
    if (!data.data) {
      return res.status(403).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
  authenticateToken,
  authenticateAdmin,
};
