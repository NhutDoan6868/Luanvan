import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_VITE_BACKEND_URL,
});
console.log("axios check:::::", process.env.REACT_APP_VITE_BACKEND_URL);

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request sent with token:", token);
    return config;
  },
  function (error) {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    console.log("Response received:", response);
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    console.error("Response error:", error.response);
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.log("Unauthorized error, removing token");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return {
          EC: 1,
          EM:
            data.message || "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!",
          data: null,
        };
      }
      if (status === 403) {
        console.log("Forbidden error, removing token");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return {
          EC: 1,
          EM:
            data.message || "Không có quyền truy cập. Vui lòng đăng nhập lại!",
          data: null,
        };
      }
      return data || { EC: 1, EM: "Lỗi server không xác định" };
    }
    return Promise.reject(error);
  }
);

export default instance;
