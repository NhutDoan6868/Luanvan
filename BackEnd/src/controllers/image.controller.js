const {
  createImageService,
  getAllImagesService,
  getImageByIdService,
  getImagesByProductService,
  updateImageService,
  deleteImageService,
} = require("../services/image.service");

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

const createImage = async (req, res) => {
  const { url, altText, productId } = req.body;
  if (!url || !productId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ URL hình ảnh và ID sản phẩm",
    });
  }

  try {
    const data = await createImageService({ url, altText, productId });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const data = await getAllImagesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getImageById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getImageByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getImagesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await getImagesByProductService(productId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateImage = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateImageService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteImageService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createImage,
  getAllImages,
  getImageById,
  getImagesByProductId,
  updateImage,
  deleteImage,
  authenticateAdmin,
};
