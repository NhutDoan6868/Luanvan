const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

const createCategoryService = async (categoryData) => {
  try {
    const { name, description } = categoryData;

    // Kiểm tra trường bắt buộc
    if (!name) {
      return {
        message: "Vui lòng cung cấp tên danh mục",
        data: null,
      };
    }

    // Kiểm tra tên danh mục trùng
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return {
        message: "Tên danh mục đã tồn tại",
        data: null,
      };
    }

    const category = await Category.create({
      name,
      description,
    });

    return {
      message: "Tạo danh mục thành công",
      data: category,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo danh mục: " + error.message);
  }
};

const getAllCategoriesService = async () => {
  try {
    const categories = await Category.find();
    return {
      message: "Lấy danh sách danh mục thành công",
      data: categories,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách danh mục: " + error.message);
  }
};

const getCategoryByIdService = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return {
        message: "Không tìm thấy danh mục",
        data: null,
      };
    }
    // Lấy danh mục con liên quan
    const subcategories = await Subcategory.find({ categoryId: id }).select(
      "name"
    );
    return {
      message: "Lấy thông tin danh mục thành công",
      data: { category, subcategories },
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin danh mục: " + error.message);
  }
};

const updateCategoryService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra tên danh mục trùng
    if (updateData.name) {
      const existingCategory = await Category.findOne({
        name: updateData.name,
      });
      if (existingCategory && existingCategory._id.toString() !== id) {
        return {
          message: "Tên danh mục đã tồn tại",
          data: null,
        };
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return {
        message: "Không tìm thấy danh mục",
        data: null,
      };
    }

    return {
      message: "Cập nhật danh mục thành công",
      data: category,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật danh mục: " + error.message);
  }
};

const deleteCategoryService = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return {
        message: "Không tìm thấy danh mục",
        data: null,
      };
    }

    // Kiểm tra liên kết với danh mục con
    const subcategories = await Subcategory.find({ categoryId: id });
    if (subcategories.length > 0) {
      return {
        message: "Không thể xóa danh mục vì có danh mục con liên quan",
        data: null,
      };
    }

    await Category.findByIdAndDelete(id);
    return {
      message: "Xóa danh mục thành công",
      data: category,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa danh mục: " + error.message);
  }
};

module.exports = {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
};
