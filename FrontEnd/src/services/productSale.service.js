import axios from "../utils/axios.customize";

export const getSaleProductApi = async (isSale) => {
  try {
    const res = await axios.get("/api/product", {
      params: {
        isSale: isSale,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
