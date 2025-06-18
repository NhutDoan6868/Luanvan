const Product = require("../models/product");
const Subcategory = require("../models/subcategory");

const createProductService = async (productData) => {
  try {
    const {
      name,
      description,
      soldQuantity,
      quantity,
      imageURL,
      subcategoryId,
    } = productData;

    // Kiểm tra các trường bắt buộc
    if (!name || !subcategoryId) {
      return {
        message: "Vui lòng cung cấp đầy đủ tên sản phẩm và ID danh mục con",
        data: null,
      };
    }

    // Kiểm tra subcategoryId tồn tại
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return {
        message: "Danh mục con không tồn tại",
        data: null,
      };
    }

    // Kiểm tra quantity và soldQuantity
    if (quantity < 0 || soldQuantity < 0) {
      return {
        message: "Số lượng và số lượng đã bán không được âm",
        data: null,
      };
    }

    const product = await Product.create({
      name,
      description,
      soldQuantity: soldQuantity || 0,
      quantity: quantity || 0,
      imageURL,
      subcategoryId,
    });

    return {
      message: "Tạo sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo sản phẩm: " + error.message);
  }
};

const getAllProductsService = async () => {
  try {
    const products = await Product.find().populate("subcategoryId", "name");
    return {
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách sản phẩm: " + error.message);
  }
};

const getProductByIdService = async (id) => {
  try {
    const product = await Product.findById(id).populate(
      "subcategoryId",
      "name"
    );
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin sản phẩm: " + error.message);
  }
};

const updateProductService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    if (updateData.subcategoryId) {
      const subcategory = await Subcategory.findById(updateData.subcategoryId);
      if (!subcategory) {
        return {
          message: "Danh mục con không tồn tại",
          data: null,
        };
      }
    }

    if (updateData.quantity !== undefined && updateData.quantity < 0) {
      return {
        message: "Số lượng không được âm",
        data: null,
      };
    }

    if (updateData.soldQuantity !== undefined && updateData.soldQuantity < 0) {
      return {
        message: "Số lượng đã bán không được âm",
        data: null,
      };
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("subcategoryId", "name");

    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    return {
      message: "Cập nhật sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật sản phẩm: " + error.message);
  }
};

const deleteProductService = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id).populate(
      "subcategoryId",
      "name"
    );
    if (!product) {
      return {
        message: "Không tìm thấy sản phẩm",
        data: null,
      };
    }
    return {
      message: "Xóa sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa sản phẩm: " + error.message);
  }
};

module.exports = {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
};
