import axios from "../utils/axios.customize";

const API_URL = "http://localhost:8080/api/category";

// Lấy danh sách tất cả danh mục
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("API getAllCategories response:", response); // Log để kiểm tra
    return response.data;
  } catch (error) {
    console.error("API getAllCategories error:", error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách danh mục"
    );
  }
};

// Lấy thông tin danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thông tin danh mục"
    );
  }
};

// Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi tạo danh mục");
  }
};

// Cập nhật danh mục
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật danh mục"
    );
  }
};

// Xóa danh mục
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi xóa danh mục");
  }
};
