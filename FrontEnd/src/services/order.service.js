import axios from "../utils/axios.customize";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Giả định token được lưu trong localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createOrderApi = async ({
  shippingAddress,
  paymentMethod,
  items,
}) => {
  try {
    const response = await axios.post(
      "/api/order/create",
      { shippingAddress, paymentMethod, items },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Lỗi khi tạo đơn hàng";
    throw new Error(errorMessage);
  }
};

export const getAllOrdersApi = async () => {
  try {
    const response = await axios.get("/api/order/", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi lấy danh sách đơn hàng";
    throw new Error(errorMessage);
  }
};

export const getOrderByIdApi = async (id) => {
  try {
    const response = await axios.get(`/api/order/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi lấy thông tin đơn hàng";
    throw new Error(errorMessage);
  }
};

export const getOrdersByUserApi = async () => {
  try {
    const response = await axios.get("/api/order/user/me", {
      headers: getAuthHeaders(),
    });
    console.log("SERVICE API OBU", response.data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi lấy danh sách đơn hàng của người dùng";
    throw new Error(errorMessage);
  }
};

export const updateOrderApi = async (id, updateData) => {
  try {
    const response = await axios.put(`/api/order/${id}`, updateData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Lỗi khi cập nhật đơn hàng";
    throw new Error(errorMessage);
  }
};

export const deleteOrderApi = async (id) => {
  try {
    const response = await axios.delete(`/api/order/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Lỗi khi xóa đơn hàng";
    throw new Error(errorMessage);
  }
};
