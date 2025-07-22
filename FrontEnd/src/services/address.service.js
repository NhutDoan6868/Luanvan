import axios from "axios";
import { message } from "antd";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const createAddress = async (addressData, token) => {
  try {
    console.log("Sending address data:", addressData); // Debug
    const response = await axios.post(
      `${API_URL}/api/address/create`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Create address response:", response.data); // Debug
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error(
      "Error creating address:",
      error.response?.data || error.message
    ); // Debug
    const errorMessage = error.response?.data?.message || error.message;
    message.error("Lỗi khi tạo địa chỉ: " + errorMessage);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      window.location.href = "/login";
    }
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};
export const getAddressesByUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/address/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data || [],
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    message.error("Lỗi khi lấy danh sách địa chỉ: " + errorMessage);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      window.location.href = "/login";
    }
    return {
      success: false,
      message: errorMessage,
      data: [],
    };
  }
};

export const updateAddress = async (addressId, addressData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/address/${addressId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    message.error("Lỗi khi cập nhật địa chỉ: " + errorMessage);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      window.location.href = "/login";
    }
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};

export const deleteAddress = async (addressId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/address/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    message.error("Lỗi khi xóa địa chỉ: " + errorMessage);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      window.location.href = "/login";
    }
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }
};
