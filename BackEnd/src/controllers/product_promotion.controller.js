const {
  createProductPromotionService,
  getAllProductPromotionsService,
  getProductPromotionByIdService,
  updateProductPromotionService,
  deleteProductPromotionService,
  getPromotedProductsService,
} = require("../services/product_promotion.service");

const createProductPromotion = async (req, res) => {
  const { productId, promotionId } = req.body;
  if (!productId || !promotionId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ productId và promotionId",
    });
  }

  try {
    const data = await createProductPromotionService({
      productId,
      promotionId,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllProductPromotions = async (req, res) => {
  try {
    const data = await getAllProductPromotionsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
const getPromotedProducts = async (req, res) => {
  try {
    const data = await getPromotedProductsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: " + error.message,
    });
  }
};

const getProductPromotionById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getProductPromotionByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateProductPromotion = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateProductPromotionService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteProductPromotion = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteProductPromotionService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createProductPromotion,
  getAllProductPromotions,
  getProductPromotionById,
  updateProductPromotion,
  deleteProductPromotion,
  getPromotedProducts,
};
