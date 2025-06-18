const {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} = require("../services/category.service");

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

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "Vui lòng cung cấp tên danh mục",
    });
  }

  try {
    const data = await createCategoryService({ name, description });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const data = await getAllCategoriesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getCategoryByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateCategoryService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteCategoryService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  authenticateAdmin,
};
