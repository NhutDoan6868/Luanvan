const Price = require("../models/price");
const Size = require("../models/size");

const createPriceService = async (priceData) => {
  try {
    const { price, sizeId } = priceData;

    // Kiểm tra các trường bắt buộc
    if (price === undefined || !sizeId) {
      return {
        message: "Vui lòng cung cấp đầy đủ giá và ID sản phẩm",
        data: null,
      };
    }

    // Kiểm tra giá hợp lệ
    if (price < 0) {
      return {
        message: "Giá không được âm",
        data: null,
      };
    }

    // Kiểm tra sizeId tồn tại
    const size = await Size.findById(sizeId);
    if (!size) {
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem sản phẩm đã có giá chưa
    const existingPrice = await Price.findOne({ sizeId });
    if (existingPrice) {
      return {
        message: "Sản phẩm đã có giá, vui lòng cập nhật thay vì tạo mới",
        data: null,
      };
    }

    const newPrice = await Price.create({
      price,
      sizeId,
    });

    return {
      message: "Tạo giá sản phẩm thành công",
      data: await Price.findById(newPrice._id).populate("sizeId", "name"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo giá sản phẩm: " + error.message);
  }
};

const getAllPricesService = async () => {
  try {
    const prices = await Price.find().populate("sizeId", "name");
    return {
      message: "Lấy danh sách giá sản phẩm thành công",
      data: prices,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách giá sản phẩm: " + error.message);
  }
};

const getPriceByIdService = async (id) => {
  try {
    const price = await Price.findById(id).populate("sizeId", "name");
    if (!price) {
      return {
        message: "Không tìm thấy giá sản phẩm",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin giá sản phẩm thành công",
      data: price,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin giá sản phẩm: " + error.message);
  }
};

const getPriceBySizeIdService = async (sizeId) => {
  try {
    const size = await Price.findOne({ sizeId });
    if (!size) {
      return {
        message: "Không tìm thấy giá sản phẩm",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin giá sản phẩm thành công",
      data: size,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy giá bằng kích thước" + error.message);
  }
};

const updatePriceService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
       
      };
    }

    if (updateData.price !== undefined && updateData.price < 0) {
      return {
        message: "Giá không được âm",
        data: null,
      };
    }

    if (updateData.sizeId) {
      const size = await Size.findById(updateData.sizeId);
      if (!size) {
        return {
          message: "Sản phẩm không tồn tại",
          data: null,
        };
      }
      const existingPrice = await Price.findOne({
        sizeId: updateData.sizeId,
      });
      if (existingPrice && existingPrice._id.toString() !== id) {
        return {
          message: "Sản phẩm đã có giá khác, không thể gán lại",
          data: null,
        };
      }
    }

    const price = await Price.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("sizeId", "name");

    if (!price) {
      return {
        message: "Không tìm thấy giá sản phẩm",
        data: null,
      };
    }

    return {
      message: "Cập nhật giá sản phẩm thành công",
      data: price,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật giá sản phẩm: " + error.message);
  }
};

const deletePriceService = async (id) => {
  try {
    const price = await Price.findById(id).populate("sizeId", "name");
    if (!price) {
      return {
        message: "Không tìm thấy giá sản phẩm",
        data: null,
      };
    }

    // Kiểm tra liên kết với đơn hàng hoặc giỏ hàng
    const { OrderItem, CartItem } = require("../models");
    const relatedItems = await Promise.all([
      OrderItem.findOne({ sizeId: price.sizeId }),
      CartItem.findOne({ sizeId: price.sizeId }),
    ]);
    if (relatedItems.some((item) => item)) {
      return {
        message:
          "Không thể xóa giá vì sản phẩm đang được sử dụng trong đơn hàng hoặc giỏ hàng",
        data: null,
      };
    }

    await Price.findByIdAndDelete(id);
    return {
      message: "Xóa giá sản phẩm thành công",
      data: price,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa giá sản phẩm: " + error.message);
  }
};

module.exports = {
  createPriceService,
  getAllPricesService,
  getPriceByIdService,
  getPriceBySizeIdService,
  updatePriceService,
  deletePriceService,
};
