const Payment = require("../models/payment");
const Order = require("../models/order");

const createPaymentService = async (paymentData) => {
  try {
    const { amount, paymentStatus, paymentMethod, orderId } = paymentData;

    // Kiểm tra các trường bắt buộc
    if (!amount || !paymentMethod || !orderId) {
      return {
        message:
          "Vui lòng cung cấp đầy đủ số tiền, phương thức thanh toán và ID đơn hàng",
        data: null,
      };
    }

    // Kiểm tra amount hợp lệ
    if (amount < 0) {
      return {
        message: "Số tiền không được âm",
        data: null,
      };
    }

    // Kiểm tra paymentStatus hợp lệ
    const validStatuses = ["pending", "completed", "failed"];
    if (paymentStatus && !validStatuses.includes(paymentStatus)) {
      return {
        message: "Trạng thái thanh toán không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra paymentMethod hợp lệ
    const validMethods = ["credit_card", "paypal", "bank_transfer"];
    if (!validMethods.includes(paymentMethod)) {
      return {
        message: "Phương thức thanh toán không hợp lệ",
        data: null,
      };
    }

    // Kiểm tra orderId tồn tại
    const order = await Order.findById(orderId).populate("userId", "fullName");
    if (!order) {
      return {
        message: "Đơn hàng không tồn tại",
        data: null,
      };
    }

    // Kiểm tra xem đơn hàng đã có thanh toán chưa
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return {
        message: "Đơn hàng đã có thanh toán, vui lòng cập nhật thay vì tạo mới",
        data: null,
      };
    }

    const payment = await Payment.create({
      amount,
      paymentStatus: paymentStatus || "pending",
      paymentMethod,
      orderId,
    });

    return {
      message: "Tạo thanh toán thành công",
      data: await Payment.findById(payment._id).populate({
        path: "orderId",
        select: "total_Price orderstatus",
        populate: { path: "userId", select: "fullName" },
      }),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo thanh toán: " + error.message);
  }
};

const getAllPaymentsService = async () => {
  try {
    const payments = await Payment.find().populate({
      path: "orderId",
      select: "total_Price orderstatus",
      populate: { path: "userId", select: "fullName" },
    });
    return {
      message: "Lấy danh sách thanh toán thành công",
      data: payments,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách thanh toán: " + error.message);
  }
};

const getPaymentByIdService = async (id) => {
  try {
    const payment = await Payment.findById(id).populate({
      path: "orderId",
      select: "total_Price orderstatus",
      populate: { path: "userId", select: "fullName" },
    });
    if (!payment) {
      return {
        message: "Không tìm thấy thanh toán",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin thanh toán thành công",
      data: payment,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin thanh toán: " + error.message);
  }
};

const getPaymentsByUserService = async (userId) => {
  try {
    // Tìm tất cả đơn hàng của người dùng
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return {
        message: "Người dùng không có đơn hàng nào",
        data: null,
      };
    }

    // Tìm thanh toán liên quan đến các đơn hàng
    const payments = await Payment.find({
      orderId: { $in: orders.map((order) => order._id) },
    }).populate({
      path: "orderId",
      select: "total_Price orderstatus",
      populate: { path: "userId", select: "fullName" },
    });

    return {
      message: "Lấy danh sách thanh toán của người dùng thành công",
      data: payments,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách thanh toán của người dùng: " + error.message
    );
  }
};

const updatePaymentService = async (id, updateData) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra amount hợp lệ
    if (updateData.amount !== undefined && updateData.amount < 0) {
      return {
        message: "Số tiền không được âm",
        data: null,
      };
    }

    // Kiểm tra paymentStatus hợp lệ
    if (updateData.paymentStatus) {
      const validStatuses = ["pending", "completed", "failed"];
      if (!validStatuses.includes(updateData.paymentStatus)) {
        return {
          message: "Trạng thái thanh toán không hợp lệ",
          data: null,
        };
      }
    }

    // Kiểm tra paymentMethod hợp lệ
    if (updateData.paymentMethod) {
      const validMethods = ["credit_card", "paypal", "bank_transfer"];
      if (!validMethods.includes(updateData.paymentMethod)) {
        return {
          message: "Phương thức thanh toán không hợp lệ",
          data: null,
        };
      }
    }

    // Kiểm tra orderId nếu được cập nhật
    if (updateData.orderId) {
      const order = await Order.findById(updateData.orderId);
      if (!order) {
        return {
          message: "Đơn hàng không tồn tại",
          data: null,
        };
      }
      const existingPayment = await Payment.findOne({
        orderId: updateData.orderId,
      });
      if (existingPayment && existingPayment._id.toString() !== id) {
        return {
          message: "Đơn hàng đã có thanh toán khác, không thể gán lại",
          data: null,
        };
      }
    }

    const payment = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "orderId",
      select: "total_Price orderstatus",
      populate: { path: "userId", select: "fullName" },
    });

    if (!payment) {
      return {
        message: "Không tìm thấy thanh toán",
        data: null,
      };
    }

    return {
      message: "Cập nhật thanh toán thành công",
      data: payment,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật thanh toán: " + error.message);
  }
};

const deletePaymentService = async (id) => {
  try {
    const payment = await Payment.findById(id).populate({
      path: "orderId",
      select: "total_Price orderstatus",
      populate: { path: "userId", select: "fullName" },
    });
    if (!payment) {
      return {
        message: "Không tìm thấy thanh toán",
        data: null,
      };
    }

    await Payment.findByIdAndDelete(id);
    return {
      message: "Xóa thanh toán thành công",
      data: payment,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa thanh toán: " + error.message);
  }
};

module.exports = {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  getPaymentsByUserService,
  updatePaymentService,
  deletePaymentService,
};
