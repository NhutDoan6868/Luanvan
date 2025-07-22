import axios from "../utils/axios.customize";

const API_URL = "http://localhost:8080/api/promotion";

// Lấy danh sách tất cả khuyến mãi
export const getAllPromotionsApi = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("API getAllPromotionsApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getAllPromotionsApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách khuyến mãi"
    );
  }
};

// Lấy thông tin khuyến mãi theo ID
export const getPromotionByIdApi = async (promotionId) => {
  try {
    const response = await axios.get(`${API_URL}/${promotionId}`);
    console.log("API getPromotionByIdApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getPromotionByIdApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thông tin khuyến mãi"
    );
  }
};

// Tạo khuyến mãi mới
export const createPromotion = async (promotionData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, promotionData);
    console.log("API createPromotion response:", response);
    return response.data;
  } catch (error) {
    console.error("API createPromotion error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi tạo khuyến mãi");
  }
};

// Cập nhật khuyến mãi
export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, promotionData);
    console.log("API updatePromotion response:", response);
    return response.data;
  } catch (error) {
    console.error("API updatePromotion error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật khuyến mãi"
    );
  }
};

// Xóa khuyến mãi
export const deletePromotion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("API deletePromotion response:", response);
    return response.data;
  } catch (error) {
    console.error("API deletePromotion error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa khuyến mãi");
  }
};
