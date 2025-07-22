const Promotion = require("../models/promotion");
const ProductPromotion = require("../models/product_promotion");

const createPromotionService = async (promotionData) => {
  try {
    const { name, discount, startDate, endDate } = promotionData;

    // Kiểm tra các trường bắt buộc
    if (!name || !discount || !startDate || !endDate) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ tên, mức giảm giá, ngày bắt đầu và ngày kết thúc",
        data: null,
      };
    }

    // Kiểm tra discount hợp lệ
    if (discount < 0 || discount > 100) {
      return {
        message: "Mức giảm giá phải từ 0 đến 100%",
        data: null,
      };
    }

    // Kiểm tra ngày hợp lệ
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return {
        message: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ",
        data: null,
      };
    }
    if (start >= end) {
      return {
        message: "Ngày bắt đầu phải sớm hơn ngày kết thúc",
        data: null,
      };
    }

    // Kiểm tra tên khuyến mãi trùng
    const existingPromotion = await Promotion.findOne({ name });
    if (existingPromotion) {
      return {
        message: "Tên khuyến mãi đã tồn tại",
        data: null,
      };
    }

    const promotion = await Promotion.create({
      name,
      discount,
      startDate: start,
      endDate: end,
    });

    return {
      message: "Tạo khuyến mãi thành công",
      data: promotion,
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo khuyến mãi: " + error.message);
  }
};

const getAllPromotionsService = async () => {
  try {
    const promotions = await Promotion.find();
    console.log("CCCCCCCC", promotions);

    return {
      message: "Lấy danh sách khuyến mãi thành công",
      data: promotions,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách khuyến mãi: " + error.message);
  }
};

const getPromotionByIdService = async (id) => {
  try {
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return {
        message: "Không tìm thấy khuyến mãi",
        data: null,
      };
    }
    // Lấy danh sách sản phẩm liên quan
    const productPromotions = await ProductPromotion.find({
      promotionId: id,
    }).populate("productId", "name");
    return {
      message: "Lấy thông tin khuyến mãi thành công",
      data: { promotion, products: productPromotions },
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin khuyến mãi: " + error.message);
  }
};

const updatePromotionService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra tên khuyến mãi trùng
    if (updateData.name) {
      const existingPromotion = await Promotion.findOne({
        name: updateData.name,
      });
      if (existingPromotion && existingPromotion._id.toString() !== id) {
        return {
          message: "Tên khuyến mãi đã tồn tại",
          data: null,
        };
      }
    }

    // Kiểm tra discount hợp lệ
    if (
      updateData.discount &&
      (updateData.discount < 0 || updateData.discount > 100)
    ) {
      return {
        message: "Mức giảm giá phải từ 0 đến 100%",
        data: null,
      };
    }

    // Kiểm tra ngày hợp lệ
    if (updateData.startDate || updateData.endDate) {
      const promotion = await Promotion.findById(id);
      if (!promotion) {
        return {
          message: "Không tìm thấy khuyến mãi",
          data: null,
        };
      }
      const start = updateData.startDate
        ? new Date(updateData.startDate)
        : new Date(promotion.startDate);
      const end = updateData.endDate
        ? new Date(updateData.endDate)
        : new Date(promotion.endDate);
      if (isNaN(start) || isNaN(end)) {
        return {
          message: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ",
          data: null,
        };
      }
      if (start >= end) {
        return {
          message: "Ngày bắt đầu phải sớm hơn ngày kết thúc",
          data: null,
        };
      }
    }

    const promotion = await Promotion.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!promotion) {
      return {
        message: "Không tìm thấy khuyến mãi",
        data: null,
      };
    }

    return {
      message: "Cập nhật khuyến mãi thành công",
      data: promotion,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật khuyến mãi: " + error.message);
  }
};

const deletePromotionService = async (id) => {
  try {
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return {
        message: "Không tìm thấy khuyến mãi",
        data: null,
      };
    }

    // Kiểm tra liên kết với sản phẩm
    const productPromotions = await ProductPromotion.find({ promotionId: id });
    if (productPromotions.length > 0) {
      return {
        message: "Không thể xóa khuyến mãi vì có sản phẩm liên quan",
        data: null,
      };
    }

    await Promotion.findByIdAndDelete(id);
    return {
      message: "Xóa khuyến mãi thành công",
      data: promotion,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa khuyến mãi: " + error.message);
  }
};
const getActivePromotionsService = async () => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    return {
      message: "Lấy danh sách khuyến mãi đang hoạt động thành công",
      data: promotions,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách khuyến mãi: " + error.message);
  }
};

module.exports = {
  createPromotionService,
  getAllPromotionsService,
  getPromotionByIdService,
  updatePromotionService,
  deletePromotionService,
  getActivePromotionsService,
};
