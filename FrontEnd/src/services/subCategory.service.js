import axios from "../utils/axios.customize";

const API_URL = "http://localhost:8080/api/subcategory";

// Lấy danh sách tất cả danh mục con
export const getAllSubcategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách danh mục con"
    );
  }
};

// Lấy thông tin danh mục con theo ID
export const getSubcategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thông tin danh mục con"
    );
  }
};

// Tạo danh mục con mới
export const createSubcategory = async (subcategoryData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, subcategoryData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi tạo danh mục con"
    );
  }
};

// Cập nhật danh mục con
export const updateSubcategory = async (id, subcategoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, subcategoryData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật danh mục con"
    );
  }
};

// Xóa danh mục con
export const deleteSubcategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi xóa danh mục con"
    );
  }
};
