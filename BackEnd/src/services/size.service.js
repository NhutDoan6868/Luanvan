const Size = require("../models/size");
const mongoose = require("mongoose");

const createSizeService = async (sizeData) => {
  try {
    const { name, productId } = sizeData;

    // Kiểm tra productId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return {
        message: "ID sản phẩm không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra tên kích thước
    if (!name || name.trim() === "") {
      return {
        message: "Tên kích thước không được để trống",
        data: null,
      };
    }

    // Kiểm tra kích thước đã tồn tại cho sản phẩm
    const existingSize = await Size.findOne({ name, productId });
    if (existingSize) {
      return {
        message: `Kích thước ${name} đã tồn tại cho sản phẩm này`,
        data: null,
      };
    }

    const size = await Size.create({ name, productId });

    return {
      EC: 0,
      EM: "Tạo kích thước thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo kích thước: " + error.message);
  }
};

const getAllSizesService = async () => {
  try {
    const sizes = await Size.find().populate("productId", "name");
    return {
      message: "Lấy danh sách kích thước thành công",
      data: sizes,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách kích thước: " + error.message);
  }
};

const getSizeByIdService = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        message: "ID kích thước không hợp lệ",
        data: null,
      };
    }

    const size = await Size.findById(id).populate("productId", "name");
    if (!size) {
      return {
        message: "Không tìm thấy kích thước",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin kích thước thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin kích thước: " + error.message);
  }
};

const updateSizeService = async (id, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        message: "ID kích thước không hợp lệ",
        data: null,
      };
    }

    if (
      updateData.productId &&
      !mongoose.Types.ObjectId.isValid(updateData.productId)
    ) {
      return {
        message: "ID sản phẩm không hợp lệ",
        data: null,
      };
    }

    if (updateData.name) {
      const existingSize = await Size.findOne({
        name: updateData.name,
        productId: updateData.productId || (await Size.findById(id)).productId,
        _id: { $ne: id },
      });
      if (existingSize) {
        return {
          message: `Kích thước ${updateData.name} đã tồn tại cho sản phẩm này`,
          data: null,
        };
      }
    }

    const size = await Size.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("productId", "name");

    if (!size) {
      return {
        message: "Không tìm thấy kích thước",
        data: null,
      };
    }
    return {
      message: "Cập nhật kích thước thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật kích thước: " + error.message);
  }
};

const deleteSizeService = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        message: "ID kích thước không hợp lệ",
        data: null,
      };
    }

    const size = await Size.findByIdAndDelete(id).populate("productId", "name");
    if (!size) {
      return {
        message: "Không tìm thấy kích thước",
        data: null,
      };
    }
    return {
      message: "Xóa kích thước thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa kích thước: " + error.message);
  }
};

module.exports = {
  createSizeService,
  getAllSizesService,
  getSizeByIdService,
  updateSizeService,
  deleteSizeService,
};
