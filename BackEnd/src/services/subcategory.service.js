const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

const createSubcategoryService = async (subcategoryData) => {
  try {
    const { name, categoryId } = subcategoryData;

    // Kiểm tra danh mục tồn tại
    const category = await Category.findById(categoryId);
    if (!category) {
      return {
        message: "Danh mục không tồn tại",
        data: null,
      };
    }

    // Kiểm tra subcategory đã tồn tại trong danh mục
    const existingSubcategory = await Subcategory.findOne({ name, categoryId });
    if (existingSubcategory) {
      return {
        message: "Danh mục con đã tồn tại trong danh mục này",
        data: null,
      };
    }

    const subcategory = await Subcategory.create(subcategoryData);
    return {
      message: "Tạo danh mục con thành công",
      data: subcategory,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo danh mục con: " + error.message);
  }
};

const getAllSubcategoriesService = async () => {
  try {
    const subcategories = await Subcategory.find().populate(
      "categoryId",
      "name"
    );
    return {
      message: "Lấy danh sách danh mục con thành công",
      data: subcategories,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách danh mục con: " + error.message);
  }
};

const getSubcategoryByIdService = async (id) => {
  try {
    const subcategory = await Subcategory.findById(id).populate(
      "categoryId",
      "name"
    );
    if (!subcategory) {
      return {
        message: "Không tìm thấy danh mục con",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin danh mục con thành công",
      data: subcategory,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin danh mục con: " + error.message);
  }
};

const updateSubcategoryService = async (id, updateData) => {
  try {
    if (updateData.name && updateData.categoryId) {
      const existingSubcategory = await Subcategory.findOne({
        name: updateData.name,
        categoryId: updateData.categoryId,
        _id: { $ne: id },
      });
      if (existingSubcategory) {
        return {
          message: "Danh mục con đã tồn tại trong danh mục này",
          data: null,
        };
      }
    }

    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return {
          message: "Danh mục không tồn tại",
          data: null,
        };
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    if (!subcategory) {
      return {
        message: "Không tìm thấy danh mục con",
        data: null,
      };
    }
    return {
      message: "Cập nhật danh mục con thành công",
      data: subcategory,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật danh mục con: " + error.message);
  }
};

const deleteSubcategoryService = async (id) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return {
        message: "Không tìm thấy danh mục con",
        data: null,
      };
    }
    return {
      message: "Xóa danh mục con thành công",
      data: subcategory,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa danh mục con: " + error.message);
  }
};

module.exports = {
  createSubcategoryService,
  getAllSubcategoriesService,
  getSubcategoryByIdService,
  updateSubcategoryService,
  deleteSubcategoryService,
};
