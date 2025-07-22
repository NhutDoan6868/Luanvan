import axios from "../utils/axios.customize";

export const addItemToCartApi = async ({ productId, quantity, sizeId }) => {
  try {
    const res = await axios.post("/api/cart/items", {
      productId,
      quantity,
      sizeId,
    });
    return res.data;
  } catch (error) {
    // Kiểm tra an toàn các thuộc tính của error
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi thêm vào giỏ hàng";
    throw new Error(errorMessage);
  }
};
export const getCartByUserApi = async () => {
  try {
    const res = await axios.get("/api/cart/user/me");
    return res;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi lấy giỏ hàng của người dùng";
    throw new Error(errorMessage);
  }
};
export const removeItemFromCartApi = async (cartId, itemId) => {
  try {
    const res = await axios.delete(`/api/cart/${cartId}/items/${itemId}`);
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi xóa mục khỏi giỏ hàng";
    throw new Error(errorMessage);
  }
};
export const updateCartItemService = async (cartId, itemId, quantity) => {
  try {
    const response = await axios.put(`/api/cart/${cartId}/items/${itemId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật số lượng"
    );
  }
};
