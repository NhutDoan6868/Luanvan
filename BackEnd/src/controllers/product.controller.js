const {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} = require("../services/product.service");

const createProduct = async (req, res) => {
  const { name, description, soldQuantity, quantity, imageURL, subcategoryId } =
    req.body;
  if (!name || !subcategoryId) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ tên sản phẩm và ID danh mục con",
    });
  }

  try {
    const data = await createProductService({
      name,
      description,
      soldQuantity,
      quantity,
      imageURL,
      subcategoryId,
    });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const data = await getAllProductsService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getProductByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!Object.keys(updateData).length) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateProductService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteProductService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
