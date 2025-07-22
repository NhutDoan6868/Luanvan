const {
  createSizeService,
  getAllSizesService,
  getSizeByIdService,
  updateSizeService,
  deleteSizeService,
} = require("../services/size.service");

const createSize = async (req, res) => {
  const { name, productId } = req.body;
  if (!name || !productId) {
    return res.status(400).json({
      message:
        "Vui lòng cung cấp đầy đủ thông tin: tên kích thước và ID sản phẩm",
    });
  }

  try {
    const data = await createSizeService({ name, productId });
    if (!data.data) {
      return res.status(400).json({ message: data.message });
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getAllSizes = async (req, res) => {
  try {
    const data = await getAllSizesService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getSizeByIdService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateSize = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp dữ liệu để cập nhật" });
  }

  try {
    const data = await updateSizeService(id, updateData);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteSizeService(id);
    if (!data.data) {
      return res.status(404).json({ message: data.message });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
};
