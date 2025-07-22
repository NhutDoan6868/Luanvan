import axios from "../utils/axios.customize";

const API_URL = "http://localhost:8080/api/user";

// Lấy thông tin người dùng hiện tại
export const getUserInfoApi = async () => {
  try {
    const response = await axios.get("/api/user/me");
    return response.data;
  } catch (error) {
    return error.response?.data || { EC: 1, EM: "Đã có lỗi xảy ra!" };
  }
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách người dùng"
    );
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thông tin người dùng"
    );
  }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi tạo người dùng");
  }
};

// Cập nhật người dùng
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật người dùng"
    );
  }
};

// Xóa người dùng
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lỗi khi xóa người dùng");
  }
};
