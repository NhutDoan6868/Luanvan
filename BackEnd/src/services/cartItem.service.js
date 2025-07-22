const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");

const createCartItem = async (cartItemData) => {
  try {
    const newCartItem = new CartItem(cartItemData);
    return await newCartItem.save();
  } catch (error) {
    throw new Error(`Lỗi khi tạo mục giỏ hàng: ${error.message}`);
  }
};

const getAllCartItems = async () => {
  try {
    return await CartItem.find().populate("productId cartId");
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách mục giỏ hàng: ${error.message}`);
  }
};

const getCartItemById = async (id) => {
  try {
    const item = await CartItem.findById(id).populate("productId cartId");
    if (!item) {
      throw new Error("Không tìm thấy mục giỏ hàng");
    }
    return item;
  } catch (error) {
    throw new Error(`Lỗi khi lấy mục giỏ hàng: ${error.message}`);
  }
};

const updateCartItem = async (id, updateData) => {
  try {
    const item = await CartItem.findByIdAndUpdate(id, updateData, {
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

const deleteCartItem = async (id) => {
  try {
    const item = await CartItem.findByIdAndDelete(id);
    if (!item) {
      throw new Error("Không tìm thấy mục giỏ hàng");
    }
    return { message: "Xóa mục giỏ hàng thành công" };
  } catch (error) {
    throw new Error(`Lỗi khi xóa mục giỏ hàng: ${error.message}`);
  }
};

module.exports = {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
