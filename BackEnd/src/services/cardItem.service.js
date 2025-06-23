const CardItem = require("../models/cardItem.model");
const createCardItem = async (cardItemData) => {
  try {
    const newCardItem = new CardItem(cardItemData);
    return await newCardItem.save();
  } catch (error) {
    throw new Error(`Lỗi khi tạo mục giỏ hàng: ${error.message}`);
  }
};

const getAllCardItems = async () => {
  try {
    return await CardItem.find().populate("productId cardId");
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách mục giỏ hàng: ${error.message}`);
  }
};

const getCardItemById = async (id) => {
  try {
    const item = await CardItem.findById(id).populate("productId cardId");
    if (!item) {
      throw new Error("Không tìm thấy mục giỏ hàng");
    }
    return item;
  } catch (error) {
    throw new Error(`Lỗi khi lấy mục giỏ hàng: ${error.message}`);
  }
};

const updateCardItem = async (id, updateData) => {
  try {
    const item = await CardItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw new Error("Không tìm thấy mục giỏ hàng");
    }
    return item;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật mục giỏ hàng: ${error.message}`);
  }
};

const deleteCardItem = async (id) => {
  try {
    const item = await CardItem.findByIdAndDelete(id);
    if (!item) {
      throw new Error("Không tìm thấy mục giỏ hàng");
    }
    return { message: "Xóa mục giỏ hàng thành công" };
  } catch (error) {
    throw new Error(`Lỗi khi xóa mục giỏ hàng: ${error.message}`);
  }
};

module.exports = {
  createCardItem,
  getAllCardItems,
  getCardItemById,
  updateCardItem,
  deleteCardItem,
};
