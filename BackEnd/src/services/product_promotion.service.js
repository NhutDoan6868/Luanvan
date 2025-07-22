const ProductPromotion = require("../models/product_promotion");
const Product = require("../models/product");
const Promotion = require("../models/promotion");

const createProductPromotionService = async (productPromotionData) => {
  try {
    const { productId, promotionId } = productPromotionData;

    // Kiểm tra dữ liệu đầu vào
    if (!productId || !promotionId) {
      return {
        message: "Vui lòng cung cấp đầy đủ productId và promotionId",
        data: null,
      };
    }

    // Kiểm tra xem liên kết đã tồn tại chưa
    const existingProductPromotion = await ProductPromotion.findOne({
      productId,
      promotionId,
    });
    if (existingProductPromotion) {
      return {
        message: "Liên kết giữa sản phẩm và khuyến mãi đã tồn tại",
        data: null,
      };
    }

    const productPromotion = await ProductPromotion.create({
      productId,
      promotionId,
    });

    return {
      EC: 0,
      EM: "Tạo liên kết sản phẩm-khuyến mãi thành công",
      data: productPromotion,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi tạo liên kết sản phẩm-khuyến mãi: " + error.message
    );
  }
};

const getAllProductPromotionsService = async () => {
  try {
    const productPromotions = await ProductPromotion.find()
      .populate("productId")
      .populate("promotionId");
    return {
      message: "Lấy danh sách liên kết sản phẩm-khuyến mãi thành công",
      data: productPromotions,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách liên kết sản phẩm-khuyến mãi: " + error.message
    );
  }
};

const getPromotedProductsService = async () => {
  try {
    // Lấy tất cả liên kết ProductPromotion, populate productId và promotionId
    const productPromotions = await ProductPromotion.find()
      .populate({
        path: "productId",
        select: "name price description", // Chọn các trường cần thiết từ Product
      })
      .populate({
        path: "promotionId",
        select: "discount startDate endDate", // Chọn các trường cần thiết từ Promotion
      });

    // Lọc các khuyến mãi còn hiệu lực (dựa trên startDate và endDate)
    const currentDate = new Date();
    console.log("check date", currentDate);
    const validPromotions = productPromotions.filter((pp) => {
      const promotion = pp.promotionId;
      return promotion;
    });

    // Trích xuất thông tin sản phẩm và khuyến mãi
    const promotedProducts = validPromotions.map((pp) => ({
      product: pp.productId,
      promotion: pp.promotionId,
    }));

    if (!promotedProducts.length) {
      return {
        message: "Không có sản phẩm nào đang được khuyến mãi",
        data: [],
      };
    }

    return {
      message: "Lấy danh sách sản phẩm đang khuyến mãi thành công",
      data: promotedProducts,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách sản phẩm đang khuyến mãi: " + error.message
    );
  }
};

const getProductPromotionByIdService = async (id) => {
  try {
    const productPromotion = await ProductPromotion.findById(id)
      .populate("productId")
      .populate("promotionId");
    if (!productPromotion) {
      return {
        message: "Không tìm thấy liên kết sản phẩm-khuyến mãi",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin liên kết sản phẩm-khuyến mãi thành công",
      data: productPromotion,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy thông tin liên kết sản phẩm-khuyến mãi: " + error.message
    );
  }
};

const updateProductPromotionService = async (id, updateData) => {
  try {
    if (Object.keys(updateData).length === 0) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra xem liên kết mới có trùng lặp không
    if (updateData.productId && updateData.promotionId) {
      const existingProductPromotion = await ProductPromotion.findOne({
        productId: updateData.productId,
        promotionId: updateData.promotionId,
        _id: { $ne: id },
      });
      if (existingProductPromotion) {
        return {
          message: "Liên kết giữa sản phẩm và khuyến mãi đã tồn tại",
          data: null,
        };
      }
    }

    const productPromotion = await ProductPromotion.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("productId")
      .populate("promotionId");

    if (!productPromotion) {
      return {
        message: "Không tìm thấy liên kết sản phẩm-khuyến mãi",
        data: null,
      };
    }
    return {
      message: "Cập nhật liên kết sản phẩm-khuyến mãi thành công",
      data: productPromotion,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi cập nhật liên kết sản phẩm-khuyến mãi: " + error.message
    );
  }
};

const deleteProductPromotionService = async (id) => {
  try {
    const productPromotion = await ProductPromotion.findByIdAndDelete(id)
      .populate("productId")
      .populate("promotionId");
    if (!productPromotion) {
      return {
        message: "Không tìm thấy liên kết sản phẩm-khuyến mãi",
        data: null,
      };
    }
    return {
      message: "Xóa liên kết sản phẩm-khuyến mãi thành công",
      data: productPromotion,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi xóa liên kết sản phẩm-khuyến mãi: " + error.message
    );
  }
};

module.exports = {
  createProductPromotionService,
  getAllProductPromotionsService,
  getProductPromotionByIdService,
  updateProductPromotionService,
  deleteProductPromotionService,
  getPromotedProductsService,
};
