const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");

const createReviewService = async (reviewData, userId) => {
  try {
    const { rating, comment, productId } = reviewData;

    // Kiểm tra các trường bắt buộc
    if (!rating || !comment || !productId) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ điểm đánh giá, bình luận và ID sản phẩm",
        data: null,
      };
    }

    // Kiểm tra rating hợp lệ
    if (rating < 1 || rating > 5) {
      return {
        message: "Điểm đánh giá phải từ 1 đến 5",
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

    // Kiểm tra userId tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return {
        message: "Bạn đã đánh giá sản phẩm này rồi",
        data: null,
      };
    }

    const review = await Review.create({
      rating,
      comment,
      userId,
      productId,
    });

    return {
      message: "Tạo đánh giá thành công",
      data: await Review.findById(review._id)
        .populate("userId", "fullName")
        .populate("productId", "name"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo đánh giá: " + error.message);
  }
};

const getAllReviewsService = async () => {
  try {
    const reviews = await Review.find()
      .populate("userId", "fullName")
      .populate("productId", "name");
    return {
      message: "Lấy danh sách đánh giá thành công",
      data: reviews,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách đánh giá: " + error.message);
  }
};

const getReviewByIdService = async (id) => {
  try {
    const review = await Review.findById(id)
      .populate("userId", "fullName")
      .populate("productId", "name");
    if (!review) {
      return {
        message: "Không tìm thấy đánh giá",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin đánh giá thành công",
      data: review,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin đánh giá: " + error.message);
  }
};

const updateReviewService = async (id, updateData, userId) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra đánh giá tồn tại
    const review = await Review.findById(id);
    if (!review) {
      return {
        message: "Không tìm thấy đánh giá",
        data: null,
      };
    }

    // Kiểm tra quyền chỉnh sửa
    if (review.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
        data: null,
      };
    }

    // Kiểm tra rating hợp lệ nếu được cập nhật
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return {
        message: "Điểm đánh giá phải từ 1 đến 5",
        data: null,
      };
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "fullName")
      .populate("productId", "name");

    return {
      message: "Cập nhật đánh giá thành công",
      data: updatedReview,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật đánh giá: " + error.message);
  }
};

const deleteReviewService = async (id, userId) => {
  try {
    const review = await Review.findById(id);
    if (!review) {
      return {
        message: "Không tìm thấy đánh giá",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (review.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa đánh giá này",
        data: null,
      };
    }

    await Review.findByIdAndDelete(id);
    return {
      message: "Xóa đánh giá thành công",
      data: review,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa đánh giá: " + error.message);
  }
};

module.exports = {
  createReviewService,
  getAllReviewsService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
};
