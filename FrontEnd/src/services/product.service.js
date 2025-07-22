import axios from "../utils/axios.customize";

const API_URL = "http://localhost:8080/api/product";

// Lấy danh sách tất cả sản phẩm
export const getAllProductApi = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("API getAllProductApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getAllProductApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm"
    );
  }
};

// Lấy thông tin sản phẩm theo ID
export const getProductByIdApi = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    console.log("API getProductByIdApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getProductByIdApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy thông tin sản phẩm"
    );
  }
};

// Lấy danh sách danh mục con
export const getAllSubcategoriesApi = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/subcategory");
    console.log("API getAllSubcategoriesApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getAllSubcategoriesApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách danh mục con"
    );
  }
};

// Tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, productData);
    console.log("API createProduct response:", response);
    return response.data;
  } catch (error) {
    console.error("API createProduct error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi tạo sản phẩm");
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    console.log("API updateProduct response:", response);
    return response.data;
  } catch (error) {
    console.error("API updateProduct error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật sản phẩm"
    );
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("API deleteProduct response:", response);
    return response.data;
  } catch (error) {
    console.error("API deleteProduct error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
  }
};

// Lấy danh sách kích thước của sản phẩm
export const getProductSizesApi = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/sizes`);
    console.log("API getProductSizesApi response:", response);
    if (!response.data) {
      throw new Error("Dữ liệu trả về từ API rỗng");
    }
    return response.data;
  } catch (error) {
    console.error("API getProductSizesApi error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách kích thước"
    );
  }
};

// Tạo kích thước mới cho sản phẩm
export const createSizeApi = async (productId, sizeData) => {
  try {
    const response = await axios.post(`${API_URL}/${productId}/size`, sizeData);
    console.log("API createSizeApi response:", response);
    return response.data;
  } catch (error) {
    console.error("API createSizeApi error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi tạo kích thước");
  }
};

// Xóa kích thước
export const deleteSizeApi = async (productId, sizeId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${productId}/size/${sizeId}`
    );
    console.log("API deleteSizeApi response:", response);
    return response.data;
  } catch (error) {
    console.error("API deleteSizeApi error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa kích thước");
  }
};

// Thêm hoặc cập nhật giá cho sản phẩm theo size
export const setProductPrice = async (productId, priceData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${productId}/price`,
      priceData
    );
    console.log("API setProductPrice response:", response);
    return response.data;
  } catch (error) {
    console.error("API setProductPrice error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Lỗi khi thiết lập giá sản phẩm"
    );
  }
};

// Xóa giá
export const deletePriceApi = async (productId, sizeId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${productId}/price/${sizeId}`
    );
    console.log("API deletePriceApi response:", response);
    return response.data;
  } catch (error) {
    console.error("API deletePriceApi error:", error.response || error);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa giá");
  }
};
