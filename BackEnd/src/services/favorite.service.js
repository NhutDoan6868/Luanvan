const Favorite = require("../models/favorite");
const User = require("../models/user");
const Product = require("../models/product");

const addFavoriteService = async (favoriteData, userId) => {
  try {
    const { productId } = favoriteData;

    // Kiểm tra trường bắt buộc
    if (!productId) {
      return {
        message: "Vui lòng cung cấp ID sản phẩm",
        data: null,
      };
    }

    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra productId tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return {
        message: "Sản phẩm không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return {
        message: "Sản phẩm đã có trong danh sách yêu thích",
        data: null,
      };
    }

    const favorite = await Favorite.create({
      userId,
      productId,
    });

    return {
      message: "Thêm sản phẩm vào danh sách yêu thích thành công",
      data: await Favorite.findById(favorite._id)
        .populate("userId", "fullName")
        .populate("productId", "name"),
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi thêm sản phẩm vào danh sách yêu thích: " + error.message
    );
  }
};

const getAllFavoritesService = async () => {
  try {
    const favorites = await Favorite.find()
      .populate("userId", "fullName")
      .populate("productId", "name");
    return {
      message: "Lấy danh sách yêu thích thành công",
      data: favorites,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách yêu thích: " + error.message);
  }
};

const getFavoriteByIdService = async (id, userId, userRole) => {
  try {
    const favorite = await Favorite.findById(id)
      .populate("userId", "fullName")
      .populate("productId", "name");
    if (!favorite) {
      return {
        message: "Không tìm thấy sản phẩm yêu thích",
        data: null,
      };
    }
    if (userRole !== "admin" && favorite.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem sản phẩm yêu thích này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin sản phẩm yêu thích thành công",
      data: favorite,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy thông tin sản phẩm yêu thích: " + error.message
    );
  }
};

const getFavoritesByUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const favorites = await Favorite.find({ userId })
      .populate("userId", "fullName")
      .populate("productId", "name");
    return {
      message: "Lấy danh sách yêu thích của người dùng thành công",
      data: favorites,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách yêu thích của người dùng: " + error.message
    );
  }
};

const removeFavoriteService = async (id, userId) => {
  try {
    const favorite = await Favorite.findById(id);
    if (!favorite) {
      return {
        message: "Không tìm thấy sản phẩm yêu thích",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (favorite.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa sản phẩm yêu thích này",
        data: null,
      };
    }

    await Favorite.findByIdAndDelete(id);
    return {
      message: "Xóa sản phẩm yêu thích thành công",
      data: favorite,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa sản phẩm yêu thích: " + error.message);
  }
};

module.exports = {
  addFavoriteService,
  getAllFavoritesService,
  getFavoriteByIdService,
  getFavoritesByUserService,
  removeFavoriteService,
};
