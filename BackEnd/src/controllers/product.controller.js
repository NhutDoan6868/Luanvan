const {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getProductSizesService,
  createSizeService,
  deleteSizeService,
  setProductPriceService,
  deletePriceService,
  getProductsGroupedBySubcategoryService, // Thêm service mới
} = require("../services/product.service");

const createProduct = async (req, res) => {
  const {
    name,
    description,
    soldQuantity,
    quantity,
    imageURL,
    subcategoryId,
    sizes,
  } = req.body;
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
      sizes,
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
    const { subcategoryId, categoryId } = req.query;
    const data = await getAllProductsService({
      subcategoryId,
      categoryId,
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getProductsGroupedBySubcategory = async (req, res) => {
  try {
    const { categoryId } = req.query; // Có thể lọc theo categoryId nếu cần
    const data = await getProductsGroupedBySubcategoryService({ categoryId });
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

const getProductSizes = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getProductSizesService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createSize = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const data = await createSizeService(id, { name });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteSize = async (req, res) => {
  const { id, sizeId } = req.params;
  try {
    const data = await deleteSizeService(id, sizeId);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const setProductPrice = async (req, res) => {
  const { id } = req.params;
  const { sizeId, price } = req.body;
  try {
    const data = await setProductPriceService(id, { sizeId, price });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deletePrice = async (req, res) => {
  const { id, sizeId } = req.params;
  try {
    const data = await deletePriceService(id, sizeId);
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
  getProductSizes,
  createSize,
  deleteSize,
  setProductPrice,
  deletePrice,
  getProductsGroupedBySubcategory, // Xuất hàm mới
};
