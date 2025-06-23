const {
  createSubcategoryService,
  getAllSubcategoriesService,
  getSubcategoryByIdService,
  updateSubcategoryService,
  deleteSubcategoryService,
} = require("../services/subcategory.service");

const createSubcategory = async (req, res) => {
  const { name, description, icon, categoryId } = req.body;
  if (!name || !description || !icon || !categoryId) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ thông tin: tên, mô tả, icon, ID danh mục",
    });
  }

  try {
    const data = await createSubcategoryService({
      name,
      description,
      icon,
      categoryId,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const data = await getAllSubcategoriesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getSubcategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getSubcategoryByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateSubcategoryService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteSubcategoryService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
