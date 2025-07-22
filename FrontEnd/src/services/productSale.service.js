import axios from "../utils/axios.customize";

export const getSaleProductApi = async () => {
  try {
    const res = await axios.get("/api/product/sale");
    console.log("check service", res);
    if (!res) {
      console.warn("No data received from server");
      return []; // Trả về mảng rỗng nếu không có res.data
    }
    return res || []; // Trả về mảng rỗng nếu res.data.data không tồn tại
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error fetching sale products:", errorMessage, error.stack);
    return []; // Trả về mảng rỗng trong trường hợp lỗi
  }
};
