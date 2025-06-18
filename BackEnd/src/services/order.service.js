const Order = require("../models/order");
const User = require("../models/user");
const Address = require("../models/address");
const Card = require("../models/card");
const CardItem = require("../models/carditem");
const Payment = require("../models/payment");

const createOrderService = async (orderData, userId) => {
  try {
    const { shippingAddress, paymentMethod } = orderData;

    // Kiểm tra các trường bắt buộc
    if (!shippingAddress || !paymentMethod) {
      return {
        message:
          "Vui lòng cung cấp địa chỉ giao hàng và phương thức thanh toán",
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

    // Kiểm tra địa chỉ giao hàng
    const address = await Address.findById(shippingAddress);
    if (!address || address.userId.toString() !== userId) {
      return {
        message:
          "Địa chỉ giao hàng không hợp lệ hoặc không thuộc về người dùng",
        data: null,
      };
    }

    // Lấy giỏ hàng của người dùng
    const card = await Card.findOne({ userId }).populate({
      path: "items",
      populate: { path: "productId", select: "name" },
    });
    if (!card || !card.items.length) {
      return {
        message: "Giỏ hàng trống, không thể tạo đơn hàng",
        data: null,
      };
    }

    // Tính tổng giá
    let total_Price = 0;
    for (const item of card.items) {
      total_Price += item.quantity * item.price;
    }

    // Tạo thanh toán
    const payment = await Payment.create({
      amount: total_Price,
      paymentStatus: "pending",
      paymentMethod,
      orderId: null, // Sẽ cập nhật sau khi tạo đơn hàng
    });

    // Tạo đơn hàng
    const order = await Order.create({
      userId,
      items: card.items.map((item) => item._id),
      total_Price,
      orderstatus: "pending",
      shippingAddress,
      paymentId: payment._id,
    });

    // Cập nhật orderId trong thanh toán
    await Payment.findByIdAndUpdate(payment._id, { orderId: order._id });

    // Xóa các mục trong giỏ hàng
    await CardItem.deleteMany({ _id: { $in: card.items } });
    await Card.findByIdAndUpdate(card._id, { items: [] });

    return {
      message: "Tạo đơn hàng thành công",
      data: await Order.findById(order._id)
        .populate("userId", "fullName")
        .populate("shippingAddress", "street city")
        .populate({
          path: "items",
          populate: { path: "productId", select: "name" },
        })
        .populate("paymentId", "paymentStatus paymentMethod"),
    };
  } catch (error) {
    throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  }
};

const getAllOrdersService = async () => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    return {
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách đơn hàng: " + error.message);
  }
};

const getOrderByIdService = async (id, userId, userRole) => {
  try {
    const order = await Order.findById(id)
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }
    if (userRole !== "admin" && order.userId._id.toString() !== userId) {
      return {
        message: "Bạn không có quyền xem đơn hàng này",
        data: null,
      };
    }
    return {
      message: "Lấy thông tin đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin đơn hàng: " + error.message);
  }
};

const getOrdersByUserService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        message: "Người dùng không tồn tại",
        data: null,
      };
    }

    const orders = await Order.find({ userId })
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");
    return {
      message: "Lấy danh sách đơn hàng của người dùng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error(
      "Lỗi khi lấy danh sách đơn hàng của người dùng: " + error.message
    );
  }
};

const updateOrderService = async (id, updateData, userId, userRole) => {
  try {
    if (!Object.keys(updateData).length) {
      return {
        message: "Vui lòng cung cấp dữ liệu để cập nhật",
        data: null,
      };
    }

    // Kiểm tra đơn hàng tồn tại
    const order = await Order.findById(id);
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    // Kiểm tra quyền chỉnh sửa
    if (userRole !== "admin" && order.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền chỉnh sửa đơn hàng này",
        data: null,
      };
    }

    // Kiểm tra orderstatus hợp lệ
    if (updateData.orderstatus) {
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(updateData.orderstatus)) {
        return {
          message: "Trạng thái đơn hàng không hợp lệ",
          data: null,
        };
      }
      // Không cho phép cập nhật nếu đơn hàng đã delivered hoặc cancelled
      if (["delivered", "cancelled"].includes(order.orderstatus)) {
        return {
          message: "Không thể cập nhật đơn hàng đã giao hoặc đã hủy",
          data: null,
        };
      }
    }

    // Kiểm tra shippingAddress nếu được cập nhật
    if (updateData.shippingAddress) {
      const address = await Address.findById(updateData.shippingAddress);
      if (!address || address.userId.toString() !== order.userId.toString()) {
        return {
          message:
            "Địa chỉ giao hàng không hợp lệ hoặc không thuộc về người dùng",
          data: null,
        };
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "fullName")
      .populate("shippingAddress", "street city")
      .populate({
        path: "items",
        populate: { path: "productId", select: "name" },
      })
      .populate("paymentId", "paymentStatus paymentMethod");

    return {
      message: "Cập nhật đơn hàng thành công",
      data: updatedOrder,
    };
  } catch (error) {
    throw new Error("Lỗi khi cập nhật đơn hàng: " + error.message);
  }
};

const deleteOrderService = async (id, userId, userRole) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      return {
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    // Kiểm tra quyền xóa
    if (userRole !== "admin" && order.userId.toString() !== userId) {
      return {
        message: "Bạn không có quyền xóa đơn hàng này",
        data: null,
      };
    }

    // Không cho phép xóa nếu đơn hàng đã delivered
    if (order.orderstatus === "delivered") {
      return {
        message: "Không thể xóa đơn hàng đã giao",
        data: null,
      };
    }

    // Xóa thanh toán liên quan
    if (order.paymentId) {
      await Payment.findByIdAndDelete(order.paymentId);
    }

    // Xóa các mục CardItem liên quan
    await CardItem.deleteMany({ _id: { $in: order.items } });

    await Order.findByIdAndDelete(id);
    return {
      message: "Xóa đơn hàng thành công",
      data: order,
    };
  } catch (error) {
    throw new Error("Lỗi khi xóa đơn hàng: " + error.message);
  }
};

module.exports = {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByUserService,
  updateOrderService,
  deleteOrderService,
};
