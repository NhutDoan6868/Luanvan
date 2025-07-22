const Image = require("../models/image");
const Product = require("../models/product");

const createImageService = async (imageData) => {
  try {
    const { url, altText, productId } = imageData;

    // Kiểm tra các trường bắt buộc
    if (!url || !productId) {
      return {
        message: "Vui lòng cung cấp đầy đủ URL hình ảnh và ID sản phẩm",
        data: null,
      };
    }

    // Kiểm tra định dạng URL
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(url)) {
      return {
        message: "URL hình ảnh không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra product tồn tại
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }

    const image = await Image.create({
      url,
      altText: altText || "",
      productId,
    });

    return {
      message: "Tạo hình ảnh thành công",
      data: await Image.findById(image._id).populate("productId", "name"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo hình ảnh: " + error.message);
  }
};

const getAllImagesService = async () => {
  try {
    const images = await Image.find().populate("productId", "name");
    return {
      message: "Lấy danh sách hình ảnh thành công",
      data: images,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách hình ảnh: " + error.message);
  }
};

const getImageByIdService = async (id) => {
  try {
    const image = await Image.findById(id).populate("productId", "name");
    if (!image) {
      return {
        message: "Không tìm thấy hình ảnh",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin hình ảnh thành công",
      data: image,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin hình ảnh: " + error.message);
  }
};

const getImagesByProductService = async (productId) => {
  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }

    // Lấy tất cả ảnh thuộc về productId
    const images = await Image.find({ productId });
    console.log("CHECK IMAGES:", images);

    if (images.length > 0) {
      return {
        message: "Lấy danh sách hình ảnh của sản phẩm thành công",
        data: images,
      };
    } else {
      return {
        message: "Không tìm thấy ảnh cho sản phẩm",
        data: [],
      };
    }
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách hình ảnh của sản phẩm: " + error.message
    );
  }
};

const updateImageService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra URL hợp lệ nếu được cập nhật
    if (updateData.url) {
      const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
      if (!urlRegex.test(updateData.url)) {
        return {
          message: "URL hình ảnh không hợp lệ",
          data: null,
        };
      }
    }

    // Kiểm tra product nếu được cập nhật
    if (updateData.product) {
      const product = await Product.findById(updateData.product);
      if (!product) {
        return {
          message: "Sản phẩm không tồn tại",
          data: null,
        };
      }
    }

    const image = await Image.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("productId", "name");

    if (!image) {
      return {
        message: "Không tìm thấy hình ảnh",
        data: null,
      };
    }

    return {
      message: "Cập nhật hình ảnh thành công",
      data: image,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật hình ảnh: " + error.message);
  }
};

const deleteImageService = async (id) => {
  try {
    const image = await Image.findById(id).populate("productId", "name");
    if (!image) {
      return {
        message: "Không tìm thấy hình ảnh",
        data: null,
      };
    }

    await Image.findByIdAndDelete(id);
    return {
      message: "Xóa hình ảnh thành công",
      data: image,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa hình ảnh: " + error.message);
  }
};

module.exports = {
  createImageService,
  getAllImagesService,
  getImageByIdService,
  getImagesByProductService,
  updateImageService,
  deleteImageService,
};
